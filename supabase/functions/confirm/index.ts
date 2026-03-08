import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface ConfirmBody {
  paymentKey: string;
  orderId: string;
  amount: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as ConfirmBody;
    const { paymentKey, orderId, amount } = body;
    if (!paymentKey || !orderId || amount == null) {
      return new Response(
        JSON.stringify({ error: "paymentKey, orderId, amount are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const secretKey = Deno.env.get("TOSS_SECRET_KEY");
    if (!secretKey) {
      return new Response(
        JSON.stringify({ error: "TOSS_SECRET_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, order_id, plan_id, amount, status, plans(period_days)")
      .eq("order_id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (order.status !== "pending") {
      return new Response(
        JSON.stringify({ error: "Order already processed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (Number(order.amount) !== Number(amount)) {
      return new Response(
        JSON.stringify({ error: "Amount mismatch" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader =
      "Basic " + btoa(secretKey + ":");

    const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    });

    const raw = await tossRes.json();

    if (!tossRes.ok) {
      await supabase
        .from("orders")
        .update({ status: "failed", raw })
        .eq("order_id", orderId);
      return new Response(JSON.stringify(raw), {
        status: tossRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const periodDays = (order.plans as { period_days: number } | null)?.period_days ?? 30;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + periodDays);

    await supabase
      .from("orders")
      .update({
        status: "paid",
        raw,
        expires_at: expiresAt.toISOString(),
      })
      .eq("order_id", orderId);

    return new Response(
      JSON.stringify({
        ok: true,
        planId: order.plan_id,
        expiresAt: expiresAt.toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
