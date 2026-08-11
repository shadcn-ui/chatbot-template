"use client"

import * as React from "react"

import { type GatewayModel } from "@/lib/models"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ModelSelect({
  models,
  value,
  onValueChange,
  disabled = false,
}: {
  models: GatewayModel[]
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
}) {
  const items = React.useMemo(
    () => models.map((model) => ({ label: model.name, value: model.id })),
    [models]
  )

  return (
    <Select
      items={items}
      value={value}
      disabled={disabled}
      onValueChange={(next) => {
        if (typeof next === "string") onValueChange(next)
      }}
    >
      <SelectTrigger aria-label="Model" className="bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
