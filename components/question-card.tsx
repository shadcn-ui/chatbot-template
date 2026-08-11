"use client"

import { type AskUserToolPart } from "@/lib/tools"
import { Spinner } from "@/components/ui/spinner"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

export function QuestionCard({
  part,
  isPending,
  onAnswer,
}: {
  part: AskUserToolPart
  isPending: boolean
  onAnswer: (
    toolCallId: string,
    answers: { question: string; answer: string }[]
  ) => Promise<void>
}) {
  const questions = part.state === "input-available" ? part.input.questions : []

  return (
    <div className="sticky bottom-2 isolate z-50 mx-auto w-full max-w-2xl px-6 pt-2">
      <div className="w-full rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10">
        {questions.length === 0 ? (
          <div className="flex shimmer items-center gap-2 py-2 text-muted-foreground">
            Preparing a question…
          </div>
        ) : (
          <Questionnaire
            key={part.toolCallId}
            defaultItem="q0"
            aria-busy={isPending}
            items={questions.map((question, index) => ({
              choices: question.choices.map((choice) => ({ value: choice })),
              name: `q${index}`,
              required: true,
            }))}
            onSubmit={(event) => {
              event.preventDefault()
              if (isPending) return
              const formData = new FormData(event.currentTarget)
              onAnswer(
                part.toolCallId,
                questions.map((question, index) => ({
                  question: question.question,
                  answer: String(formData.get(`q${index}`) ?? ""),
                }))
              )
            }}
          >
            {questions.length > 1 && (
              <QuestionnaireProgress className="-mb-4" />
            )}
            {questions.map((question, index) => (
              <QuestionnaireItem key={index} name={`q${index}`} required>
                <QuestionnaireTitle>{question.question}</QuestionnaireTitle>
                <QuestionnaireChoices>
                  {question.choices.map((choice) => (
                    <QuestionnaireChoice key={choice} value={choice}>
                      {choice}
                    </QuestionnaireChoice>
                  ))}
                  <QuestionnaireInput
                    aria-label="Another answer"
                    placeholder="Type another answer…"
                  />
                </QuestionnaireChoices>
                <QuestionnaireError />
              </QuestionnaireItem>
            ))}
            <QuestionnaireActions>
              <span className="sr-only" role="status" aria-live="polite">
                {isPending ? "Sending answer" : ""}
              </span>
              <QuestionnairePrevious disabled={isPending} />
              <QuestionnaireNext disabled={isPending}>Next</QuestionnaireNext>
              <QuestionnaireSubmit disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner />
                    Sending…
                  </>
                ) : (
                  "Answer"
                )}
              </QuestionnaireSubmit>
            </QuestionnaireActions>
          </Questionnaire>
        )}
      </div>
    </div>
  )
}
