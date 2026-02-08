import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // TEXT VISIBILITY
        "text-gray-900 dark:text-gray-100",
        "text-lg font-semibold tracking-wide",

        // BASE STYLES
        "border-input bg-transparent flex field-sizing-content min-h-20 w-full rounded-md border px-3 py-2 shadow-xs outline-none transition-[color,box-shadow]",
        "placeholder:text-muted-foreground",

        // INTERACTION
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "selection:bg-primary selection:text-primary-foreground",

        // STATES
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",

        className
      )}
      {...props}
    />
  )
}

export { Textarea }
