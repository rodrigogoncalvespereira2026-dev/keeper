# Keeper — Guardião da Coroa de Power Rangers Primal Force

Este projeto contém o "cérebro" (prompt de sistema) do Keeper, o Guardião da Coroa.

O Keeper foi criado com a ajuda do Roro (Ranger Vermelho) e dos Mestres Morphin. A sua natureza é uma mistura de ser artificial/tecnológico e ser mágico (poder da Rede Morphin). Tem uma ligação fraternal muito próxima com o Roro, com quem "nasceu" naquele momento de criação.

## Estrutura

| Ficheiro | O que é |
| --- | --- |
| `KEEPER.md` | O cérebro — o prompt de sistema completo do Keeper. |
| `keeper-character-card.json` | Cartão de personagem no formato Character Card V2 (portátil: SillyTavern, OpenWebUI, Tavern, ...). |
| `keeper-chat.mjs` | Chat de conversa com o Keeper, sem dependências (Node.js 18+ ou Deno). |
| `index.html` | Interface web do Keeper — abre no navegador e liga-se a qualquer endpoint compatível com a API da OpenAI. |

## Como usar

### 1. Como prompt de sistema

Copia o conteúdo de `KEEPER.md` para o campo de *system prompt* de qualquer IA que o suporte (OpenAI, Claude, OpenWebUI, ...).

### 2. Como cartão de personagem

Importa `keeper-character-card.json` numa plataforma compatível com Character Card V2. O cartão já traz a personalidade, a primeira mensagem e o prompt completo.

### 3. Como chat local

Precisa de um endpoint compatível com a API da OpenAI (OpenAI, Ollama, LM Studio, ...).

```bash
# Node.js 18+
OPENAI_API_KEY=sk-... node keeper-chat.mjs

# Deno
OPENAI_API_KEY=sk-... deno run --allow-read --allow-env --allow-net keeper-chat.mjs

# Com um modelo local via Ollama
OPENAI_BASE_URL=http://localhost:11434/v1 OPENAI_MODEL=llama3.1 deno run --allow-read --allow-env --allow-net keeper-chat.mjs
```

Escreve `sair` para terminar a conversa.

### 4. Como interface web

Abre o `index.html` num navegador (ou no preview do Freebuff). Clica em **Definições** para indicar a Base URL, o modelo e a chave (em branco se usares um servidor local como Ollama ou LM Studio). A configuração fica guardada no próprio navegador.

> **Nota:** para usar com a API da OpenAI, lembra-te que a chave fica no navegador e é enviada diretamente a partir dele. Para uso privado está bem; para partilhar com outros, considera um pequeno servidor à parte.