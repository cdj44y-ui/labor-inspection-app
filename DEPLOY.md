# RISK119.SITE 배포 및 도메인 연결 안내

## 1. Vercel 로그인 (최초 1회)

터미널에서 실행:

```bash
npx vercel login
```

이메일 주소 입력 후 받은 링크로 로그인하면 됩니다.

---

## 2. 배포하기

로그인 후 프로젝트 폴더에서:

```bash
npm run deploy
```

또는:

```bash
npm run build
npx vercel --prod
```

첫 배포 시 프로젝트 이름·팀 등 물어보면 엔터로 기본값 사용해도 됩니다.  
완료되면 `https://프로젝트명.vercel.app` 같은 URL이 나옵니다.

---

## 3. 커스텀 도메인(risk119.site) 연결

1. **Vercel 대시보드**  
   https://vercel.com/dashboard → 해당 프로젝트 선택

2. **Settings → Domains**  
   - **Add** 또는 **Add Domain** 클릭  
   - `risk119.site` 입력 후 추가  
   - `www.risk119.site`도 쓰려면 같이 추가

3. **DNS 설정 (도메인 등록한 곳에서)**  
   Vercel이 안내하는 대로 아래 중 하나로 설정합니다.

   - **A 레코드**  
     - 이름: `@` (또는 비워두기)  
     - 값: `76.76.21.21`

   - **CNAME 레코드** (서브도메인만, 예: www)  
     - 이름: `www`  
     - 값: `cname.vercel-dns.com`

   도메인을 **가비아, Cloudflare, GoDaddy** 등에서 구매했다면, 해당 사이트의 "DNS 관리" 또는 "네임서버 설정"에서 위 레코드를 추가/수정하면 됩니다.

4. **확인**  
   DNS 전파에는 수 분~최대 48시간 걸릴 수 있습니다.  
   Vercel Domains 화면에서 "Valid Configuration"으로 나오면 연결 완료입니다.

---

## 요약

| 단계 | 할 일 |
|------|--------|
| 1 | `npx vercel login` 으로 로그인 |
| 2 | `npm run deploy` 로 배포 |
| 3 | Vercel 프로젝트 → Settings → Domains 에서 `risk119.site` 추가 |
| 4 | 도메인 등록처 DNS에 A 또는 CNAME 레코드 설정 |

위 순서대로 하시면 risk119.site 로 사이트가 연결됩니다.
