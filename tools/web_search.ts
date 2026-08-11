import { anthropic } from "@ai-sdk/anthropic"
import { openai } from "@ai-sdk/openai"

export function getWebSearch(modelId: string) {
  if (modelId.startsWith("openai/")) {
    return openai.tools.webSearch()
  }
  if (modelId.startsWith("anthropic/")) {
    return anthropic.tools.webSearch_20260209()
  }
  return undefined
}
