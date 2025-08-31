import * as React from "react"

import { ToastAction } from "@/components/ui/toast"
import { useToast as useToastPrimitive } from "@/components/ui/use-toast"

export function useToast() {
  const { toast } = useToastPrimitive()

  return {
    toast,
    // You can add more specific toast functions here if needed
    // For example:
    // success: (message: string) => toast({ title: "Success", description: message }),
    // error: (message: string) => toast({ title: "Error", description: message, variant: "destructive" }),
  }
}
