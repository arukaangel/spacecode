const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const { message, history = [] } = await req.json();

    if (!message) {
      throw new Error("Message is required");
    }

    const contents = [
      ...history.slice(-8).map((item: any) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: String(item.content) }],
      })),
      {
        role: "user",
        parts: [{ text: String(message) }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text:
                  "You are SpaceCode AI, a friendly programming and data science tutor. Help beginners with Python, JavaScript, computer science, data science, SpaceCode lessons and projects. Give clear, concise explanations and examples.",
              },
            ],
          },
          contents,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Gemini error ${response.status}: ${JSON.stringify(data)}`
      );
    }

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map((part: any) => part.text || "")
        .join("") ||
      "I couldn't generate a response.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : String(error),
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});