import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function NewChatButton() {
  return (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <Button variant="secondary" render={<a href="/" />} nativeButton={false}>
      <PlusIcon data-icon="inline-start" />
      New Chat
    </Button>
  )
}
