import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-gray-900 dark:text-gray-100",
        "text-lg font-semibold tracking-wide",

        // BASE STYLES
        "bg-transparent border-input h-11 w-full min-w-0 rounded-md border px-3 py-2 shadow-xs outline-none transition-[color,box-shadow]",
        "placeholder:text-muted-foreground",
        "file:text-foreground file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium",

        // INTERACTION
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "selection:bg-primary selection:text-primary-foreground",

        // STATES
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

        className
      )}
      {...props}
    />
  )
}

export { Input }
