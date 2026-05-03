
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import multer from "multer";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pg from "pg";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@campusroom.jp").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const VERIFICATION_NOTIFY_EMAIL = process.env.VERIFICATION_NOTIFY_EMAIL || "csgi1014@gmail.com";
const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB || 8);

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Production requires PostgreSQL.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined
});

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 400 }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"].includes(file.mimetype);
    cb(ok ? null : new Error("Unsupported file type"), ok);
  }
});

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined,
  credentials: process.env.R2_ACCESS_KEY_ID ? {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  } : undefined
});

async function query(sql, params = []) {
  const { rows } = await pool.query(sql, params);
  return rows;
}

async function one(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nickname TEXT NOT NULL,
      university TEXT NOT NULL,
      faculty TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      verified BOOLEAN NOT NULL DEFAULT FALSE,
      verification_status TEXT NOT NULL DEFAULT 'none',
      verification_file_key TEXT,
      verification_original_name TEXT,
      verification_uploaded_at BIGINT,
      created_at BIGINT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      board TEXT NOT NULL,
      display_university TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at BIGINT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS likes (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      created_at BIGINT NOT NULL,
      PRIMARY KEY(user_id, post_id)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at BIGINT NOT NULL
    );
  `);

  const admin = await one("SELECT id FROM users WHERE email = $1", [ADMIN_EMAIL]);
  if (!admin) {
    await query(`
      INSERT INTO users
      (id, name, nickname, university, faculty, email, password_hash, role, verified, verification_status, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'admin',TRUE,'approved',$8)
    `, [uuidv4(), ADMIN_NAME, "Admin", "Campus Room JP", "Admin", ADMIN_EMAIL, bcrypt.hashSync(ADMIN_PASSWORD, 10), Date.now()]);
  }

  const count = await one("SELECT COUNT(*)::int AS c FROM posts");
  const adminUser = await one("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (count?.c === 0 && adminUser) {
    const now = Date.now();
    const samples = [
      ["就活", "関西の大学", "最終面接前って、何を準備すればいい？", "自己PRとガクチカは準備したけど、逆質問がまだ弱い気がする。みんな何を聞いてる？", now - 720000],
      ["授業", "立命館大学", "映像系のレポート、引用ってどこまで必要？", "授業資料と自分の感想を中心に書きたいけど、理論の部分だけ引用すればいいのかな。", now - 2200000],
      ["生活", "匿名", "一人暮らしで月5万円貯金って現実的？", "家賃7万円くらいで考えてるけど、車も持ちたい。節約してる人の内訳が知りたい。", now - 5400000]
    ];
    for (const p of samples) {
      await query("INSERT INTO posts (id,user_id,board,display_university,title,body,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)", [uuidv4(), adminUser.id, ...p]);
    }
  }
}

function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    nickname: u.nickname,
    university: u.university,
    faculty: u.faculty,
    email: u.email,
    role: u.role,
    verified: Boolean(u.verified),
    verificationStatus: u.verification_status,
    verificationOriginalName: u.verification_original_name,
    verificationUploadedAt: u.verification_uploaded_at
  };
}

function sign(u) {
  return jwt.sign({ id: u.id, role: u.role }, JWT_SECRET, { expiresIn: "7d" });
}

function sendCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

async function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "AUTH_REQUIRED" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await one("SELECT * FROM users WHERE id = $1", [decoded.id]);
    if (!user) return res.status(401).json({ error: "AUTH_REQUIRED" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "AUTH_REQUIRED" });
  }
}

async function authOptional(req, _res, next) {
  const token = req.cookies.token;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await one("SELECT * FROM users WHERE id = $1", [decoded.id]);
  } catch {}
  next();
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "ADMIN_REQUIRED" });
  next();
}

function requireVerified(req, res, next) {
  if (!req.user?.verified) return res.status(403).json({ error: "VERIFICATION_REQUIRED" });
  next();
}

function getMailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !VERIFICATION_NOTIFY_EMAIL) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 465),
    secure: String(SMTP_SECURE || "true") === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

async function uploadToR2(file, userId) {
  if (!process.env.R2_BUCKET || !process.env.R2_ACCESS_KEY_ID) {
    return { key: null, skipped: true };
  }
  const ext = path.extname(file.originalname || "");
  const key = `student-ids/${userId}/${Date.now()}-${uuidv4()}${ext}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      originalName: encodeURIComponent(file.originalname || "student-id")
    }
  }));
  return { key, skipped: false };
}

async function deleteFromR2(key) {
  if (!key || !process.env.R2_BUCKET || !process.env.R2_ACCESS_KEY_ID) return;
  try {
    await r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
  } catch {}
}

async function notifyVerificationUpload(user, file, storageKey) {
  const mailer = getMailer();
  if (!mailer) return { sent: false, reason: "SMTP_NOT_CONFIGURED" };

  await mailer.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: VERIFICATION_NOTIFY_EMAIL,
    subject: `[Campus Room JP] 学生証アップロード: ${user.university} / ${user.name}`,
    text: [
      "学生証画像がアップロードされ、自動承認されました。",
      "",
      `氏名: ${user.name}`,
      `ニックネーム: ${user.nickname}`,
      `大学: ${user.university}`,
      `学部: ${user.faculty}`,
      `メール: ${user.email}`,
      `Storage Key: ${storageKey || "R2 not configured"}`,
      "",
      "添付ファイルを確認し、問題があれば管理者画面から認証を取り消してください。"
    ].join("\n"),
    attachments: [{ filename: file.originalname, content: file.buffer, contentType: file.mimetype }]
  });

  return { sent: true };
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.post("/api/signup", async (req, res) => {
  const { name, nickname, university, faculty, email, password } = req.body;
  if (!name || !nickname || !university || !faculty || !email || !password) return res.status(400).json({ error: "MISSING_FIELDS" });
  if (String(password).length < 6) return res.status(400).json({ error: "PASSWORD_TOO_SHORT" });
  // Validate nickname: allow 2 to 20 characters consisting of Korean, Japanese, or Latin letters and numbers
  const nicknamePattern = /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\p{Script=Hangul}A-Za-z0-9]{2,20}$/u;
  if (!nicknamePattern.test(String(nickname))) return res.status(400).json({ error: "INVALID_NICKNAME" });
  const normalizedEmail = String(email).trim().toLowerCase();
  const exists = await one("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
  if (exists) return res.status(409).json({ error: "EMAIL_EXISTS" });

  const id = uuidv4();
  // Determine whether the email belongs to an educational institution. Domains ending with .ac.jp, .ac.kr, .edu, or containing .ac. are considered educational.
  const emailDomain = normalizedEmail.split("@").pop() || "";
  const isEducationalEmail = /\.ac\.|\.ac\.jp$|\.ac\.kr$|\.edu$/.test(emailDomain);
  // If email is educational, auto-verify the user; otherwise keep unverified until student ID is uploaded.
  const isVerified = isEducationalEmail;
  const verificationStatus = isEducationalEmail ? 'approved' : 'none';
  await query(`
    INSERT INTO users
    (id,name,nickname,university,faculty,email,password_hash,role,verified,verification_status,created_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,'user',${isVerified ? 'TRUE' : 'FALSE'},'${verificationStatus}',$8)
  `, [id, name, nickname, university, faculty, normalizedEmail, bcrypt.hashSync(password, 10), Date.now()]);

  const user = await one("SELECT * FROM users WHERE id = $1", [id]);
  sendCookie(res, sign(user));
  res.json({ user: publicUser(user) });
});

app.post("/api/login", async (req, res) => {
  const user = await one("SELECT * FROM users WHERE email = $1", [String(req.body.email || "").trim().toLowerCase()]);
  if (!user || !bcrypt.compareSync(String(req.body.password || ""), user.password_hash)) {
    return res.status(401).json({ error: "INVALID_LOGIN" });
  }
  sendCookie(res, sign(user));
  res.json({ user: publicUser(user) });
});

app.post("/api/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

app.post("/api/verification/upload", requireAuth, upload.single("studentId"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "FILE_REQUIRED" });

  const oldUser = await one("SELECT verification_file_key FROM users WHERE id = $1", [req.user.id]);
  if (oldUser?.verification_file_key) await deleteFromR2(oldUser.verification_file_key);

  const stored = await uploadToR2(req.file, req.user.id);
  await query(`
    UPDATE users
    SET verified = TRUE,
        verification_status = 'approved',
        verification_file_key = $1,
        verification_original_name = $2,
        verification_uploaded_at = $3
    WHERE id = $4
  `, [stored.key, req.file.originalname, Date.now(), req.user.id]);

  const updatedUser = await one("SELECT * FROM users WHERE id = $1", [req.user.id]);

  let mail = { sent: false };
  try { mail = await notifyVerificationUpload(updatedUser, req.file, stored.key); }
  catch (err) { mail = { sent: false, reason: err.message }; }

  res.json({ user: publicUser(updatedUser), storage: stored, mail });
});

app.get("/api/posts", authOptional, async (req, res) => {
  const board = req.query.board || "全部";
  const search = String(req.query.search || "").toLowerCase();
  const sort = req.query.sort || "new";

  const rows = await query(`
    SELECT p.*,
      u.nickname AS author_nickname,
      COUNT(DISTINCT l.user_id)::int AS like_count,
      COUNT(DISTINCT c.id)::int AS comment_count,
      CASE WHEN $1::text IS NULL THEN FALSE
           ELSE EXISTS(SELECT 1 FROM likes lx WHERE lx.user_id = $1 AND lx.post_id = p.id)
      END AS liked
    FROM posts p
    LEFT JOIN users u ON u.id = p.user_id
    LEFT JOIN likes l ON l.post_id = p.id
    LEFT JOIN comments c ON c.post_id = p.id
    WHERE ($2 = '全部' OR p.board = $2)
      AND ($3 = '' OR LOWER(p.title || ' ' || p.body || ' ' || p.board || ' ' || p.display_university) LIKE '%' || $3 || '%')
      -- For university-specific board, limit posts to same university or anonymous. If not logged in, show none.
      AND (
        $2 <> '大学別'
        OR (
          COALESCE($1::text, '') <> '' AND (
            p.display_university = '匿名'
            OR p.display_university = (SELECT university FROM users WHERE id = $1)
            OR u.university = (SELECT university FROM users WHERE id = $1)
          )
        )
      )
    GROUP BY p.id, u.nickname
    ORDER BY
      CASE WHEN $4 = 'popular' THEN COUNT(DISTINCT l.user_id) END DESC,
      p.created_at DESC
  `, [req.user?.id || null, board, search, sort]);

  res.json({ posts: rows.map(p => ({
    id: p.id,
    board: p.board,
    displayUniversity: p.display_university,
    title: p.title,
    body: p.body,
    createdAt: Number(p.created_at),
    authorNickname: p.author_nickname,
    likeCount: p.like_count,
    commentCount: p.comment_count,
    liked: p.liked,
    canDelete: req.user ? (req.user.role === "admin" || p.user_id === req.user.id) : false
  }))});
});

app.post("/api/posts", requireAuth, requireVerified, async (req, res) => {
  const { board, displayUniversity, title, body } = req.body;
  if (!board || !title || !body) return res.status(400).json({ error: "MISSING_FIELDS" });
  const id = uuidv4();
  await query("INSERT INTO posts (id,user_id,board,display_university,title,body,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)", [id, req.user.id, board, displayUniversity || "匿名", title, body, Date.now()]);
  res.json({ ok: true, id });
});

app.delete("/api/posts/:id", requireAuth, async (req, res) => {
  const post = await one("SELECT * FROM posts WHERE id = $1", [req.params.id]);
  if (!post) return res.status(404).json({ error: "NOT_FOUND" });
  if (req.user.role !== "admin" && post.user_id !== req.user.id) return res.status(403).json({ error: "FORBIDDEN" });
  await query("DELETE FROM posts WHERE id = $1", [post.id]);
  res.json({ ok: true });
});

app.post("/api/posts/:id/like", requireAuth, async (req, res) => {
  const exists = await one("SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2", [req.user.id, req.params.id]);
  if (exists) {
    await query("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", [req.user.id, req.params.id]);
    return res.json({ liked: false });
  }
  await query("INSERT INTO likes (user_id,post_id,created_at) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING", [req.user.id, req.params.id, Date.now()]);
  res.json({ liked: true });
});

app.get("/api/posts/:id/comments", authOptional, async (req, res) => {
  const comments = await query("SELECT id, user_id, body, created_at FROM comments WHERE post_id = $1 ORDER BY created_at ASC", [req.params.id]);
  // Assign a unique anonymous number per commenter within this post. The first commenter becomes 匿名1, the next new commenter 匿名2, and so on.
  const anonMap = {};
  let counter = 0;
  const mapped = comments.map(c => {
    if (!anonMap[c.user_id]) {
      counter += 1;
      anonMap[c.user_id] = counter;
    }
    const canDelete = req.user && (req.user.id === c.user_id || req.user.role === 'admin');
    return { id: c.id, body: c.body, createdAt: Number(c.created_at), nickname: `匿名${anonMap[c.user_id]}`, canDelete };
  });
  res.json({ comments: mapped });
});

app.post("/api/posts/:id/comments", requireAuth, requireVerified, async (req, res) => {
  const body = String(req.body.body || "").trim();
  if (!body) return res.status(400).json({ error: "MISSING_BODY" });
  await query("INSERT INTO comments (id,user_id,post_id,body,created_at) VALUES ($1,$2,$3,$4,$5)", [uuidv4(), req.user.id, req.params.id, body, Date.now()]);
  res.json({ ok: true });
});

// Delete a comment. Only the author of the comment or an admin can delete.
app.delete("/api/posts/:postId/comments/:commentId", requireAuth, async (req, res) => {
  const { postId, commentId } = req.params;
  const comment = await one("SELECT user_id FROM comments WHERE id = $1 AND post_id = $2", [commentId, postId]);
  if (!comment) return res.status(404).json({ error: "NOT_FOUND" });
  if (comment.user_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: "FORBIDDEN" });
  await query("DELETE FROM comments WHERE id = $1", [commentId]);
  res.json({ ok: true });
});

app.get("/api/admin/users", requireAuth, requireAdmin, async (_req, res) => {
  const users = await query(`
    SELECT id,name,nickname,university,faculty,email,role,verified,verification_status,verification_original_name,verification_uploaded_at,created_at
    FROM users ORDER BY created_at DESC
  `);
  res.json({ users: users.map(publicUser) });
});

app.post("/api/admin/users/:id/revoke", requireAuth, requireAdmin, async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: "CANNOT_REVOKE_SELF" });
  await query("UPDATE users SET verified = FALSE, verification_status = 'revoked' WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});

app.post("/api/admin/users/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  await query("UPDATE users SET verified = TRUE, verification_status = 'approved' WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});

app.delete("/api/admin/users/:id", requireAuth, requireAdmin, async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: "CANNOT_DELETE_SELF" });
  const target = await one("SELECT * FROM users WHERE id = $1", [req.params.id]);
  if (!target) return res.status(404).json({ error: "NOT_FOUND" });
  if (target.verification_file_key) await deleteFromR2(target.verification_file_key);
  await query("DELETE FROM users WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

initDb()
  .then(() => app.listen(PORT, () => console.log(`Campus Room JP production running on http://localhost:${PORT}`)))
  .catch(err => {
    console.error("Failed to initialize app", err);
    process.exit(1);
  });
