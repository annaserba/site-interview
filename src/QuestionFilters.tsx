import { useMemo } from 'react'
import { FilterDropdown } from './FilterDropdown'
import { questionTypeDefinitions, companyOrder, topicDefinitions } from './filters'
import type { Question } from './types'
import s from './App.module.css'

const companyStyles: Record<string, { mark: string; color: string }> = {
  'Яндекс': { mark: 'Я', color: '#FFCC00' },
  Ozon: { mark: 'O', color: '#005BFF' },
  Avito: { mark: 'A', color: '#00AAFF' },
  'Т-Банк': { mark: 'Т', color: '#FFDD2D' },
  VK: { mark: 'VK', color: '#0077FF' },
  Wildberries: { mark: 'WB', color: '#EC238D' },
  Okko: { mark: 'О', color: '#4B0A9A' },
  Сбер: { mark: 'С', color: '#21A038' },
  Гознак: { mark: 'Г', color: '#003366' },
  'Лига Ставок': { mark: 'Л', color: '#FF6600' },
  'IT One': { mark: 'IT', color: '#E53935' },
  Rutube: { mark: 'R', color: '#000000' },
  Usetech: { mark: 'Ut', color: '#1E88E5' },
}

const companyStyle = (c: string) => companyStyles[c] || { mark: c.slice(0, 1), color: '#c9ff32' }
const qWord = (n: number) => n % 10 === 1 && n % 100 !== 11 ? 'вопрос' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'вопроса' : 'вопросов'

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
    count: questions.filter((q) => q.companies.includes(name)).length,
    ...companyStyle(name),
  })).filter((c) => c.count > 0), [questions])

  const roles = useMemo(() =>
    [...new Set(questions.flatMap((q) => q.roles))].sort((a, b) => a.localeCompare(b, 'ru')),
    [questions])

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
              <span className="company-logo" style={{ background: c.color }}>{c.mark}</span>
              <span><b>{c.name}</b><small>{c.count} {qWord(c.count)}</small></span>
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
