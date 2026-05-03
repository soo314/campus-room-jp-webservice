# Campus Room JP Production

일본판 에타 스타일 대학생 익명 커뮤니티 운영용 MVP입니다.

## 운영 구조

- Server: Node.js + Express
- DB: PostgreSQL
- Image Storage: Cloudflare R2 / S3 compatible storage
- Mail: Gmail SMTP or other SMTP
- Auth: JWT HttpOnly Cookie
- UI: Japanese / Korean / English

## 기능

- 회원가입
- 로그인 / 로그아웃
- 게시글 / 댓글 / 좋아요
- 게시판 필터 / 검색
- 학생증 업로드 즉시 자동 승인
- 학생증 파일을 Cloudflare R2에 저장
- 학생증 파일을 csgi1014@gmail.com 으로 첨부 전송
- 관리자 페이지에서 인증 취소 / 재승인
- 인증 전 글쓰기·댓글 제한
- 일본어 / 한국어 / 영어 UI

## 병장님이 설치할 것

로컬에서 테스트하거나 GitHub에 올릴 때:

1. Node.js LTS
2. Git
3. VS Code 권장

웹 배포만 할 거면 컴퓨터에 서버를 계속 켜둘 필요는 없습니다.

## Render 배포

1. GitHub에 이 폴더 업로드
2. Render → New → Blueprint
3. GitHub repo 선택
4. render.yaml로 자동 생성
5. 환경변수 입력

필수 환경변수:

```env
ADMIN_PASSWORD=관리자_비밀번호
SMTP_USER=보내는_지메일@gmail.com
SMTP_PASS=지메일_앱_비밀번호
MAIL_FROM="Campus Room JP <보내는_지메일@gmail.com>"

R2_ACCOUNT_ID=Cloudflare_R2_Account_ID
R2_BUCKET=campus-room-jp
R2_ACCESS_KEY_ID=R2_Access_Key_ID
R2_SECRET_ACCESS_KEY=R2_Secret_Access_Key
```

이미 들어간 값:

```env
VERIFICATION_NOTIFY_EMAIL=csgi1014@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
```

## Cloudflare R2 설정

1. Cloudflare 가입
2. R2 활성화
3. Bucket 생성: campus-room-jp
4. R2 API Token 생성
5. Account ID, Access Key ID, Secret Access Key를 Render 환경변수에 입력

## Gmail SMTP 설정

1. Google 계정 2단계 인증 ON
2. 앱 비밀번호 생성
3. SMTP_PASS에 앱 비밀번호 입력

## 주의

학생증은 개인정보입니다. 실제 운영 전 반드시 준비하세요.

- 이용약관
- 개인정보처리방침
- 문의/삭제 요청 채널
- 이미지 보관 기간 정책
- 관리자 접근 제한
- HTTPS 필수
