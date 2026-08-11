import type { Metadata } from "next"

import { MODELS } from "@/lib/models"
import { Chat } from "@/components/chat"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Chat",
  description:
    "A chatbot template built using shadcn/ui, shadcn/react and shadcn/typeset, powered by the Vercel AI Gateway.",
}

export default function Page() {
  return (
    <Chat models={MODELS}>
      <SiteHeader />
    </Chat>
  )
}
