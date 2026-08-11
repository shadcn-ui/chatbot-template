import Link from "next/link"
import { ArrowLeftIcon, SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            This address does not point to a page in the chat application.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link href="/" aria-label="Return to chat" />}>
            <ArrowLeftIcon data-icon="inline-start" />
            Return to chat
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}
