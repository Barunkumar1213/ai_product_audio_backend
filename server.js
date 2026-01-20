require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { runFlow } = require("./src/flow/runFlow");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

app.post("/api/run", async (req, res) => {
  try {
    const result = await runFlow();
    res.json({
      ok: true,
      message: "Flow completed successfully",
      result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      message: err.message || "Flow failed",
    });
  }
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
