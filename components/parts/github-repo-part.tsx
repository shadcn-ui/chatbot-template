import { GitForkIcon, StarIcon } from "lucide-react"

import { type GithubRepoToolPart } from "@/tools"
import { safeHttpUrl } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

const formatCount = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format

export function GithubRepoPart({ part }: { part: GithubRepoToolPart }) {
  switch (part.state) {
    case "input-streaming":
    case "input-available":
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          Looking up {part.input?.repo ?? "repository"}…
        </div>
      )
    case "output-available":
      if ("error" in part.output) {
        return (
          <div className="text-sm text-destructive">{part.output.error}</div>
        )
      }
      return (
        <a
          href={safeHttpUrl(part.output.url) ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="flex w-fit items-center gap-3 px-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <span className="font-medium text-foreground">
            {part.output.repo}
          </span>
          <span className="flex items-center gap-1">
            <StarIcon className="size-3.5" />
            {formatCount(part.output.stars)}
          </span>
          <span className="flex items-center gap-1">
            <GitForkIcon className="size-3.5" />
            {formatCount(part.output.forks)}
          </span>
          <span>{part.output.language}</span>
        </a>
      )
    case "output-error":
      return (
        <div className="text-sm text-destructive">
          Repository lookup failed: {part.errorText}
        </div>
      )
    default:
      return null
  }
}
