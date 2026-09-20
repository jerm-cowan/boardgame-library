import { Minus, Plus } from 'lucide-react'

interface NumberStepperProps {
  value: number | null
  onChange: (value: number | null) => void
  min?: number
  max?: number
  step?: number
  /** When true, clearing the input (or stepping below min) can produce `null` (e.g. an "Any" state). */
  allowClear?: boolean
  placeholder?: string
  ariaLabel: string
  className?: string
  required?: boolean
}

// Shared left/right increment-decrement control, replacing native stacked spinner arrows.
export default function NumberStepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  allowClear = false,
  placeholder,
  ariaLabel,
  className = '',
  required = false,
}: NumberStepperProps) {
  function clamp(next: number) {
    let result = next
    if (min !== undefined) result = Math.max(min, result)
    if (max !== undefined) result = Math.min(max, result)
    return result
  }

  function nudge(delta: number) {
    const base = value ?? min ?? 0
    onChange(clamp(base + delta))
  }

  const atMin = min !== undefined && value !== null && value <= min
  const atMax = max !== undefined && value !== null && value >= max

  return (
    <div className={`inline-flex w-fit shrink-0 items-stretch self-start overflow-hidden rounded-md bg-popover ${className}`}>
      <button
        type="button"
        onClick={() => nudge(-step)}
        disabled={atMin}
        aria-label={`Decrease ${ariaLabel}`}
        className="flex w-7 items-center justify-center text-muted-foreground hover:bg-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus size={14} strokeWidth={2} aria-hidden="true" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        required={required}
        min={min}
        max={max}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(event) => {
          const raw = event.target.value
          if (raw === '') {
            onChange(allowClear ? null : (min ?? 0))
            return
          }
          const parsed = Number(raw)
          if (!Number.isNaN(parsed)) onChange(parsed)
        }}
        aria-label={ariaLabel}
        className="no-spinner w-12 bg-transparent px-1 py-1.5 text-center focus:outline-none"
      />
      <button
        type="button"
        onClick={() => nudge(step)}
        disabled={atMax}
        aria-label={`Increase ${ariaLabel}`}
        className="flex w-7 items-center justify-center text-muted-foreground hover:bg-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus size={14} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  )
}
