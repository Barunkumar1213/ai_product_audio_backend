# AI Product Audio Backend (Node.js + Express, No DB)

This project implements the assessment flow described in the PDF:  
**Scraping → Local Storage → OpenAI Summarization → ElevenLabs Text-to-Speech → Audio Output** fileciteturn0file0

## ✅ What it does
When you run the flow, it will:
1. Scrape **exactly 5 products** from a single website (Fake Store API)
2. Store the scraped data locally in `data/products.json`
3. Generate **1–2 sentence summaries** for each product using OpenAI
4. Convert each summary to audio using ElevenLabs
5. Save **5 audio files** locally in `output/audio/`

## Website scraped
- **Fake Store API**: https://fakestoreapi.com/products  
We fetch 5 products and treat it as the scraping source (simple + stable for local testing).

> Note: This is a product-based website endpoint returning product name + description.  
> No images are used.

---

## 📦 Setup

### 1) Install dependencies
```bash
npm install
```

### 2) Create `.env`
Create a file named `.env` in the root folder:

```env
PORT=4000

# OpenAI
OPENAI_API_KEY=YOUR_OPENAI_KEY

# ElevenLabs
ELEVENLABS_API_KEY=YOUR_ELEVENLABS_KEY
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
```

You will add the real keys later.

---

## ▶️ Run (single execution flow)

### Option A: Run as a script (recommended)
```bash
npm run run:flow
```

### Option B: Run via API
Start server:
```bash
npm start
```

Trigger flow:
```bash
curl -X POST http://localhost:4000/api/run
```

---

## 📂 Output files

- Scraped products: `data/products.json`
- Summaries: `data/summaries.json`
- Audio files: `output/audio/product_1.mp3` ... `product_5.mp3`

---

## Design choices (simple + clear)
- **No DB**: uses local JSON files only
- **One-command execution**: `node scripts/runFlow.js`
- **Separation of concerns**:
  - `src/scraper/*` → scraping
  - `src/storage/*` → local file storage
  - `src/ai/*` → OpenAI summaries
  - `src/tts/*` → ElevenLabs audio generation

---

## Notes
- This is built to be runnable locally.
- Keep API calls minimal to avoid unnecessary billing.
