# 가짜 3.3 위장고용 · 보도자료 요약 랜딩

고용노동부 **2026. 3. 19.** 보도자료(가짜 3.3 의심사업장 수시감독 2차 사례)를 바탕으로 한 **단일 페이지 랜딩**입니다.  
**근로감독 자가진단 웹앱(`labor-inspection-app`)과 별도**의 정적 사이트입니다.

## 구성

- `index.html` — 본문
- `styles.css` — 스타일

## 로컬에서 보기

```bash
cd risk119-fake33-landing
npx --yes serve .
```

또는 `index.html`을 브라우저에서 직접 열어도 됩니다.

## GitHub에 새 저장소로 올리기

1. [GitHub](https://github.com/new)에서 새 저장소 생성 (예: `risk119-fake33-landing`).
2. 아래 명령에서 `YOUR_USER`/`REPO`를 본인 값으로 바꿉니다.

```bash
cd risk119-fake33-landing
git init
git add .
git commit -m "feat: 가짜 3.3 보도 요약 랜딩 + 조대진 노무사 CTA"
git branch -M main
git remote add origin https://github.com/YOUR_USER/REPO.git
git push -u origin main
```

### GitHub Pages (선택)

저장소 Settings → Pages → Branch `main` / folder `/ (root)` 로 연결하면 `index.html`이 공개됩니다.

## 면책

공식 보도자료가 아닌 **요약·안내용** 페이지입니다. 법적 판단은 전문가 상담을 받으세요.
