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
    const { receiver_id, sender_name, content, item_title } = await req.json();

    if (!receiver_id || !content) {
      return new Response(
        JSON.stringify({ error: "receiver_id and content required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send Telegram notification to seller
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const itemInfo = item_title ? `\n🛒 Товар: ${item_title}` : "";
      const text = `💬 *Новое сообщение в магазине!*\n\n👤 От: ${sender_name || "Покупатель"}${itemInfo}\n📝 ${content}\n🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;

      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "Markdown" }),
        });
        const tgData = await tgRes.json();
        if (!tgData.ok) console.error("Telegram error:", tgData);
        else console.log("✅ Shop message notification sent");
      } catch (tgErr) {
        console.error("Telegram error:", tgErr);
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
