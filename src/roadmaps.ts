import type { Question } from './types'

export interface RoadmapTopic {
  id: string
  title: string
  terms: string[]
  categories?: string[]
}

export interface RoadmapStep {
  id: string
  title: string
  description: string
  topics: RoadmapTopic[]
}

export interface Roadmap {
  id: string
  group: string
  label: string
  description: string
  steps: RoadmapStep[]
}

const topic = (id: string, title: string, terms: string[], categories?: string[]): RoadmapTopic => ({ id, title, terms, categories })
const step = (id: string, title: string, description: string, topics: RoadmapTopic[]): RoadmapStep => ({ id, title, description, topics })

const JS_BASE_TOPICS = [
  topic('js-core', 'Синтаксис и устройство JS', ['javascript', 'замыкан', 'контекст', '=this', 'функци', '=var', '=let', '=const', 'event loop', '=map', '=set', 'weakmap'], ['JavaScript']),
  topic('js-async', 'Асинхронность', ['промис', 'promise', 'async', 'await', 'event loop', 'микрозадач', 'макрозадач', 'асинхрон']),
  topic('ts', 'TypeScript', ['typescript', 'type guard', 'generics', 'дженерик', 'типизац'], ['TypeScript']),
]

const BROWSER_TOPICS = [
  topic('net', 'HTTP и сеть', ['http', 'https', 'cdn', 'websocket', '=rest', 'cors', 'статус-код', 'заголовк']),
  topic('browser-render', 'Рендеринг и загрузка страницы', ['reflow', 'repaint', 'composit', 'рендер', 'загрузк', 'script', 'async', 'defer', 'critical rendering'], ['Browser']),
  topic('browser-storage-security', 'Хранилища и безопасность', ['cookie', 'localstorage', 'sessionstorage', 'хранилищ', 'xss', 'csrf', 'csp', 'iframe', 'clickjacking']),
]

const QUALITY_TOPICS = [
  topic('testing', 'Тестирование', ['тест', 'tdd', 'e2e', 'mock', 'покрыти', 'coverage', 'flaky']),
  topic('code-quality', 'Качество кода и процессы', ['eslint', 'prettier', 'качеств', 'code review', 'пайплайн']),
  topic('cicd', 'CI/CD и деплой', ['ci/cd', 'деплой', 'deploy', 'github actions', 'gitlab ci', 'docker', 'kubernetes', 'k8s', 'сборк']),
]

const SOFT_TOPICS = [
  topic('self-presentation', 'Самопрезентация и подготовка', ['собеседован', 'самопрезентац', 'подготовк', 'расскажите о себе', 'фидбэк'], ['Behavioral']),
]

const PATTERNS_TOPIC = topic('patterns', 'Паттерны проектирования', ['паттерн', 'solid', 'проектирован'])

const BACKEND_NET_TOPICS = [
  topic('net-api', 'HTTP, REST и WebSocket', ['http', '=rest', 'websocket', '=api', 'grpc', 'статус-код', 'идемпотент']),
  topic('security', 'Безопасность', ['аутентификац', 'авторизац', 'xss', 'csrf', 'sql injection', 'rate limit', 'хеширован', 'секрет']),
]

const BACKEND_DATA_TOPICS = [
  topic('db', 'Базы данных', ['sql', 'баз', 'database', 'индекс', 'транзакц', 'шардирован', 'репликац', 'partitioning', 'storage']),
  topic('cache-mq', 'Кеш и очереди', ['кеш', 'cache', 'redis', 'kafka', 'очеред', 'message queue', 'брокер']),
]

const BACKEND_DISTRIBUTED_TOPICS = [
  topic('ds-fundamentals', 'Фундамент распределённых систем', ['=cap', 'consensus', 'согласованност', 'consistency', 'leader election', 'vector clock', 'gossip'], ['System Design']),
  topic('ds-resilience', 'Надёжность', ['circuit breaker', 'saga', 'graceful degradation', 'resilience', 'backpressure', 'идемпотент', 'slo', 'sla', 'мониторинг', 'observability']),
]

const backendRoadmap = (id: string, label: string, description: string, langTopic: RoadmapTopic): Roadmap => ({
  id,
  group: 'Backend',
  label,
  description,
  steps: [
    step('lang', 'Шаг 1. Язык и платформа', 'Основной язык, его рантайм и экосистема.', [langTopic, PATTERNS_TOPIC]),
    step('net', 'Шаг 2. Сеть и API', 'Как сервисы общаются.', BACKEND_NET_TOPICS),
    step('data', 'Шаг 3. Данные', 'Хранение и обработка.', BACKEND_DATA_TOPICS),
    step('distributed', 'Шаг 4. Распределённые системы', 'Масштабирование и надёжность.', BACKEND_DISTRIBUTED_TOPICS),
    step('quality', 'Шаг 5. Тестирование и качество', 'Как держать код под контролем.', QUALITY_TOPICS),
    step('soft', 'Шаг 6. Собеседование', 'Soft skills и самопрезентация.', SOFT_TOPICS),
  ],
})

const frameworkStep = (id: string, title: string, topics: RoadmapTopic[]) =>
  step(id, title, 'Модель рендеринга фреймворка, его API и экосистема.', topics)

export const roadmaps: Roadmap[] = [
  {
    id: 'frontend-react',
    group: 'Frontend',
    label: 'React',
    description: 'Путь фронтенд-разработчика на React: от базы платформы до архитектуры.',
    steps: [
      step('base', 'Шаг 1. База JavaScript и TypeScript', 'Фундамент, который спрашивают на любом фронтенд-собеседовании.', JS_BASE_TOPICS),
      step('browser', 'Шаг 2. Браузер и сеть', 'Как работает платформа: сеть, рендеринг, хранилища, безопасность.', BROWSER_TOPICS),
      frameworkStep('react', 'Шаг 3. React', [
        topic('react-core', 'Компоненты и хуки', ['react', 'хук', 'hook', 'useeffect', 'usestate', 'usememo', 'useref', 'useid', 'компонент', 'virtual dom', 'reconciliation'], ['React']),
        topic('react-state', 'Управление состоянием', ['redux', 'zustand', 'mobx', 'effector', 'стейт', '=state', 'контекст в react', 'prop drilling']),
        topic('react-forms-patterns', 'Формы и паттерны', ['форм', 'controlled', 'uncontrolled', 'hoc', 'render props', 'паттерн', 'suspense', 'lazy']),
      ]),
      step('perf', 'Шаг 4. Производительность', 'Оптимизация рендеринга и бандла.', [
        topic('react-perf', 'Оптимизация React', ['мемоиз', 'memo', 'рендер', 'batching', 'concurrent', 'виртуализац', 'bundle', 'бандл', 'web vitals']),
      ]),
      step('arch', 'Шаг 5. Архитектура', 'Структура приложения и системный дизайн.', [
        topic('frontend-arch', 'Архитектура фронтенда', ['микрофронтенд', 'module federation', 'fsd', 'feature-sliced', 'ssr', 'next.js', 'архитектур'], ['Frontend Architecture']),
      ]),
      step('quality', 'Шаг 6. Тестирование и качество', 'Как держать код под контролем.', QUALITY_TOPICS),
      step('soft', 'Шаг 7. Собеседование', 'Soft skills и самопрезентация.', SOFT_TOPICS),
    ],
  },
  {
    id: 'frontend-angular',
    group: 'Frontend',
    label: 'Angular',
    description: 'Путь фронтенд-разработчика на Angular: платформа JS, затем фреймворк и RxJS.',
    steps: [
      step('base', 'Шаг 1. База JavaScript и TypeScript', 'Angular требует уверенного TypeScript.', JS_BASE_TOPICS),
      step('browser', 'Шаг 2. Браузер и сеть', 'Платформа общая для всех фреймворков.', BROWSER_TOPICS),
      frameworkStep('angular', 'Шаг 3. Angular', [
        topic('angular-core', 'Angular и Change Detection', ['angular', 'change detection', 'rxjs', 'single-spa', 'zone']),
        topic('framework-compare', 'Сравнение фреймворков', ['react и angular', 'отличие между react и angular', 'angular и чем отличается']),
      ]),
      step('arch', 'Шаг 4. Архитектура', 'Микрофронтенды и структура приложения.', [
        topic('frontend-arch', 'Архитектура фронтенда', ['микрофронтенд', 'module federation', 'single-spa', 'архитектур'], ['Frontend Architecture']),
      ]),
      step('quality', 'Шаг 5. Тестирование и качество', 'Как держать код под контролем.', QUALITY_TOPICS),
      step('soft', 'Шаг 6. Собеседование', 'Soft skills и самопрезентация.', SOFT_TOPICS),
    ],
  },
  {
    id: 'frontend-vue',
    group: 'Frontend',
    label: 'Vue',
    description: 'Путь фронтенд-разработчика на Vue: общая платформа и специфика фреймворка.',
    steps: [
      step('base', 'Шаг 1. База JavaScript и TypeScript', 'Фундамент, который спрашивают на любом фронтенд-собеседовании.', JS_BASE_TOPICS),
      step('browser', 'Шаг 2. Браузер и сеть', 'Платформа общая для всех фреймворков.', BROWSER_TOPICS),
      frameworkStep('vue', 'Шаг 3. Vue', [
        topic('vue-core', 'Vue и реактивность', ['vue', 'vuex', 'pinia', 'nuxt', 'composition api']),
      ]),
      step('arch', 'Шаг 4. Архитектура', 'Структура приложения и системный дизайн.', [
        topic('frontend-arch', 'Архитектура фронтенда', ['микрофронтенд', 'ssr', 'nuxt', 'архитектур'], ['Frontend Architecture']),
      ]),
      step('quality', 'Шаг 5. Тестирование и качество', 'Как держать код под контролем.', QUALITY_TOPICS),
      step('soft', 'Шаг 6. Собеседование', 'Soft skills и самопрезентация.', SOFT_TOPICS),
    ],
  },
  backendRoadmap(
    'backend-nodejs',
    'Node.js',
    'Путь бэкенд-разработчика на Node.js: рантайм JS, сеть, данные и распределённые системы.',
    topic('lang-core', 'Node.js и TypeScript', ['node', 'javascript', 'typescript', 'event loop', 'npm', 'express', 'nest'], ['JavaScript', 'TypeScript']),
  ),
  backendRoadmap(
    'backend-python',
    'Python',
    'Путь бэкенд-разработчика на Python: язык и фреймворки, данные и распределённые системы.',
    topic('lang-core', 'Python и фреймворки', ['python', 'django', 'fastapi', 'flask', 'asyncio', 'корутин', '=gil', '!kotlin']),
  ),
  backendRoadmap(
    'backend-java',
    'Java / Kotlin',
    'Путь бэкенд-разработчика на JVM: язык, многопоточность, данные и распределённые системы.',
    topic('lang-core', 'Java, Kotlin и JVM', ['=java', 'kotlin', 'spring', 'jvm', 'поток', 'многопоточ', 'сборщик мусора', '!javascript', '!браузер']),
  ),
  backendRoadmap(
    'backend-go',
    'Go',
    'Путь бэкенд-разработчика на Go: язык и конкурентность, данные и распределённые системы.',
    topic('lang-core', 'Go и конкурентность', ['golang', 'горутин', 'goroutine', 'канал', '!javascript']),
  ),
  {
    id: 'data-ml',
    group: 'Данные и ML',
    label: 'Data / ML',
    description: 'Путь в данные: SQL и статистика, классический ML, LLM и аналитика.',
    steps: [
      step('base-data', 'Шаг 1. Инструменты данных', 'SQL, Python и работа с датасетами.', [
        topic('sql-python', 'SQL и Python', ['sql', 'python', 'pandas', 'loc', 'iloc', 'etl', 'airflow', 'очистк данн'], ['Data Engineering']),
      ]),
      step('stats', 'Шаг 2. Математика и статистика', 'База для ML и экспериментов.', [
        topic('math', 'Математика для ML', ['линейная алгебра', 'calculus', 'оптимизац', 'теория вероятност', 'статистик', 'information theory'], ['Statistics']),
        topic('experiment', 'Эксперименты и метрики', ['a/b', 'p-value', 'доверительн', 'гипотез', 'метрик', 'воронк', 'когорт', 'nps'], ['Product Analytics', 'Statistics']),
      ]),
      step('ml', 'Шаг 3. Классический ML', 'Модели и их оценка.', [
        topic('ml-core', 'Модели и метрики', ['random forest', 'бустинг', 'регресси', 'классификац', 'precision', 'recall', 'f1', 'roc', 'mse', 'mae', 'переобучен', 'регуляризац'], ['Machine Learning']),
      ]),
      step('llm', 'Шаг 4. LLM и GenAI', 'Современные генеративные технологии.', [
        topic('llm-core', 'LLM и RAG', ['llm', 'transformer', 'gpt', 'embedding', '=rag', 'fine-tun', 'prompt', 'hallucination', 'агент']),
      ]),
      step('soft', 'Шаг 5. Собеседование', 'Soft skills и самопрезентация.', SOFT_TOPICS),
    ],
  },
  {
    id: 'system-design',
    group: 'Архитектура',
    label: 'System Design',
    description: 'Путь к уверенному системному дизайну: от теории к практике проектирования.',
    steps: [
      step('sd-base', 'Шаг 1. Фундамент', 'Ключевые теоремы и модели.', [
        topic('sd-theory', 'Теория распределённых систем', ['=cap', 'consensus', 'согласованност', 'consistency', 'leader election', 'vector clock', 'crdt', 'gossip'], ['System Design']),
      ]),
      step('sd-scale', 'Шаг 2. Масштабирование', 'Как растить систему.', [
        topic('sd-scaling', 'Шардирование и балансировка', ['шардирован', 'partitioning', 'репликац', 'replication', 'балансиров', 'load balancing', 'consistent hashing', 'кеш', 'cdn', 'очеред', 'kafka', 'stream']),
      ]),
      step('sd-reliability', 'Шаг 3. Надёжность', 'Отказоустойчивость и наблюдаемость.', [
        topic('sd-reliability', 'Надёжность и observability', ['circuit breaker', 'saga', 'resilience', 'graceful degradation', 'идемпотент', 'backpressure', 'мониторинг', 'observability', 'slo', 'disaster recovery', 'инцидент']),
      ]),
      step('sd-practice', 'Шаг 4. Практика проектирования', 'Задачи в формате «спроектируйте систему».', [
        topic('sd-cases', 'Дизайн-сессии', ['спроектируйте', 'проектирование системы', 'поисковая система', 'система уведомлений', 'rate limiter', 'chat system', 'inventory', 'кеш для продукта']),
      ]),
      step('soft', 'Шаг 5. Собеседование', 'Как вести дизайн-сессию.', SOFT_TOPICS),
    ],
  },
  {
    id: 'arch-frontend',
    group: 'Архитектура',
    label: 'Frontend',
    description: 'Архитектура фронтенда: рендеринг, микрофронтенды, SSR и дизайн-системы.',
    steps: [
      step('render', 'Шаг 1. Рендеринг и производительность', 'Как браузер рисует страницу и где теряются миллисекунды.', [
        topic('arch-fe-render', 'Рендеринг браузера', ['reflow', 'repaint', 'composit', 'рендер', 'critical rendering', 'web vitals', 'загрузк'], ['Browser']),
      ]),
      step('microfrontend', 'Шаг 2. Микрофронтенды и сборка', 'Независимые команды и независимые релизы.', [
        topic('arch-fe-micro', 'Микрофронтенды', ['микрофронтенд', 'module federation', 'single-spa', 'fsd', 'feature-sliced', 'архитектур'], ['Frontend Architecture']),
        topic('arch-fe-bundlers', 'Сборка и бандлинг', ['бандл', 'bundle', 'vite', 'webpack', 'tree shaking', 'code splitting', 'сборк']),
      ]),
      step('ssr', 'Шаг 3. SSR и метафреймворки', 'Серверный рендеринг и гибридные подходы.', [
        topic('arch-fe-ssr', 'SSR и гидратация', ['ssr', 'next.js', 'nuxt', 'гидратац', 'hydration', 'streaming', 'серверный рендеринг']),
      ]),
      step('design-system', 'Шаг 4. Дизайн-системы', 'Единый UI при нескольких командах и версиях.', [
        topic('arch-fe-ds', 'Дизайн-системы и CSS-архитектура', ['дизайн-систем', 'дизайн систем', 'специфичност', 'css', 'токен', 'конфликт стилей', 'кросс-браузерн'], ['CSS']),
      ]),
      step('quality', 'Шаг 5. Тестирование и качество', 'Как держать код под контролем.', QUALITY_TOPICS),
    ],
  },
  {
    id: 'arch-backend',
    group: 'Архитектура',
    label: 'Backend',
    description: 'Архитектура бэкенда: API, данные, надёжность и инфраструктура.',
    steps: [
      step('api', 'Шаг 1. API и контракты', 'Как сервисы договариваются друг с другом.', [
        topic('arch-be-api', 'Проектирование API', ['=rest', 'grpc', '=api', 'идемпотент', 'версионирован', 'websocket', 'статус-код']),
      ]),
      step('data-scale', 'Шаг 2. Данные и масштабирование', 'Рост нагрузки без потери данных.', [
        topic('arch-be-data', 'Масштабирование данных', ['шардирован', 'partitioning', 'репликац', 'replication', 'индекс', 'транзакц', 'consistent hashing', 'кеш', 'очеред', 'kafka']),
      ]),
      step('reliability', 'Шаг 3. Надёжность', 'Отказоустойчивость и наблюдаемость.', [
        topic('arch-be-resilience', 'Отказоустойчивость', ['circuit breaker', 'saga', 'resilience', 'graceful degradation', 'backpressure', 'мониторинг', 'observability', 'slo', 'инцидент']),
      ]),
      step('infra', 'Шаг 4. Инфраструктура и CI/CD', 'Как код попадает в прод и живёт там.', [
        topic('arch-be-infra', 'CI/CD и инфраструктура', ['ci/cd', 'деплой', 'deploy', 'docker', 'kubernetes', 'k8s', 'github actions', 'gitlab ci', 'нагрузочн', 'облак', 'пайплайн']),
      ]),
      step('quality', 'Шаг 5. Тестирование и качество', 'Как держать код под контролем.', QUALITY_TOPICS),
    ],
  },
  {
    id: 'arch-ml',
    group: 'Архитектура',
    label: 'ML / LLM',
    description: 'Архитектура ML-систем: LLM, RAG и MLOps.',
    steps: [
      step('llm-arch', 'Шаг 1. Архитектура LLM', 'Как устроены современные языковые модели.', [
        topic('arch-ml-llm', 'Трансформеры и LLM', ['transformer', 'attention', 'llm', 'gpt', 'токениз', 'контекстное окно', 'hallucination']),
      ]),
      step('rag', 'Шаг 2. RAG и поиск', 'Как подключить модель к данным компании.', [
        topic('arch-ml-rag', 'RAG и embeddings', ['=rag', 'embedding', 'векторн', 'поиск похожих', 'chunking', 'rerank']),
      ]),
      step('mlops', 'Шаг 3. MLOps', 'Жизненный цикл модели в проде.', [
        topic('arch-ml-mlops', 'MLOps и эксплуатация', ['mlops', 'fine-tun', 'датасет', 'переобучен', 'drift', 'мониторинг', 'деплой', 'a/b'], ['Statistics']),
      ]),
      step('metrics', 'Шаг 4. Метрики и эксперименты', 'Как понять, что система работает.', [
        topic('arch-ml-metrics', 'Метрики качества', ['precision', 'recall', 'f1', 'roc', 'метрик', 'p-value', 'гипотез'], ['Statistics', 'Experimentation']),
      ]),
      step('quality', 'Шаг 5. Тестирование и качество', 'Как держать код под контролем.', QUALITY_TOPICS),
    ],
  },
  {
    id: 'management',
    group: 'Управление',
    label: 'Management',
    description: 'Путь тимлида: команда, процессы, развитие людей и коммуникация.',
    steps: [
      step('team', 'Шаг 1. Команда', 'Найм, онбординг и формирование.', [
        topic('mgmt-hiring', 'Найм и онбординг', ['найм', 'hiring', 'интервью для найма', 'онбординг', 'формирован команд', 'подбира']),
        topic('mgmt-growth', 'Развитие и менторство', ['ментор', '1:1', '1on1', 'развити', 'рост', 'мотивац', 'junior', 'senior']),
      ]),
      step('process', 'Шаг 2. Процессы', 'Доставка результата и качество.', [
        topic('mgmt-process', 'Delivery и процессы', ['спринт', 'retro', 'delivery', 'code review', 'техдолг', 'техническим долгом', 'roadmap', 'полным циклом', 'релиз', 'инцидент', 'риск']),
      ]),
      step('communication', 'Шаг 3. Коммуникация', 'Стейкхолдеры и конфликты.', [
        topic('mgmt-communication', 'Коммуникация и конфликты', ['стейкхолдер', 'stakeholder', 'конфликт', 'кросс-функциональн', 'делегир', 'коммуникац']),
      ]),
      step('soft', 'Шаг 4. Личная эффективность', 'Самопрезентация и лидерство.', SOFT_TOPICS),
    ],
  },
]

export const roadmapGroups = [...new Set(roadmaps.map((r) => r.group))]

const wordMatch = (text: string, term: string) => {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<![a-zа-яё0-9])${escaped}(?![a-zа-яё0-9])`).test(text)
}

export function matchTopicQuestions(topicDef: RoadmapTopic, questions: Question[]): Question[] {
  return questions.filter((q) => {
    if (topicDef.categories && q.category && topicDef.categories.includes(q.category)) return true
    const text = [q.title, ...(q.aliases || []), ...(q.tags || [])].join(' ').toLocaleLowerCase('ru-RU')
    return topicDef.terms.some((term) => {
      const t = term.toLocaleLowerCase('ru-RU')
      // Термин с префиксом '=' — точное совпадение слова (чтобы 'java' не ловил 'javascript', 'go' — 'category')
      if (t.startsWith('=')) return wordMatch(text, t.slice(1))
      return text.includes(t)
    }) && !topicDef.terms.some((term) => {
      // Термин с префиксом '!' — исключение (вопрос не должен содержать слово)
      const t = term.toLocaleLowerCase('ru-RU')
      return t.startsWith('!') && text.includes(t.slice(1))
    })
  })
}

export function countStepQuestions(stepDef: RoadmapStep, questions: Question[]): number {
  const ids = new Set<string>()
  for (const t of stepDef.topics) for (const q of matchTopicQuestions(t, questions)) ids.add(q.id)
  return ids.size
}
