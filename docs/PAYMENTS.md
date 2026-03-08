# 토스페이먼츠 기간권 결제 연동

- 구독 없이 1회 결제로 기간권 부여.
- 무료/유료에 따라 일일 사용 횟수 제한 (플랜의 `daily_limit`).

## 환경 변수

| 구분 | 변수명 | 설명 |
|------|--------|------|
| Client | `VITE_TOSS_CLIENT_KEY` | 토스페이먼츠 클라이언트 키 (위젯용) |
| Client | `VITE_SUPABASE_URL` | Supabase 프로젝트 URL |
| Client | `VITE_SUPABASE_ANON_KEY` | Supabase anon 키 (plans 읽기, Edge Function 호출) |
| Server | `TOSS_SECRET_KEY` | 토스 시크릿 키 (Supabase 시크릿으로 설정) |

## Supabase 설정

1. **마이그레이션 실행**  
   `supabase/migrations/20250304000000_plans_orders.sql` 를 Supabase 대시보드 SQL Editor에서 실행하거나, Supabase CLI로 적용.

2. **Edge Functions 배포**  
   ```bash
   supabase functions deploy checkout
   supabase functions deploy confirm
   ```

3. **시크릿 설정**  
   ```bash
   supabase secrets set TOSS_SECRET_KEY=test_gsk_docs_xxxx
   ```

## API

- `POST /functions/v1/checkout`  
  Body: `{ planId, customerEmail? }`  
  응답: `{ orderId, amount, planName, customerEmail }`

- `POST /functions/v1/confirm`  
  Body: `{ paymentKey, orderId, amount }`  
  응답: `{ ok: true, planId, expiresAt }` (성공 시)

## UI 경로

- `/pricing` — 플랜 목록, 선택 시 `/payment` 로 이동 (state로 플랜 전달)
- `/payment` — 토스 결제 위젯, 결제 후 성공/실패 URL로 리다이렉트
- `/payment/success` — URL 쿼리 검증 후 confirm 호출, 결과 표시
- `/payment/fail` — 실패 코드·메시지 표시

## 보안

- 결제 승인은 서버(Edge Function)에서만 `TOSS_SECRET_KEY` 로 수행.
- 금액·플랜은 항상 서버(DB) 기준으로 검증.
