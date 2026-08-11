"use client"

import { SearchIcon } from "lucide-react"

import { OPEN_COMMAND_MENU_EVENT } from "@/lib/chat-events"
import { Button } from "@/components/ui/button"

export function CommandMenuButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label="Open command menu"
      aria-keyshortcuts="Meta+K Control+K"
      onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT))}
    >
      <SearchIcon data-icon="inline-start" />
      <span className="hidden sm:inline">Commands</span>
      <kbd className="ml-1 hidden font-mono text-xs text-muted-foreground md:inline">
        ⌘K
      </kbd>
    </Button>
  )
}
