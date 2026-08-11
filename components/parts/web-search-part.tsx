import { GlobeIcon } from "lucide-react"

import { type WebSearchToolPart } from "@/tools"

export function WebSearchPart({ part }: { part: WebSearchToolPart }) {
  const query = part.input?.query ? ` for “${part.input.query}”` : ""

  switch (part.state) {
    case "input-streaming":
    case "input-available":
      return (
        <div className="flex items-center gap-2 px-1.5 text-sm text-muted-foreground">
          <GlobeIcon className="size-4" />
          Searching the web{query}…
        </div>
      )
    case "output-available":
      return (
        <div className="flex items-center gap-2 px-1.5 text-sm text-muted-foreground">
          <GlobeIcon className="size-4" />
          Searched the web{query}
        </div>
      )
    case "output-error":
      return (
        <div className="px-1.5 text-sm text-destructive">
          Web search failed: {part.errorText}
        </div>
      )
    default:
      return null
  }
}
