const OpenAI = require("openai");

function buildPrompt(product) {
  return [
    "You are a helpful assistant that writes short product summaries.",
    "Write a crisp 1-2 sentence summary for the product below.",
    "Do not include bullet points. Keep it human-readable.",
    "",
    `Product Name: ${product.productName}`,
    `Product Description: ${product.productDescription}`,
  ].join("\n");
}

async function summarizeProducts(products) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY in .env");
  }

  const client = new OpenAI({ apiKey });

  const summaries = [];

  for (const product of products) {
    const prompt = buildPrompt(product);

    const resp = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You summarize products clearly and briefly." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 120,
    });

    const summary =
      resp.choices?.[0]?.message?.content?.trim() ||
      "Summary not generated.";

    summaries.push({
      id: product.id,
      productName: product.productName,
      summary,
    });
  }

  return summaries;
}

module.exports = { summarizeProducts };
