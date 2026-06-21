import test from 'node:test'
import assert from 'node:assert/strict'
import { answerQuestion, loadQuestions, retrieve } from './rag-core.mjs'

const cases = [
  ['Как лучше рассказать о себе и опыте?', 'universal-tell-about-yourself'],
  ['Как реализовать конкурентность и rate limiter в Go?', 'ozon-api-rate-limiter'],
  ['Как кешировать большую ленту в React?', 'avito-feed-cache'],
  ['Почему тормозит ETL пайплайн Kafka?', 'tbank-etl-degradation'],
  ['Как спроектировать отложенную очередь задач с приоритетом?', 'yandex-priority-queue'],
  ['Как проверить палиндром двумя указателями без дополнительной памяти?', 'yandex-palindrome-two-pointers'],
  ['Как асинхронно найти маршрут между городами через Promise API?', 'yandex-async-flight-route'],
  ['Почему shift и spread внутри цикла дают квадратичную сложность?', 'yandex-js-hidden-quadratic-complexity'],
  ['Что такое Event Loop?', 'frontend-event-loop-concept'],
  ['В каком порядке выполнятся Promise и setTimeout?', 'frontend-event-loop-order'],
  ['Что такое замыкание?', 'frontend-closure'],
  ['Чем cookie отличается от localStorage?', 'frontend-browser-storage'],
  ['Что такое Generics в TypeScript?', 'frontend-typescript-generics'],
  ['Какие вопросы задать работодателю?', 'universal-candidate-questions'],
  ['Что такое доверительный интервал?', 'data-confidence-interval'],
  ['Как правильно провести A/B тест?', 'data-ab-tests-experience'],
  ['Когда нужен Airflow?', 'data-airflow-use-cases'],
  ['Как построить продуктовую воронку?', 'data-funnel'],
  ['Как сформировать пирамиду метрик?', 'data-metric-pyramid'],
  ['Чем loc отличается от iloc?', 'data-pandas-loc-iloc'],
  ['Где минимум суммы квадратов отклонений?', 'data-least-squares-mean'],
  ['Что такое ROC-AUC?', 'ds-roc-auc'],
  ['Какие метрики регрессии использовать?', 'ds-regression-metrics'],
  ['Чем XGBoost отличается от LightGBM и CatBoost?', 'ds-boosting-libraries'],
  ['Что такое F1 score?', 'ds-f1-score'],
  ['Что такое переобучение модели?', 'ds-overfitting'],
  ['Что такое декоратор Python?', 'ds-python-decorator'],
  ['Что такое Random Forest?', 'ds-random-forest'],
  ['Что такое MAPE?', 'ds-mape'],
  ['В каких случаях предпочтительнее использовать MAE?', 'ds-when-mae'],
  ['В чем разница TPR и FPR?', 'ds-tpr-fpr'],
  ['Зачем глубокие деревья в случайном лесе?', 'ds-random-forest-deep-trees'],
  ['Сложность получения значения по ключу в словаре', 'ds-dictionary-lookup-complexity'],
  ['Какая модель даст отрицательный прогноз при положительном target?', 'ds-positive-target-negative-prediction'],
  ['Расскажите про самую сложную задачу', 'universal-hardest-project'],
  ['Как браузер строит DOM CSSOM и рисует страницу?', 'wildberries-critical-rendering-path'],
  ['Чем отличаются reflow repaint и compositing?', 'wildberries-rendering-performance'],
  ['Чем async отличается от defer у script?', 'wildberries-script-loading'],
  ['Как работает HTTP кеширование через ETag?', 'wildberries-http-frontend'],
  ['Когда выбрать WebSocket, SSE или polling?', 'wildberries-websocket-sse'],
  ['Как выбрать frontend-фреймворк для нового проекта?', 'wildberries-framework-choice'],
  ['Реализуйте минимальный аналог jQuery с chaining', 'wildberries-jquery-clone'],
  ['Почему вы выбрали фронтенд, а не бэкенд?', 'okko-frontend-motivation'],
  ['Что для вас важно в рабочих задачах?', 'okko-task-values'],
  ['Что для вас важно в руководителе?', 'okko-lead-expectations'],
  ['Каким рабочим достижением вы гордитесь?', 'okko-proud-achievement'],
  ['Что делать, если коллеги оспаривают ваше решение?', 'okko-handle-disagreement'],
  ['Расскажите о профессиональном провале', 'okko-failure-story'],
  ['Как работать в условиях жесткого дедлайна?', 'okko-hard-deadline'],
  ['Как относитесь к legacy коду?', 'okko-legacy-attitude'],
  ['Как вы вели фичу от идеи до релиза?', 'okko-feature-leadership'],
  ['Что делать с критичным багом прямо перед релизом?', 'okko-release-critical-bug'],
  ['По каким критериям выбираете место работы?', 'okko-company-choice'],
  ['Что делать, когда для задачи недостаточно требований?', 'okko-unclear-requirements'],
  ['Какое улучшение вы внедрили в команде?', 'okko-process-improvement'],
  ['Как выглядит качественно подготовленная задача?', 'okko-ideal-ticket'],
  ['В чем заключался опыт менторства младших коллег?', 'okko-mentoring'],
  ['За что отвечает разработчик в спринте?', 'okko-sprint-responsibility'],
  ['Что делать, если задача заблокирована смежной командой?', 'okko-cross-team-blocker'],
  ['Как найти блокировку главного потока браузера?', 'sber-main-thread-blocking'],
  ['Как использовать npm библиотеку из Go сервиса?', 'sber-js-library-from-go'],
  ['Какие проблемы есть у Feature Sliced Design?', 'sber-fsd-tradeoffs'],
  ['Как масштабировать frontend в Kubernetes?', 'sber-kubernetes-frontend-scale'],
  ['Что такое execution context и this?', 'okko-js-execution-context'],
  ['Оберните callback API в Promise с retry', 'okko-promisify-retry'],
  ['Реализуйте debounce и throttle', 'okko-throttle-debounce'],
  ['Когда оправдан свой фреймворк на Web Components?', 'goznak-web-components-framework'],
  ['Как реализовать Promise без встроенного Promise?', 'goznak-promise-from-scratch'],
  ['Как Proxy влияет на производительность?', 'goznak-proxy-performance'],
  ['Как считается специфичность CSS селекторов?', 'goznak-css-specificity'],
  ['Как работают z-index и stacking context?', 'goznak-stacking-context'],
  ['Как работают DOM события и удаление обработчиков?', 'goznak-dom-events'],
  ['Как работает Intersection Observer?', 'goznak-intersection-observer'],
  ['Как шарить состояние между микрофронтендами?', 'frontend-microfrontend-shared-state'],
  ['Когда проекту нужен Next.js?', 'frontend-when-nextjs'],
  ['Как работает сборщик мусора JavaScript?', 'frontend-js-garbage-collector'],
  ['Как искать утечки памяти JavaScript?', 'frontend-js-memory-leaks'],
  ['Что хранится в стеке и куче JavaScript?', 'frontend-js-stack-heap'],
  ['Какие правила использования React hooks?', 'frontend-react-hooks-rules'],
  ['Когда использовать React memo useMemo useCallback?', 'frontend-react-memoization'],
  ['Что выведет код с замыканиями и затенением переменных?', 'okko-closure-console-output'],
  ['Как делать задачу без описания и с неполными требованиями?', 'okko-unclear-requirements'],
  ['Сталкивались ли вы с непониманием и конфликтами?', 'okko-handle-disagreement'],
  ['Команда матерится по рабочим вопросам, что делать?', 'universal-team-profanity'],
]

for (const [query, expectedId] of cases) {
  test(`retrieves ${expectedId}`, async () => {
    const [result] = await retrieve(query)
    assert.equal(result?.id, expectedId)
  })
}

test('local answer is structured and cites only relevant sources', async () => {
  const result = await answerQuestion('Как рассказать о себе на интервью?')
  assert.equal(result.mode, 'local')
  assert.match(result.answer, /Короткий ответ/)
  assert.match(result.answer, /Как раскрыть ответ/)
  assert.equal(result.sources[0]?.id, 'universal-tell-about-yourself')
})

test('video frequency counts unique YouTube videos only', async () => {
  const questions = await loadQuestions()
  const tellAboutYourself = questions.find((question) => question.id === 'universal-tell-about-yourself')
  const varLetConst = questions.find((question) => question.id === 'frontend-var-let-const')

  assert.equal(tellAboutYourself?.videoFrequency, 4)
  assert.equal(tellAboutYourself?.sources.filter((source) => source.type === 'youtube').length, 4)
  assert.equal(varLetConst?.videoFrequency, 1)
  assert.ok(varLetConst?.sources.some((source) => source.type === 'aggregated'))
})
