import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    // Send Telegram notification
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        const priceInfo = calculated_price ? `\n💰 Стоимость: ${Number(calculated_price).toLocaleString("ru-RU")} ₽` : "";
        const serviceInfo = service ? `\n🔧 Услуга: ${service}` : "";
        const messageInfo = message ? `\n💬 Сообщение: ${message}` : "";
        const sourceLabel: Record<string, string> = { service_page: "Страница услуги", contacts_page: "Контакты", cta: "CTA", job_application: "🧑‍🔧 Анкета соискателя" };

        const text = `🔔 *Новая заявка на сайте STRUKTURA!*\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}${serviceInfo}${priceInfo}${messageInfo}\n📍 Источник: ${sourceLabel[source] || source || "service_page"}\n🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;

        const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "Markdown" }),
        });
        const tgData = await tgRes.json();
        if (!tgData.ok) {
          console.error("Telegram error:", tgData);
        } else {
          console.log("✅ Telegram notification sent");
        }
      } catch (tgErr) {
        console.error("Telegram notification error:", tgErr);
      }
    } else {
      console.log("⚠️ Telegram credentials not configured");
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
