import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import s from './FilterDropdown.module.css'

type FilterOption = { value: string; label: string }
type FilterDropdownProps = {
  label: string
  value: string
  options: FilterOption[]
  onChange?: (value: string) => void
  multiple?: boolean
  selected?: string[]
  onToggle?: (value: string) => void
}

export function FilterDropdown({ label, value, options, onChange, multiple, selected = [], onToggle }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const selectedLabel = multiple
    ? selected.length === options.length ? 'Все' : selected.length ? `${selected.length} из ${options.length}` : 'Нет'
    : options.find((option) => option.value === value)?.label || value

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.removeEventListener('mousedown', closeOnOutsideClick); document.removeEventListener('keydown', closeOnEscape) }
  }, [])

  return (
    <div className={`${s['filter-dropdown']} ${open ? s.open : ''}`} ref={rootRef}>
      <button type="button" className={s['filter-trigger']} onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span><small>{label}</small><b>{selectedLabel}</b></span>
        <ChevronDown size={15} />
      </button>
      {open && (
        <div className={s['filter-menu']} role="listbox" aria-label={label}>
          {options.map((option) => {
            const isSelected = multiple ? selected.includes(option.value) : option.value === value
            return (
              <button
                type="button" role="option" aria-selected={isSelected}
                className={isSelected ? s.selected : ''} key={option.value}
                onClick={() => {
                  if (multiple && onToggle) {
                    onToggle(option.value)
                  } else {
                    onChange?.(option.value)
                    setOpen(false)
                  }
                }}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={14} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
