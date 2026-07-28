export const questionTypeDefinitions = [
  { id: 'technical', label: 'Технические' },
  { id: 'behavioral', label: 'Поведенческие' },
  { id: 'system-design', label: 'Системный дизайн' },
  { id: 'management', label: 'Управление' },
  { id: 'hr', label: 'HR' },
  { id: 'game-dev', label: 'Game Dev' },
]

export const topicDefinitions = [
  { id: 'frontend', label: 'Frontend', categories: ['JavaScript', 'TypeScript', 'React', 'CSS', 'Browser', 'Frontend Architecture'], terms: ['frontend', 'browser', 'react', 'css'] },
  { id: 'backend', label: 'Backend', categories: ['Backend'], terms: ['backend', 'java', 'kotlin', 'python', 'concurrency', 'go', 'c++'] },
  { id: 'data-ml', label: 'Данные и ML', categories: ['Machine Learning', 'Statistics', 'Data Engineering', 'Product Analytics'], terms: ['machine learning', 'statistics', 'data ', 'analytics', 'sql', 'метрик'] },
  { id: 'arch', label: 'Архитектура', categories: ['System Design', 'Frontend Architecture'], terms: ['system design', 'architecture'] },
  { id: 'algorithms', label: 'Алгоритмы', categories: ['Algorithms'], terms: ['algorithm', 'алгоритм', 'complexity', 'сложность', 'data structures'] },
  { id: 'delivery', label: 'Процессы', categories: ['Delivery'], terms: ['delivery'] },
  { id: 'gamedev', label: 'Game Dev', categories: ['Game Development'], terms: ['unreal', 'game'] },
]

export const roleOrder = ['Frontend', 'Backend', 'Fullstack', 'Mobile', 'QA', 'DevOps', 'Data Engineering', 'Data Science', 'Product Analytics', 'Leadership', 'Game Dev']

export const companyOrder = ['Яндекс', 'Ozon', 'Avito', 'Т-Банк', 'VK', 'Wildberries', 'Okko', 'Сбер', 'Гознак', 'Лига Ставок', 'IT One', 'Usetech', 'Rutube']

export function getQuestionType(item: { tags?: string[]; category: string | null; stage?: string | null }): string {
  const tags = item.tags || []
  const cat = item.category || ''
  if (tags.includes('HR')) return 'hr'
  if (cat === 'Game Development') return 'game-dev'
  if (tags.includes('Management') || item.stage === 'Управление') return 'management'
  if (cat === 'System Design' || cat === 'Frontend Architecture') return 'system-design'
  if (cat === 'Behavioral') return 'behavioral'
  return 'technical'
}
