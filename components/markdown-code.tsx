"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { useTheme } from "next-themes"
import ShikiHighlighter, { rehypeInlineCodeProperty } from "react-shiki"

import { Button } from "@/components/ui/button"

export { rehypeInlineCodeProperty }

type MarkdownCodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number>(0)

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current)
  }, [])

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard may be unavailable in some contexts.
    }
  }, [code])

  const Icon = copied ? CheckIcon : CopyIcon

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={copied ? "Copied" : "Copy code"}
      className="absolute top-2 right-2 z-10 bg-transparent text-muted-foreground hover:text-foreground"
      onClick={onCopy}
    >
      <Icon />
    </Button>
  )
}

export function MarkdownCode({
  className,
  children,
  inline,
  ...props
}: MarkdownCodeProps) {
  const { resolvedTheme } = useTheme()
  const code = String(children).replace(/\n$/, "")
  const language = /language-([\w-]+)/.exec(className || "")?.[1]
  const syntaxTheme =
    resolvedTheme === "dark" ? "github-dark" : "github-light"

  if (inline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className="not-typeset relative mt-[1.25em]">
      {language ? (
        <span className="absolute top-2 right-10 z-10 flex h-6 items-center font-mono text-xs text-muted-foreground">
          {language}
        </span>
      ) : null}
      <CopyButton code={code} />
      <ShikiHighlighter
        language={language || "text"}
        theme={syntaxTheme}
        delay={100}
        showLanguage={false}
        className="overflow-hidden rounded-lg bg-[oklch(0.985_0_0)] text-[0.875em] leading-normal dark:bg-muted [&_pre]:bg-[oklch(0.985_0_0)]! dark:[&_pre]:bg-muted!"
      >
        {code}
      </ShikiHighlighter>
    </div>
  )
}

export function MarkdownPre({ children }: { children?: ReactNode }) {
  // react-markdown wraps fenced blocks in <pre><code>. Shiki renders its own
  // <pre>, so unwrap the outer one to avoid nested code blocks.
  return <>{children}</>
}
