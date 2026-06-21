import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import s from './FilterDropdown.module.css'

type FilterOption = { value: string; label: string }
type FilterDropdownProps = { label: string; value: string; options: FilterOption[]; onChange: (value: string) => void }

export function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selectedLabel = options.find((option) => option.value === value)?.label || value

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
          {options.map((option) => (
            <button type="button" role="option" aria-selected={option.value === value}
              className={option.value === value ? s.selected : ''} key={option.value}
              onClick={() => { onChange(option.value); setOpen(false) }}>
              <span>{option.label}</span>
              {option.value === value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
