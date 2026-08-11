"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { type GatewayModel } from "@/lib/models"
import { type ChatUIMessage } from "@/lib/tools"
import { ChatActionsProvider } from "@/components/chat-actions"
import { ChatMessage } from "@/components/chat-message"
import { PromptForm } from "@/components/prompt-form"
import { QuestionCard } from "@/components/question-card"
import { Suggestions } from "@/components/suggestions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

export function Chat({
  models,
  children,
}: {
  models: GatewayModel[]
  children?: React.ReactNode
}) {
  const [model, setModel] = React.useState(models[0]?.id ?? "")
  const [isAnswering, setIsAnswering] = React.useState(false)

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    setMessages,
    addToolOutput,
  } = useChat<ChatUIMessage>({
    // Resume the conversation automatically once the user has answered the
    // ask_user questionnaire.
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  })

  const resolvedModel = models.some((m) => m.id === model)
    ? model
    : (models[0]?.id ?? "")

  const isBusy = status === "submitted" || status === "streaming"

  const lastMessage = messages.at(-1)
  const pendingQuestion =
    lastMessage?.role === "assistant"
      ? lastMessage.parts.find(
          (part): part is Extract<typeof part, { type: "tool-ask_user" }> =>
            part.type === "tool-ask_user" &&
            (part.state === "input-streaming" ||
              part.state === "input-available")
        )
      : undefined

  async function handleAnswer(
    toolCallId: string,
    answer: { question: string; answer: string }[]
  ) {
    if (isAnswering) return

    setIsAnswering(true)
    try {
      await addToolOutput({
        tool: "ask_user",
        toolCallId,
        output: answer,
      })
    } finally {
      setIsAnswering(false)
    }
  }

  return (
    <ChatActionsProvider isBusy={isBusy} onNewChat={() => setMessages([])}>
      <div className="mx-auto flex h-svh w-full flex-col">
        {children}
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>What can I help with?</EmptyTitle>
                <EmptyDescription>
                  Pick a model and start chatting. Responses stream through the
                  Vercel AI Gateway.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Suggestions
                  onSelect={(prompt) =>
                    sendMessage(
                      { text: prompt },
                      { body: { model: resolvedModel } }
                    )
                  }
                />
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <MessageScrollerProvider>
            <MessageScroller className="flex-1">
              <MessageScrollerViewport>
                <MessageScrollerContent className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-6">
                  {messages.map((message) => (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                      scrollAnchor={message.role === "user"}
                    >
                      <ChatMessage
                        message={message}
                        isStreaming={isBusy && message.id === lastMessage?.id}
                      />
                    </MessageScrollerItem>
                  ))}
                  {status === "submitted" && (
                    <MessageScrollerItem messageId="thinking">
                      <div
                        className="flex shimmer items-center gap-2 px-3 text-sm text-muted-foreground"
                        role="status"
                        aria-live="polite"
                      >
                        Thinking…
                      </div>
                    </MessageScrollerItem>
                  )}
                </MessageScrollerContent>
                {pendingQuestion && (
                  <QuestionCard
                    part={pendingQuestion}
                    isPending={isAnswering}
                    onAnswer={handleAnswer}
                  />
                )}
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        )}

        <div className="mx-auto flex w-full max-w-2xl flex-col gap-2 px-6 pb-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Request failed</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <PromptForm
            models={models}
            model={resolvedModel}
            onModelChange={setModel}
            isBusy={isBusy}
            onSubmit={(text) =>
              sendMessage({ text }, { body: { model: resolvedModel } })
            }
            onStop={() => stop()}
          />
        </div>
      </div>
    </ChatActionsProvider>
  )
}
