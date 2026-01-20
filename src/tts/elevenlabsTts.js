const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

/**
 * ElevenLabs TTS
 * Saves 1 audio file per summary.
 */
async function generateAudioFiles(summaries, audioDir) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey) throw new Error("Missing ELEVENLABS_API_KEY in .env");
  if (!voiceId) throw new Error("Missing ELEVENLABS_VOICE_ID in .env");

  await ensureDir(audioDir);

  const audioFiles = [];

  for (const item of summaries) {
    const outPath = path.join(audioDir, `product_${item.id}.mp3`);

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    try {
      const response = await axios.post(
        url,
        {
          text: item.summary,
          model_id: process.env.ELEVENLABS_MODEL_ID || "eleven_monolingual_v1",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        },
        {
          responseType: "arraybuffer",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
            Accept: "audio/mpeg",
          },
          timeout: 60000,
        },
      );

      await fs.promises.writeFile(outPath, response.data);
      audioFiles.push(outPath);
    } catch (err) {
      console.log("❌ ElevenLabs Error:", err?.response?.data?.toString());
      throw err;
    }
  }

  return audioFiles;
}

module.exports = { generateAudioFiles };
