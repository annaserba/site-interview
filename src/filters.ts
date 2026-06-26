import type { Question } from './types'

export const questionTypeDefinitions = [
  { id: 'technical', label: 'Технические' },
  { id: 'behavioral', label: 'Поведенческие' },
  { id: 'system-design', label: 'Системный дизайн' },
  { id: 'management', label: 'Управление' },
  { id: 'hr', label: 'HR' },
  { id: 'game-dev', label: 'Game Dev' },
]

export const companyOrder = ['Яндекс', 'Ozon', 'Avito', 'Т-Банк', 'VK', 'Wildberries', 'Okko', 'Сбер', 'Гознак', 'Лига Ставок', 'IT One', 'Usetech', 'Rutube']

export function getQuestionType(item: Question): string {
  const cat = item.category
  if (item.tags.includes('HR')) return 'hr'
  if (cat === 'Game Development') return 'game-dev'
  if (item.tags.includes('Management') || item.stage === 'Управление') return 'management'
  if (cat === 'System Design' || cat === 'Web Architecture' || cat === 'Frontend Architecture') return 'system-design'
  if (cat === 'Behavioral') return 'behavioral'
  return 'technical'
}
