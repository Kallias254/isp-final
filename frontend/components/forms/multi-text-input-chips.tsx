"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type MultiTextInputChipsProps = {
  name: string
  label?: string
  placeholder?: string
  helperText?: string
  defaultValues?: string[]
  validate?: (value: string) => boolean
  className?: string
}

export function MultiTextInputChips({
  name,
  label,
  placeholder = "Type and press Enter…",
  helperText,
  defaultValues = [],
  validate,
  className,
}: MultiTextInputChipsProps) {
  const [items, setItems] = React.useState<string[]>(defaultValues)
  const [value, setValue] = React.useState("")

  const add = (raw: string) => {
    const v = raw.trim()
    if (!v) return
    if (validate && !validate(v)) return
    setItems((cur) => (cur.includes(v) ? cur : [...cur, v]))
    setValue("")
  }

  const remove = (v: string) => setItems((cur) => cur.filter((x) => x !== v))

  return (
    <div className={cn("grid gap-2", className)}>
      {label ? <label className="text-sm font-medium">{label}</label> : null}

      {/* Hidden inputs for form submit */}
      {items.map((v, i) => (
        <input key={`${v}-${i}`} type="hidden" name={name} value={v} />
      ))}

      <div className="rounded-md border bg-background p-2">
        <div className="flex flex-wrap gap-1.5">
          {items.map((v) => (
            <Badge key={v} variant="secondary" className="gap-1">
              <span>{v}</span>
              <X className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100" onClick={() => remove(v)} />
            </Badge>
          ))}
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
                e.preventDefault()
                add(value)
              } else if (e.key === "Backspace" && value.length === 0 && items.length > 0) {
                remove(items[items.length - 1])
              }
            }}
            onBlur={() => add(value)}
            placeholder={placeholder}
            className="h-7 w-[220px] border-none px-0 shadow-none focus-visible:ring-0"
          />
        </div>
      </div>
      {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
      {items.length > 0 ? (
        <Button
          type="button"
          variant="ghost"
          className="justify-start w-fit h-8 px-2 text-muted-foreground"
          onClick={() => setItems([])}
        >
          Clear all
        </Button>
      ) : null}
    </div>
  )
}
