const path = require("path");
const { scrapePumaRunningShoes } = require("../scraper/pumaRunningShoes");
const { saveJson, readJson } = require("../storage/fileStorage");
const { summarizeProducts } = require("../ai/openaiSummarizer");
const { generateAudioFiles } = require("../tts/elevenlabsTts");

async function runFlow() {
  // 1) Scrape product data
  const products = await scrapePumaRunningShoes();

  // 2) Store locally
  const productsPath = path.join(process.cwd(), "data", "products.json");
  await saveJson(productsPath, products);

  // 3) Summarize using OpenAI
  const storedProducts = await readJson(productsPath);
  const summaries = await summarizeProducts(storedProducts);

  const summariesPath = path.join(process.cwd(), "data", "summaries.json");
  await saveJson(summariesPath, summaries);

  // 4) Convert each summary to audio using ElevenLabs
  const audioDir = path.join(process.cwd(), "output", "audio");
  const audioFiles = await generateAudioFiles(summaries, audioDir);

  return {
    scrapedCount: products.length,
    summariesCount: summaries.length,
    audioFiles,
    productsPath,
    summariesPath,
    audioDir,
  };
}

module.exports = { runFlow };
