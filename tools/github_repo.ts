import { tool } from "ai"
import { z } from "zod"

export const githubRepo = tool({
  description:
    "Get public stats for a GitHub repository: stars, forks, open issues, language, and description.",
  inputSchema: z.object({
    repo: z
      .string()
      .regex(/^[\w.-]+\/[\w.-]+$/, 'Must be in "owner/name" format.')
      .describe('The repository in "owner/name" format, e.g. "vercel/next.js"'),
  }),
  outputSchema: z.union([
    z.object({ error: z.string() }),
    z.object({
      repo: z.string(),
      description: z.string(),
      stars: z.number(),
      forks: z.number(),
      openIssues: z.number(),
      language: z.string(),
      url: z.string(),
    }),
  ]),
  execute: async ({ repo }, { abortSignal }) => {
    const timeout = AbortSignal.timeout(5000)
    const signal = abortSignal
      ? AbortSignal.any([abortSignal, timeout])
      : timeout

    try {
      const res = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: { accept: "application/vnd.github+json" },
        signal,
      })
      if (!res.ok) {
        return { error: `Could not find repository ${repo}.` }
      }
      const data = await res.json()
      return {
        repo: String(data.full_name ?? repo),
        description: String(data.description ?? ""),
        stars: Number(data.stargazers_count ?? 0),
        forks: Number(data.forks_count ?? 0),
        openIssues: Number(data.open_issues_count ?? 0),
        language: String(data.language ?? "Unknown"),
        url: String(data.html_url ?? `https://github.com/${repo}`),
      }
    } catch {
      return { error: `Could not reach GitHub for ${repo}.` }
    }
  },
})
