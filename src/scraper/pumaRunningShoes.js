const puppeteer = require("puppeteer");

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function scrapePumaRunningShoes() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--start-maximized",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  );

  const listingUrl =
    "https://in.puma.com/in/en/mens/mens-shoes/mens-running-shoes";

  console.log("🌐 Opening Puma listing page...");
  await page.goto(listingUrl, { waitUntil: "networkidle2", timeout: 0 });

  // Accept cookies if needed
  try {
    await page.waitForSelector("button[id*='accept']", { timeout: 5000 });
    await page.click("button[id*='accept']");
  } catch {}

  // Scroll a bit
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await sleep(1200);
  }

  // Collect product links
  const productLinks = await page.evaluate(() => {
    return Array.from(
      new Set(
        Array.from(document.querySelectorAll("a[href*='/pd/']")).map(
          (a) => a.href,
        ),
      ),
    );
  });

  if (productLinks.length === 0) {
    throw new Error("No product links found on Puma page");
  }

  console.log(`🔗 Found ${productLinks.length} product links`);

  const products = [];

  // Visit each product page
  for (const link of productLinks) {
    if (products.length === 5) break;

    console.log(`➡️ Opening product page`);
    await page.goto(link, { waitUntil: "networkidle2", timeout: 0 });
    await sleep(1000);

    const product = await page.evaluate(() => {
      const name = document.querySelector("h1")?.innerText?.trim();

      const price = document
        .querySelector("[class*='price']")
        ?.innerText?.trim();

      const image = document.querySelector("img")?.src;

      const description = document
        .querySelector("div[class*='description']")
        ?.innerText?.trim();

      if (!name) return null;

      return {
        productName: name,
        price: price || "N/A",
        productDescription: description || "N/A",
        imageUrl: image || "",
      };
    });

    if (product) {
      products.push(product);
    }
  }

  await browser.close();

  if (products.length < 5) {
    throw new Error(`Only scraped ${products.length} products`);
  }

  // Attach internal IDs
  return products.map((p, i) => ({
    id: i + 1,
    ...p,
  }));
}

module.exports = { scrapePumaRunningShoes };
