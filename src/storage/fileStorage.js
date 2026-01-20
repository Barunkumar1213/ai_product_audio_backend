const fs = require("fs");
const path = require("path");

async function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
}

async function saveJson(filePath, data) {
  await ensureDir(filePath);
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function readJson(filePath) {
  const raw = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

module.exports = { saveJson, readJson };
