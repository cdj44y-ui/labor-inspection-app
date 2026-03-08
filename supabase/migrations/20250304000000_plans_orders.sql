-- plans: 공개 읽기, 쓰기는 서비스 롤만
CREATE TABLE IF NOT EXISTS public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  amount integer NOT NULL CHECK (amount > 0),
  period_days integer NOT NULL CHECK (period_days > 0),
  daily_limit integer NOT NULL DEFAULT 5 CHECK (daily_limit >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- orders: 결제 주문 (order_id = Toss orderId)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL UNIQUE,
  plan_id uuid NOT NULL REFERENCES public.plans(id),
  amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  raw jsonb,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_plan_id ON public.orders(plan_id);

-- RLS: plans는 모든 사용자 SELECT만 허용
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plans_select_public" ON public.plans FOR SELECT USING (true);
-- INSERT/UPDATE/DELETE는 서비스 롤만 (정책 없음 = anon/authenticated 불가)

-- RLS: orders는 서비스 롤만 접근 (클라이언트는 읽기/쓰기 불가)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- 정책 없음: anon/authenticated는 SELECT/INSERT/UPDATE 불가. Edge Function은 service_role 사용.

-- 초기 플랜 데이터: 비대면 상담 10,000원
INSERT INTO public.plans (id, name, amount, period_days, daily_limit)
VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  '비대면 상담',
  10000,
  30,
  5
)
ON CONFLICT DO NOTHING;
