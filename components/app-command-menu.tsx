"use client"

import * as React from "react"
import {
  LaptopIcon,
  MessageSquarePlusIcon,
  MoonIcon,
  SunIcon,
  TextCursorInputIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

import { OPEN_COMMAND_MENU_EVENT } from "@/lib/chat-events"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function AppCommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [availableActions, setAvailableActions] = React.useState({
    newChat: false,
    composer: false,
  })
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    function updateAvailableActions() {
      const newChatButton = document.getElementById("new-chat")

      setAvailableActions({
        newChat:
          newChatButton instanceof HTMLButtonElement && !newChatButton.disabled,
        composer: document.getElementById("chat-prompt") !== null,
      })
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        updateAvailableActions()
        setOpen((current) => !current)
      }
    }

    function onOpenCommandMenu() {
      updateAvailableActions()
      setOpen(true)
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, onOpenCommandMenu)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, onOpenCommandMenu)
    }
  }, [])

  function runCommand(command: () => void) {
    setOpen(false)
    window.requestAnimationFrame(command)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Chat commands"
      description="Start a new chat, focus the composer, or change appearance."
    >
      <Command>
        <CommandInput
          aria-label="Search commands"
          placeholder="Search commands…"
        />
        <CommandList>
          <CommandEmpty>No commands found.</CommandEmpty>
          <CommandGroup heading="Chat">
            <CommandItem
              disabled={!availableActions.newChat}
              onSelect={() =>
                runCommand(() => document.getElementById("new-chat")?.click())
              }
            >
              <MessageSquarePlusIcon />
              New chat
            </CommandItem>
            <CommandItem
              disabled={!availableActions.composer}
              onSelect={() =>
                runCommand(() =>
                  document.getElementById("chat-prompt")?.focus()
                )
              }
            >
              <TextCursorInputIcon />
              Focus message composer
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Appearance">
            <CommandItem
              data-checked={theme === "system"}
              onSelect={() => runCommand(() => setTheme("system"))}
            >
              <LaptopIcon />
              System theme
            </CommandItem>
            <CommandItem
              data-checked={theme === "light"}
              onSelect={() => runCommand(() => setTheme("light"))}
            >
              <SunIcon />
              Light theme
            </CommandItem>
            <CommandItem
              data-checked={theme === "dark"}
              onSelect={() => runCommand(() => setTheme("dark"))}
            >
              <MoonIcon />
              Dark theme
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
