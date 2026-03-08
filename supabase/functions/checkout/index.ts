import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface CheckoutBody {
  planId: string;
  customerEmail?: string;
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
    const body = (await req.json()) as CheckoutBody;
    const { planId, customerEmail = "" } = body;
    if (!planId) {
      return new Response(
        JSON.stringify({ error: "planId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("id, name, amount, period_days")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      return new Response(
        JSON.stringify({ error: "Plan not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const orderId = "order_" + crypto.randomUUID().replace(/-/g, "");

    const { error: insertError } = await supabase.from("orders").insert({
      order_id: orderId,
      plan_id: plan.id,
      amount: plan.amount,
      status: "pending",
    });

    if (insertError) {
      return new Response(
        JSON.stringify({ error: "Failed to create order", detail: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        orderId,
        amount: plan.amount,
        planName: plan.name,
        customerEmail: customerEmail || "",
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
