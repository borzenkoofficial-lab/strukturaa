const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description } = await req.json();
    const text = `${title}\n${description}`;

    const apiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            {
              role: "system",
              content: `Ты модератор строительной биржи заказов. Проверяй текст заявки на соответствие правилам:

РАЗРЕШЕНО: строительство, ремонт, демонтаж, отделка, электрика, сантехника, кровля, фасады, ландшафт, дизайн интерьера и любые связанные строительные/ремонтные работы.

ЗАПРЕЩЕНО:
- Мат, оскорбления, нецензурная лексика
- Наркотики, запрещённые вещества
- Оружие
- Сексуальный контент
- Мошенничество, спам
- Любой контент НЕ связанный со строительством/ремонтом

Отвечай ТОЛЬКО в формате JSON:
{"approved": true/false, "reason": "причина отказа или пустая строка"}`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0.1,
          max_tokens: 150,
        }),
      }
    );

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // If parsing fails, approve by default to not block users
      return new Response(
        JSON.stringify({ approved: true, reason: "" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Moderation error:", err);
    // On error, approve to not block users
    return new Response(
      JSON.stringify({ approved: true, reason: "" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
