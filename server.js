import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const PORT = process.env.PORT || 3000;
const ROOT = new URL(".", import.meta.url);

const OPENROUTER_URL = process.env.OPENROUTER_URL || "https://openrouter.ai/api/v1";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";
const OPENROUTER_KEY = process.env.OPENROUTER_KEY || "";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  const path = req.url.split("?")[0];

  // --- API proxy ---
  if (path === "/api/chat" && req.method === "POST") {
    if (!OPENROUTER_KEY) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "OPENROUTER_KEY not configured on server" }));
      return;
    }
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body);
      payload.model = OPENROUTER_MODEL;
      const fwd = await fetch(OPENROUTER_URL.replace(/\/+$/, "") + "/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + OPENROUTER_KEY,
        },
        body: JSON.stringify(payload),
      });
      const data = await fwd.text();
      res.writeHead(fwd.status, { "Content-Type": "application/json" });
      res.end(data);
    } catch (err) {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: String(err) }));
    }
    return;
  }

  // --- Static files ---
  let filePath = path === "/" ? "/index.html" : path;
  try {
    const file = await readFile(join(ROOT.pathname, filePath));
    const mime = MIME[extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime });
    res.end(file);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404");
  }
});

server.listen(PORT, () => {
  console.log(`Keeper a escutar em http://localhost:${PORT}`);
});
