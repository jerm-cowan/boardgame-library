import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Classes for the positioning wrapper (e.g. a fixed width) — not the <select> itself. */
  wrapperClassName?: string
}

// Native selects with the default appearance draw their caret flush against the edge,
// ignoring right padding. appearance-none + a positioned icon lets padding actually apply.
export default function Select({ wrapperClassName = '', children, ...props }: SelectProps) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <select
        {...props}
        className="w-full appearance-none rounded-md bg-popover py-1.5 pl-2 pr-8 focus:outline-none"
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={2}
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}
