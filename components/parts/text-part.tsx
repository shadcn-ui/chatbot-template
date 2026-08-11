"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import {
  MarkdownCode,
  MarkdownPre,
  rehypeInlineCodeProperty,
} from "@/components/markdown-code"
import { type TextMessagePart } from "@/tools"

export function TextPart({ part }: { part: TextMessagePart }) {
  if (!part.text.trim()) {
    return null
  }

  return (
    <div className="typeset typeset-docs px-1.5">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeInlineCodeProperty]}
        components={{
          code: MarkdownCode,
          pre: MarkdownPre,
        }}
      >
        {part.text}
      </ReactMarkdown>
    </div>
  )
}
