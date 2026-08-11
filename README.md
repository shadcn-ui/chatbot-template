<h1 align="center">
Chatbot Template
</h1>

<p align="center">
  <a href="https://github.com/shadcn-ui/chatbot-template/stargazers"><img src="https://shieldcn.dev/github/stars/shadcn-ui/chatbot-template.svg?variant=secondary&size=xs" alt="GitHub stars" /></a>
  <a href="https://github.com/shadcn-ui/chatbot-template/forks"><img src="https://shieldcn.dev/github/forks/shadcn-ui/chatbot-template.svg?variant=secondary&size=xs" alt="GitHub forks" /></a>
  <a href="https://github.com/shadcn-ui/chatbot-template/blob/main/LICENSE"><img src="https://shieldcn.dev/github/license/shadcn-ui/chatbot-template.svg?variant=secondary&size=xs" alt="License" /></a>
  <a href="https://github.com/shadcn-ui/chatbot-template/commits/main"><img src="https://shieldcn.dev/github/last-commit/shadcn-ui/chatbot-template.svg?variant=secondary&size=xs" alt="Last commit" /></a>
</p>

A minimal chatbot template built with Next.js, the [AI SDK](https://ai-sdk.dev), [shadcn/ui](https://ui.shadcn.com), [shadcn/react](https://ui.shadcn.com/docs/react/message-scroller), [shadcn/typeset](https://ui.shadcn.com/docs/typeset) and the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway).

## Features

- Streaming chat with markdown rendering and shadcn/typeset
- Tool calling example
- Web search via each provider's built-in search tool
- Human-in-the-loop questionnaire. The model can ask clarifying questions, answered with the shadcn questionnaire component

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshadcn-ui%2Fchatbot-template&project-name=chatbot-template&repository-name=chatbot-template)

That's it — no configuration needed. Vercel deployments authenticate to the AI Gateway automatically via OIDC, and usage runs on your team's [AI Gateway credits](https://vercel.com/docs/ai-gateway/pricing).

## Local development

```bash
pnpm install
```

Then give the app a gateway credential, either by pulling an OIDC token from your linked Vercel project:

```bash
vercel link
vercel env pull
```

or by creating an API key in the Vercel dashboard (**AI Gateway → API Keys**) and adding it to `.env.local`:

```bash
cp .env.example .env.local
# then set AI_GATEWAY_API_KEY=...
```

Start the dev server:

```bash
pnpm dev
```

## Configuration

| Env var              | Required       | Description                                                  |
| -------------------- | -------------- | ------------------------------------------------------------ |
| `AI_GATEWAY_API_KEY` | Local dev only | AI Gateway API key. Not needed on Vercel deployments (OIDC). |

The model list lives in [lib/models.ts](lib/models.ts) — the first entry is the default model.

## How it works

- [app/page.tsx](app/page.tsx) fetches the model catalog server-side with `gateway.getAvailableModels()` and renders the chat, or a setup notice if no credential is configured.
- [app/api/chat/route.ts](app/api/chat/route.ts) streams responses with `streamText` — plain `"provider/model"` strings route through the AI Gateway automatically.
- [components/chat.tsx](components/chat.tsx) renders the conversation with `useChat` and shadcn chat primitives.
- [lib/tools.ts](lib/tools.ts) defines the tools: a server-executed GitHub repo lookup, the interactive `ask_user` questionnaire, and provider-native web search.

## Tool parts

Assistant messages are a list of typed parts. [components/chat-message.tsx](components/chat-message.tsx) switches on `part.type` and delegates each one to a component in [components/parts/](components/parts):

| Part type          | Component                                                          | Renders                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`             | [text-part.tsx](components/parts/text-part.tsx)                   | Markdown via react-markdown and shadcn/typeset.                                                                                                |
| `tool-github_repo` | [github-repo-part.tsx](components/parts/github-repo-part.tsx)     | A spinner while the lookup runs, then a linked stat line (stars, forks, language).                                                             |
| `tool-web_search`  | [web-search-part.tsx](components/parts/web-search-part.tsx)       | A "Searching the web…" status while the search runs, then a persistent "Searched the web" line per search.                                     |
| `tool-ask_user`    | [ask-user-part.tsx](components/parts/ask-user-part.tsx)           | The answered questions inline. Pending questions render in [question-card.tsx](components/question-card.tsx), pinned to the scroller bottom.   |
| `source-url`       | [sources-part.tsx](components/parts/sources-part.tsx)             | Web search citations, deduped into a "Searched N websites" drawer once the message finishes streaming.                                         |

Tool parts move through states as the stream progresses — `input-streaming` → `input-available` → `output-available` (or `output-error`) — and each component switches on `part.state` to show progress, results, and failures.

### Adding your own tool

1. Define the tool in [lib/tools.ts](lib/tools.ts) with a `description`, an `inputSchema`, and an `execute` function (omit `execute` for tools the user answers in the UI, like `ask_user`).
2. Add a part component in [components/parts/](components/parts) and a `case "tool-<name>"` in [chat-message.tsx](components/chat-message.tsx).

Message types are inferred from the tool definitions via `InferUITools`, so `part.input` and `part.output` are fully typed in your part component — renaming a tool field is a build error, not a silent `undefined`.

## Adding components

```bash
npx shadcn@latest add button
```

## License

MIT — see [LICENSE](LICENSE).
