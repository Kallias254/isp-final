"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type MultiOption = {
  value: string
  label: string
  hint?: string
}

type MultiComboboxProps = {
  name: string
  label?: string
  options: MultiOption[]
  placeholder?: string
  emptyText?: string
  defaultSelected?: string[]
  className?: string
  maxHeight?: number
}

export function MultiCombobox({
  name,
  label,
  options,
  placeholder = "Select...",
  emptyText = "No results found",
  defaultSelected = [],
  className,
  maxHeight = 260,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<string[]>(defaultSelected)

  const toggle = (v: string) => {
    setSelected((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]))
  }

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelected([])
  }

  const selectedItems = React.useMemo(() => options.filter((o) => selected.includes(o.value)), [options, selected])

  return (
    <div className={cn("grid gap-2", className)}>
      {label ? <label className="text-sm font-medium">{label}</label> : null}

      {/* Hidden inputs for form submit */}
      {selected.map((v) => (
        <input key={v} type="hidden" name={name} value={v} />
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full bg-background"
          >
            <div className="flex flex-wrap items-center gap-1.5 text-left">
              {selectedItems.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedItems.map((item) => (
                  <Badge key={item.value} variant="secondary" className="gap-1">
                    <span>{item.label}</span>
                    <X
                      className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggle(item.value)
                      }}
                    />
                  </Badge>
                ))
              )}
            </div>
            <div className="flex items-center gap-2">
              {selected.length > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-muted-foreground"
                  onClick={clearAll}
                >
                  Clear
                </Button>
              ) : null}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
          <Command shouldFilter={true}>
            <div className="p-2">
              <CommandInput placeholder="Search..." />
            </div>
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">{emptyText}</CommandEmpty>
              <CommandGroup className="px-1">
                <ScrollArea style={{ maxHeight }}>
                  {options.map((o) => {
                    const active = selected.includes(o.value)
                    return (
                      <CommandItem
                        key={o.value}
                        keywords={[o.label, o.hint ?? ""]}
                        onSelect={() => toggle(o.value)}
                        className="gap-2 px-2"
                      >
                        <Check className={cn("h-4 w-4", active ? "opacity-100" : "opacity-0")} />
                        <div className="flex flex-col">
                          <span className="text-sm">{o.label}</span>
                          {o.hint ? <span className="text-xs text-muted-foreground">{o.hint}</span> : null}
                        </div>
                      </CommandItem>
                    )
                  })}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
