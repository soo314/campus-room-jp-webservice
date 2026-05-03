
const I18N = {
  ja: {
    tagline:"日本の大学生限定・匿名コミュニティ", heroTitle:"大学生だけの、<br>匿名キャンパス掲示板。", heroDesc:"就活、授業、生活、恋愛、サークル、バイトまで。学生証アップロードで自動認証され、投稿できるコミュニティMVPです。",
    feature1:"✅ 会員登録・ログイン機能", feature2:"✅ 投稿・いいね・コメント保存", feature3:"✅ 学生証アップロード → 自動承認 → 管理者メール送信", feature4:"✅ 管理者が後から認証取消可能",
    login:"ログイン", signup:"新規登録", email:"メールアドレス", password:"パスワード", password6:"パスワード 6文字以上", realName:"氏名", nickname:"ニックネーム", university:"大学名", faculty:"学部", fillAdmin:"管理者で入力", signupNote:"登録後、学生証画像をアップロードすると自動で認証されます。",
    studentVerification:"学生証認証", uploadAndVerify:"学生証をアップロードして認証", uploadNote:"アップロード後すぐ認証済みになります。画像は管理者メールに送信されます。", boards:"掲示板", admin:"管理者", searchPosts:"投稿を検索", writePost:"投稿する", needVerification:"投稿には学生証認証が必要です。", displayUniversity:"表示大学名 / 匿名", title:"タイトル", body:"本文", post:"投稿する",
    verified:"認証済み", unverified:"未認証", pending:"認証待ち", revoked:"取消済み", logout:"ログアウト", uploadDone:"認証しました。メール送信結果も確認してください。", uploadNoFile:"ファイルを選択してください。", loginFailed:"ログインに失敗しました。", signupFailed:"登録に失敗しました。", missing:"未入力の項目があります。", comment:"コメント", delete:"削除", approve:"再承認", revoke:"認証取消", noUsers:"ユーザーがいません。", canPost:"投稿可能", needVerifyShort:"認証が必要", newest:"新着順", popular:"人気順", noPosts:"投稿がありません。", commentPlaceholder:"コメントを書く", send:"送信",
    all:"全部", job:"就活", class:"授業", life:"生活", love:"恋愛", club:"サークル", work:"バイト", uni:"大学別"
  },
  ko: {
    tagline:"일본 대학생 전용 익명 커뮤니티", heroTitle:"대학생만 쓰는<br>익명 캠퍼스 게시판.", heroDesc:"취업, 수업, 생활, 연애, 동아리, 알바까지. 학생증 업로드로 자동 인증되고 글을 쓸 수 있는 커뮤니티 MVP입니다.",
    feature1:"✅ 회원가입·로그인 기능", feature2:"✅ 게시글·좋아요·댓글 저장", feature3:"✅ 학생증 업로드 → 자동 승인 → 관리자 메일 전송", feature4:"✅ 관리자가 나중에 인증 취소 가능",
    login:"로그인", signup:"회원가입", email:"이메일", password:"비밀번호", password6:"비밀번호 6자 이상", realName:"실명", nickname:"닉네임", university:"대학명", faculty:"학부", fillAdmin:"관리자 계정 입력", signupNote:"가입 후 학생증 이미지를 업로드하면 자동으로 인증됩니다.",
    studentVerification:"학생증 인증", uploadAndVerify:"학생증 업로드 후 인증", uploadNote:"업로드 즉시 인증됩니다. 이미지는 관리자 이메일로 전송됩니다.", boards:"게시판", admin:"관리자", searchPosts:"게시글 검색", writePost:"글쓰기", needVerification:"글을 쓰려면 학생증 인증이 필요합니다.", displayUniversity:"표시 대학명 / 익명", title:"제목", body:"본문", post:"작성하기",
    verified:"인증 완료", unverified:"미인증", pending:"인증 대기", revoked:"인증 취소됨", logout:"로그아웃", uploadDone:"인증 완료. 메일 전송 결과도 확인하세요.", uploadNoFile:"파일을 선택하세요.", loginFailed:"로그인 실패", signupFailed:"가입 실패", missing:"입력하지 않은 항목이 있습니다.", comment:"댓글", delete:"삭제", approve:"재승인", revoke:"인증 취소", noUsers:"유저가 없습니다.", canPost:"작성 가능", needVerifyShort:"인증 필요", newest:"최신순", popular:"인기순", noPosts:"게시글이 없습니다.", commentPlaceholder:"댓글 쓰기", send:"전송",
    all:"전체", job:"취업", class:"수업", life:"생활", love:"연애", club:"동아리", work:"알바", uni:"대학별"
  },
  en: {
    tagline:"Anonymous community for university students in Japan", heroTitle:"An anonymous<br>campus board for students.", heroDesc:"Career, classes, life, relationships, clubs, and part-time jobs. Upload your student ID for instant approval and start posting.",
    feature1:"✅ Signup and login", feature2:"✅ Posts, likes, and comments saved", feature3:"✅ Student ID upload → auto approval → email to admin", feature4:"✅ Admin can revoke verification later",
    login:"Log in", signup:"Sign up", email:"Email", password:"Password", password6:"Password, 6+ chars", realName:"Real name", nickname:"Nickname", university:"University", faculty:"Faculty", fillAdmin:"Fill admin account", signupNote:"After signup, upload a student ID image to be verified automatically.",
    studentVerification:"Student ID verification", uploadAndVerify:"Upload student ID and verify", uploadNote:"You will be verified immediately. The image will be emailed to the admin.", boards:"Boards", admin:"Admin", searchPosts:"Search posts", writePost:"Write a post", needVerification:"Student ID verification is required to post.", displayUniversity:"Display university / Anonymous", title:"Title", body:"Body", post:"Post",
    verified:"Verified", unverified:"Unverified", pending:"Pending", revoked:"Revoked", logout:"Log out", uploadDone:"Verified. Check email delivery result too.", uploadNoFile:"Choose a file.", loginFailed:"Login failed.", signupFailed:"Signup failed.", missing:"Some fields are missing.", comment:"Comments", delete:"Delete", approve:"Approve again", revoke:"Revoke", noUsers:"No users.", canPost:"Can post", needVerifyShort:"Verification required", newest:"Newest", popular:"Popular", noPosts:"No posts.", commentPlaceholder:"Write a comment", send:"Send",
    all:"All", job:"Career", class:"Classes", life:"Life", love:"Relationships", club:"Clubs", work:"Part-time jobs", uni:"By university"
  }
};

const BOARD_KEYS = ["all","job","class","life","love","club","work","uni"];
const BOARD_VALUES_JA = ["全部","就活","授業","生活","恋愛","サークル","バイト","大学別"];
let lang = localStorage.getItem("lang") || "ja";
let user = null;
let authMode = "login";
let selectedBoard = "全部";
let sortMode = "new";

function t(k){ return I18N[lang][k] || I18N.ja[k] || k; }
function boardLabel(ja){ const idx = BOARD_VALUES_JA.indexOf(ja); return idx >= 0 ? t(BOARD_KEYS[idx]) : ja; }
function boardValueFromKey(key){ const idx = BOARD_KEYS.indexOf(key); return BOARD_VALUES_JA[idx] || "全部"; }

function applyI18n(){
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  renderHeader(); renderBoards(); renderWriteForm(); renderPosts(); renderAdmin();
}

function langSelectHtml(){
  return `<select class="lang-select" onchange="setLang(this.value)">
    <option value="ja" ${lang==="ja"?"selected":""}>日本語</option>
    <option value="ko" ${lang==="ko"?"selected":""}>한국어</option>
    <option value="en" ${lang==="en"?"selected":""}>English</option>
  </select>`;
}

function setLang(v){ lang = v; localStorage.setItem("lang", lang); applyI18n(); }

async function api(path, opts={}){
  const res = await fetch(path, { headers: { "Content-Type":"application/json", ...(opts.headers||{}) }, credentials:"include", ...opts });
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw data;
  return data;
}

function toast(msg){
  const el=document.getElementById("toast"); el.textContent=msg; el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),1800);
}

function switchAuth(mode){
  authMode=mode;
  document.getElementById("loginTab").classList.toggle("active",mode==="login");
  document.getElementById("signupTab").classList.toggle("active",mode==="signup");
  document.getElementById("loginForm").classList.toggle("hidden",mode!=="login");
  document.getElementById("signupForm").classList.toggle("hidden",mode!=="signup");
}

async function signup(){
  const payload = {
    name: val("signupName"), nickname: val("signupNickname"), university: val("signupUniversity"),
    faculty: val("signupFaculty"), email: val("signupEmail"), password: val("signupPassword")
  };
  if(Object.values(payload).some(v=>!v)) return toast(t("missing"));
  try { const data = await api("/api/signup",{method:"POST",body:JSON.stringify(payload)}); user=data.user; render(); }
  catch { toast(t("signupFailed")); }
}

async function login(){
  try {
    const data = await api("/api/login",{method:"POST",body:JSON.stringify({email:val("loginEmail"),password:val("loginPassword")})});
    user=data.user; render();
  } catch { toast(t("loginFailed")); }
}

async function logout(){ await api("/api/logout",{method:"POST"}).catch(()=>{}); user=null; render(); }
function fillAdminUser(){ document.getElementById("loginEmail").value="admin@campusroom.jp"; document.getElementById("loginPassword").value="admin1234"; }
function val(id){ return document.getElementById(id).value.trim(); }

async function uploadStudentId(){
  const file = document.getElementById("studentIdFile").files[0];
  if(!file) return toast(t("uploadNoFile"));
  const fd = new FormData(); fd.append("studentId", file);
  try {
    const res = await fetch("/api/verification/upload",{method:"POST",body:fd,credentials:"include"});
    const data = await res.json();
    if(!res.ok) throw data;
    user = data.user;
    toast(`${t("uploadDone")} mail: ${data.mail?.sent ? "sent" : "not sent"}`);
    render();
  } catch(e){ toast("Upload failed"); }
}

async function createPost(){
  if(!user?.verified) return toast(t("needVerification"));
  try {
    await api("/api/posts",{method:"POST",body:JSON.stringify({
      board: document.getElementById("postBoard").value,
      displayUniversity: val("postUniversity") || "匿名",
      title: val("postTitle"),
      body: val("postBody")
    })});
    document.getElementById("postTitle").value=""; document.getElementById("postBody").value="";
    renderPosts();
  } catch { toast("Post failed"); }
}

async function toggleLike(id){ await api(`/api/posts/${id}/like`,{method:"POST"}).catch(()=>{}); renderPosts(); }
async function deletePost(id){ if(!confirm("Delete?")) return; await fetch(`/api/posts/${id}`,{method:"DELETE",credentials:"include"}); renderPosts(); }
function toggleSort(){ sortMode = sortMode==="new" ? "popular" : "new"; renderPosts(); }

async function toggleComments(id){
  const box=document.getElementById("comments_"+id);
  if(box.style.display==="block"){ box.style.display="none"; return; }
  const data=await api(`/api/posts/${id}/comments`);
  box.innerHTML = data.comments.map(c=>`<div class="comment"><b>匿名</b><br>${esc(c.body)}</div>`).join("") + `
    <div class="grid2" style="margin-top:10px;grid-template-columns:1fr auto">
      <input id="commentInput_${id}" placeholder="${t("commentPlaceholder")}" ${!user?.verified?"disabled":""}>
      <button class="btn dark" onclick="addComment('${id}')" ${!user?.verified?"disabled":""}>${t("send")}</button>
    </div>`;
  box.style.display="block";
}

async function addComment(id){
  const body=val("commentInput_"+id);
  if(!body) return;
  await api(`/api/posts/${id}/comments`,{method:"POST",body:JSON.stringify({body})}).catch(()=>toast(t("needVerification")));
  await renderPosts();
  setTimeout(()=>toggleComments(id),50);
}

function selectBoard(key){ selectedBoard = boardValueFromKey(key); renderBoards(); renderPosts(); }

function renderHeader(){
  const h=document.getElementById("headerActions");
  if(!user){ h.innerHTML = `${langSelectHtml()}<span class="badge">${t("unverified")}</span>`; return; }
  const status = user.verified ? t("verified") : user.verificationStatus==="revoked" ? t("revoked") : t("unverified");
  const cls = user.verified ? "ok" : "";
  h.innerHTML = `${langSelectHtml()}<span class="badge ${cls}">${status}</span>${user.role==="admin"?`<span class="badge admin">ADMIN</span>`:""}<span class="badge">${esc(user.nickname)} / ${esc(user.university)}</span><button class="btn dark" onclick="logout()">${t("logout")}</button>`;
}

function renderBoards(){
  const el=document.getElementById("boards"); if(!el) return;
  el.innerHTML = BOARD_KEYS.map((key,i)=>`<button class="board-btn ${selectedBoard===BOARD_VALUES_JA[i]?"active":""}" onclick="selectBoard('${key}')">${t(key)}</button>`).join("");
}

function renderWriteForm(){
  const pb=document.getElementById("postBoard"); if(!pb) return;
  pb.innerHTML = BOARD_KEYS.slice(1).map((key,i)=>`<option value="${BOARD_VALUES_JA[i+1]}">${t(key)}</option>`).join("");
  const can = !!user?.verified;
  document.getElementById("writeAlert").classList.toggle("hidden", can);
  document.getElementById("writeForm").style.opacity = can ? "1" : ".45";
  document.querySelectorAll("#writeForm input,#writeForm textarea,#writeForm select,#writeForm button").forEach(e=>e.disabled=!can);
  const b=document.getElementById("postPermissionBadge"); b.textContent = can ? t("canPost") : t("needVerifyShort"); b.className = can ? "badge ok" : "badge";
  const vt=document.getElementById("verifyText");
  if(vt) vt.textContent = user?.verified ? t("uploadDone") : t("uploadNote");
}

async function renderPosts(){
  const el=document.getElementById("posts"); if(!el) return;
  document.getElementById("sortBtn").textContent = sortMode === "new" ? t("newest") : t("popular");
  const q = encodeURIComponent(val("searchInput"));
  const data = await api(`/api/posts?board=${encodeURIComponent(selectedBoard)}&search=${q}&sort=${sortMode}`).catch(()=>({posts:[]}));
  if(!data.posts.length){ el.innerHTML=`<div class="card"><div class="card-body"><p class="muted">${t("noPosts")}</p></div></div>`; return; }
  el.innerHTML = data.posts.map(p=>`
    <article class="card post"><div class="card-body">
      <div class="meta"><span class="badge">${boardLabel(p.board)}</span><span>${esc(p.displayUniversity)}</span><span>・</span><span>${timeAgo(p.createdAt)}</span></div>
      <h3>${esc(p.title)}</h3><p>${esc(p.body)}</p>
      <div class="actions">
        <button class="pill-btn" onclick="toggleLike('${p.id}')">${p.liked?"♥":"♡"} ${p.likeCount}</button>
        <button class="pill-btn" onclick="toggleComments('${p.id}')">💬 ${p.commentCount}</button>
        ${p.canDelete?`<button class="pill-btn" onclick="deletePost('${p.id}')">${t("delete")}</button>`:""}
      </div>
      <div class="comment-box" id="comments_${p.id}"></div>
    </div></article>
  `).join("");
}

async function renderAdmin(){
  const panel=document.getElementById("adminPanel"); if(!panel) return;
  panel.classList.toggle("hidden", user?.role!=="admin");
  if(user?.role!=="admin") return;
  const data = await api("/api/admin/users").catch(()=>({users:[]}));
  const list=document.getElementById("adminUsers");
  if(!data.users.length){ list.innerHTML=`<p class="small muted">${t("noUsers")}</p>`; return; }
  list.innerHTML = data.users.map(u=>`
    <div class="admin-item">
      <p><b>${esc(u.name)}</b> / ${esc(u.nickname)}</p>
      <p class="small muted">${esc(u.university)} / ${esc(u.faculty)}</p>
      <p class="small muted">${esc(u.email)}</p>
      <p class="small muted">${u.verified ? t("verified") : t("unverified")} · ${u.verificationStatus || "none"} ${u.verificationOriginalName ? " · file: " + esc(u.verificationOriginalName) : ""}</p>
      ${u.role==="admin" ? `<span class="badge admin">ADMIN</span>` : `<div class="actions">
        <button class="btn green" onclick="adminApprove('${u.id}')">${t("approve")}</button>
        <button class="btn danger" onclick="adminRevoke('${u.id}')">${t("revoke")}</button>
      </div>`}
    </div>
  `).join("");
}
async function adminRevoke(id){ await api(`/api/admin/users/${id}/revoke`,{method:"POST"}); await renderAdmin(); }
async function adminApprove(id){ await api(`/api/admin/users/${id}/approve`,{method:"POST"}); await renderAdmin(); }

function render(){
  renderHeader();
  document.getElementById("authPage").classList.toggle("hidden", !!user);
  document.getElementById("mainPage").classList.toggle("hidden", !user);
  if(user){ renderBoards(); renderWriteForm(); renderPosts(); renderAdmin(); }
  document.querySelectorAll("[data-i18n]").forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
}

function esc(s){return String(s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function timeAgo(ts){ const sec=Math.floor((Date.now()-ts)/1000); if(sec<60)return "now"; const m=Math.floor(sec/60); if(m<60)return m+"m"; const h=Math.floor(m/60); if(h<24)return h+"h"; return Math.floor(h/24)+"d"; }

(async function init(){
  try { const data = await api("/api/me"); user = data.user; } catch {}
  applyI18n();
  render();
})();
