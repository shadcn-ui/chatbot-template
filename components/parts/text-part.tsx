import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { type TextMessagePart } from "@/tools"

export function TextPart({ part }: { part: TextMessagePart }) {
  if (!part.text.trim()) {
    return null
  }

  return (
    <div className="typeset typeset-docs px-1.5">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
    </div>
  )
}
