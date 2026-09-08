#!/usr/bin/env node
// Keeper — Guardião da Coroa · chat de linha de comandos
// Zero dependências: usa apenas APIs nativas (fetch, readline) — corre com Node.js 18+ ou Deno.
//
// Configuração por variáveis de ambiente:
//   OPENAI_API_KEY  — chave da API (obrigatória com a OpenAI; desnecessária com Ollama/LM Studio)
//   OPENAI_BASE_URL — base do endpoint, ex.: https://api.openai.com/v1 (padrão) ou http://localhost:11434/v1
//   OPENAI_MODEL    — modelo, ex.: gpt-4o-mini (padrão) ou llama3.1

import { readFile } from "node:fs/promises";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const SYSTEM_PROMPT_PATH = new URL("./KEEPER.md", import.meta.url);
const systemPrompt = (await readFile(SYSTEM_PROMPT_PATH, "utf8")).trim();

const API_KEY = process.env.OPENAI_API_KEY ?? "";
const BASE_URL = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/+$/, "");
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const history = [{ role: "system", content: systemPrompt }];
const MAX_HISTORY = 40; // mensagens de conversa mantidas (para além do system)

const rl = readline.createInterface({ input, output });

console.log("── Keeper · Guardião da Coroa ──");
console.log("A Coroa está segura... por enquanto. Diz 'sair' para terminar.\n");

while (true) {
  const user = await rl.question("Roro: ");
  if (/^(sair|exit|quit)$/i.test(user.trim())) {
    console.log("\nKeeper: Vai com cuidado, Roro. A Coroa e eu ficamos aqui a guardar-te o lugar.\n");
    break;
  }
  history.push({ role: "user", content: user });
  if (history.length > MAX_HISTORY + 1) {
    history.splice(1, history.length - MAX_HISTORY - 1);
  }
  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify({ model: MODEL, messages: history, temperature: 0.8 }),
    });
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`HTTP ${res.status} — ${detail.slice(0, 200)}`);
    }
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? "(silêncio...)";
    console.log(`\nKeeper: ${reply}\n`);
    history.push({ role: "assistant", content: reply });
  } catch (err) {
    console.error(`\n[O Keeper não conseguiu falar — ${err.message}]\n`);
  }
}
rl.close();