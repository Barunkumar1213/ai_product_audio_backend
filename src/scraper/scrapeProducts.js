const axios = require("axios");

/**
 * Scrape exactly 5 products from a single source.
 * Source chosen: Fake Store API (simple product-based endpoint).
 * We only keep: productName + productDescription.
 */
async function scrapeFiveProducts() {
  const url = "https://fakestoreapi.com/products?limit=5";

  const resp = await axios.get(url, {
    timeout: 20000,
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const items = Array.isArray(resp.data) ? resp.data : [];

  const products = items.slice(0, 5).map((p, idx) => ({
    id: idx + 1,
    productName: String(p.title || "").trim(),
    productDescription: String(p.description || "").trim(),
  }));

  if (products.length !== 5) {
    throw new Error("Scraper must return exactly 5 products.");
  }

  return products;
}

module.exports = { scrapeFiveProducts };
