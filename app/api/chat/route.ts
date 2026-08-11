import { GatewayError } from "@ai-sdk/gateway"
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
} from "ai"
import { z } from "zod"

import { DEFAULT_MODEL, isModelAllowed } from "@/lib/models"
import { getTools, type ChatUIMessage } from "@/lib/tools"

const chatRequestSchema = z.object({
  messages: z.array(
    z
      .object({
        id: z.string(),
        role: z.enum(["system", "user", "assistant"]),
        parts: z.array(z.unknown()),
      })
      .passthrough()
  ),
  model: z.string().min(1).optional(),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => undefined)
  const request = chatRequestSchema.safeParse(body)

  if (!request.success) {
    return Response.json({ error: "Invalid chat request." }, { status: 400 })
  }

  const { messages, model } = request.data as {
    messages: ChatUIMessage[]
    model?: string
  }

  const modelId = model ?? DEFAULT_MODEL

  if (!isModelAllowed(modelId)) {
    return Response.json(
      { error: `Model ${modelId} is not available.` },
      { status: 400 }
    )
  }

  const result = streamText({
    model: modelId,
    messages: await convertToModelMessages(messages),
    tools: getTools(modelId),
    stopWhen: isStepCount(5),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      sendSources: true,
      onError: (error) =>
        GatewayError.isInstance(error)
          ? error.message
          : "Something went wrong. Please try again.",
    }),
  })
}
