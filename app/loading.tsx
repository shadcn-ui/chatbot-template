import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <main
      className="flex min-h-svh items-center justify-center p-6"
      aria-live="polite"
      aria-busy="true"
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Loading chat</EmptyTitle>
          <EmptyDescription>
            Connecting to the available models…
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </main>
  )
}
