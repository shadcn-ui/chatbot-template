"use client"

import { ArrowUpRightIcon, GlobeIcon } from "lucide-react"

import { type ChatMessagePart, type SourceUrlPart } from "@/lib/tools"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"

function getUniqueSources(parts: ChatMessagePart[]): SourceUrlPart[] {
  return parts
    .filter((part): part is SourceUrlPart => part.type === "source-url")
    .filter(
      (source, index, all) =>
        all.findIndex((other) => other.url === source.url) === index
    )
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export function SourcesPart({ parts }: { parts: ChatMessagePart[] }) {
  const sources = getUniqueSources(parts)

  if (sources.length === 0) {
    return null
  }

  const count = sources.length
  const label = `Searched ${count} ${count === 1 ? "website" : "websites"}`

  return (
    <div className="p-1">
      <Drawer swipeDirection="right" modal={false}>
        <DrawerTrigger render={<Button variant="link" className="w-fit" />}>
          <GlobeIcon data-icon="inline-start" />
          {label}
        </DrawerTrigger>
        <DrawerContent className="ring-1 ring-foreground/5 dark:ring-foreground/10">
          <DrawerHeader>
            <DrawerTitle>{label}</DrawerTitle>
            <DrawerDescription className="sr-only">
              Sources used to answer this message.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 scroll-fade-b overflow-y-auto p-4">
            <ItemGroup>
              {sources.map((source) => {
                const hostname = getHostname(source.url)
                const title = source.title || hostname

                return (
                  <Item
                    key={source.sourceId}
                    variant="muted"
                    size="sm"
                    className="rounded-xl"
                    render={
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${title} from ${hostname}`}
                      />
                    }
                    role="listitem"
                  >
                    <ItemContent>
                      <ItemTitle>{title}</ItemTitle>
                      <ItemDescription>{hostname}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <ArrowUpRightIcon className="size-4" />
                    </ItemActions>
                  </Item>
                )
              })}
            </ItemGroup>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
