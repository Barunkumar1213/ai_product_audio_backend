require("dotenv").config();
const { runFlow } = require("../src/flow/runFlow");

(async () => {
  try {
    console.log("🚀 Starting full execution flow...");
    const result = await runFlow();
    console.log("✅ Done!");
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("❌ Flow failed:", err);
    process.exit(1);
  }
})();
