import { useMemo } from 'react'
import { FilterDropdown } from './FilterDropdown'
import { CompanyLogo } from './CompanyLogo'
import { questionTypeDefinitions, companyOrder, topicDefinitions, roleOrder, questionWord } from './filters'
import type { Question } from './types'
import s from './App.module.css'

export interface FilterState {
  activeCompany: string
  activeRole: string
  activeTopic: string
  sortMode: string
  activeTypes: Set<string>
}

interface QuestionFiltersProps {
  questions: Question[]
  filterState: FilterState
  onChange: (state: Partial<FilterState>) => void
  showCompanyPills?: boolean
  showSort?: boolean
  showTypePills?: boolean
  showRole?: boolean
  showTopic?: boolean
}

export function QuestionFilters({
  questions,
  filterState,
  onChange,
  showCompanyPills = true,
  showSort = true,
  showTypePills = true,
  showRole = true,
  showTopic = true,
}: QuestionFiltersProps) {
  const companies = useMemo(() => companyOrder.map((name) => ({
    name,
    count: questions.filter((q) => (q.companies || []).includes(name)).length,
  })).filter((c) => c.count > 0), [questions])

  const roles = useMemo(() => {
    const present = new Set(questions.flatMap((q) => q.roles || []))
    return roleOrder.filter((role) => present.has(role))
  }, [questions])

  const toggleType = (typeId: string) => {
    const next = new Set(filterState.activeTypes)
    if (next.has(typeId)) next.delete(typeId)
    else next.add(typeId)
    onChange({ activeTypes: next })
  }

  const toggleAllTypes = () => {
    const all = new Set(questionTypeDefinitions.map(t => t.id))
    onChange({
      activeTypes: filterState.activeTypes.size === all.size
        ? new Set() : all,
    })
  }

  return (
    <>
      {showCompanyPills && (
        <div className={s['company-row']}>
          {companies.map((c) => (
            <button
              className={`${s['company-pill']} ${filterState.activeCompany === c.name ? s.selected : ''}`}
              key={c.name}
              onClick={() => onChange({ activeCompany: filterState.activeCompany === c.name ? 'Все компании' : c.name })}
            >
              <CompanyLogo name={c.name} size={32} />
              <span><b>{c.name}</b><small>{c.count} {questionWord(c.count)}</small></span>
            </button>
          ))}
        </div>
      )}

      <div className={s.filters}>
        <div className={s['filters-row']}>
          {showRole && (
            <FilterDropdown label="Роль" value={filterState.activeRole} onChange={(v) => onChange({ activeRole: v })} options={[
              { value: 'Все роли', label: 'Все роли' },
              ...roles.map((r) => ({ value: r, label: r })),
            ]} />
          )}
          {showTopic && (
            <FilterDropdown label="Тема" value={filterState.activeTopic} onChange={(v) => onChange({ activeTopic: v })} options={[
              { value: 'Все темы', label: 'Все темы' },
              ...topicDefinitions.map((t) => ({ value: t.id, label: t.label })),
            ]} />
          )}
          {showSort && (
            <FilterDropdown label="Сортировка" value={filterState.sortMode} onChange={(v) => onChange({ sortMode: v })} options={[
              { value: 'default', label: 'По частоте' },
              { value: 'frequency-companies', label: 'Чаще в компаниях' },
              { value: 'frequency-videos', label: 'Чаще в видео' },
              { value: 'difficulty-desc', label: 'Сложные' },
              { value: 'difficulty-asc', label: 'Простые' },
              { value: 'company', label: 'По компании' },
              { value: 'title', label: 'По названию' },
            ]} />
          )}
        </div>
        {showTypePills && (
          <div className={s['filters-row']}>
            <div className={s['type-pills']}>
              <span className={s['type-label']}>Тип</span>
              {questionTypeDefinitions.map((t) => (
                <button key={t.id}
                  className={`${s['type-pill']} ${filterState.activeTypes.has(t.id) ? s.active : ''}`}
                  onClick={() => toggleType(t.id)}
                >
                  {t.label}
                </button>
              ))}
              <button className={s['type-pill-select']} onClick={toggleAllTypes}>
                {filterState.activeTypes.size === questionTypeDefinitions.length ? 'Снять все' : 'Все'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
