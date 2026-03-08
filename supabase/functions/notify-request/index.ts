import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone, message, service, calculated_price, source } = await req.json();

    if (!name || !phone) {
      return new Response(
        JSON.stringify({ error: "Имя и телефон обязательны" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase.from("contact_requests").insert({
      name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 30),
      message: message?.trim().slice(0, 2000) || null,
      service: service?.trim().slice(0, 200) || null,
      calculated_price: calculated_price || null,
      source: source || "service_page",
    });

    if (dbError) {
      console.error("DB error:", dbError);
      return new Response(
        JSON.stringify({ error: "Ошибка сохранения" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email notification via Lovable AI gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (LOVABLE_API_KEY) {
      try {
        const priceInfo = calculated_price ? `\nРасчётная стоимость: ${Number(calculated_price).toLocaleString("ru-RU")} ₽` : "";
        const serviceInfo = service ? `\nУслуга: ${service}` : "";
        const messageInfo = message ? `\nСообщение: ${message}` : "";

        const emailBody = `Новая заявка на сайте STRUKTURA!\n\nИмя: ${name}\nТелефон: ${phone}${serviceInfo}${priceInfo}${messageInfo}\nИсточник: ${source || "service_page"}\nДата: ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;

        // Log for admin visibility
        console.log("📧 New contact request:", { name, phone, service, calculated_price, source });
        console.log("Email body:", emailBody);
      } catch (emailErr) {
        console.error("Email notification error:", emailErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
