import { test } from 'node:test'
import assert from 'node:assert/strict'
import { evaluateAnswer, evaluateDesignSession } from './evaluate-answer.mjs'

const question = {
  id: 'test-question',
  title: 'Что такое контекст в React?',
  answer: 'Context — механизм React для передачи данных через дерево компонентов без явной прокидки пропсов. Создаётся через createContext, читается через useContext.',
  exampleAnswer: 'Context — способ пробросить данные вниз по дереву минуя промежуточные компоненты. Создаю createContext, оборачиваю поддерево в Provider, читаю через useContext. Использую для темы и текущего пользователя. Мемоизирую value через useMemo, чтобы не вызывать лишние ре-рендеры потребителей.',
  context: 'Context решает проблему prop drilling, но это не замена стейт-менеджеру.',
  keyPoints: [
    { title: 'API', text: 'createContext, Provider, useContext, значение по умолчанию' },
    { title: 'Подводные камни', text: 'ре-рендер потребителей при новом value, мемоизация через useMemo' },
    { title: 'Когда использовать', text: 'тема, локаль, текущий пользователь, конфигурация' },
  ],
}

test('strong answer gets yes verdict with high score', () => {
  const result = evaluateAnswer(question, question.exampleAnswer)
  assert.equal(result.verdict, 'yes')
  assert.ok(result.score >= 60, `score ${result.score} should be >= 60`)
  assert.ok(result.coveredPoints.length >= 2)
})

test('partial answer gets partial or lower verdict', () => {
  const result = evaluateAnswer(question, 'Context это способ передавать данные без пропсов.')
  assert.ok(['partial', 'no'].includes(result.verdict))
  assert.ok(result.score < 60)
})

test('irrelevant answer gets no verdict', () => {
  const result = evaluateAnswer(question, 'Я люблю готовить борщ по выходным и гулять с собакой в парке.')
  assert.equal(result.verdict, 'no')
  assert.ok(result.score < 35)
})

test('too short answer is rejected without scoring', () => {
  const result = evaluateAnswer(question, 'Не знаю')
  assert.equal(result.score, 0)
  assert.equal(result.verdict, 'no')
  assert.ok(result.missedPoints.length === question.keyPoints.length)
})

test('question without keyPoints still evaluates', () => {
  const bare = { ...question, keyPoints: [] }
  const result = evaluateAnswer(bare, bare.exampleAnswer)
  assert.ok(['yes', 'partial'].includes(result.verdict))
  assert.deepEqual(result.coveredPoints, [])
})

test('feedback always mentions what to add for weak answers', () => {
  const result = evaluateAnswer(question, 'Ну это хук такой в реакте.')
  assert.ok(result.feedback.length > 0)
})

// ─── evaluateDesignSession ───

test('design session with full transcript gets yes verdict', () => {
  const result = evaluateDesignSession(question, [
    { title: 'Требования', question, answer: question.exampleAnswer },
    { title: 'Масштаб', question, answer: question.exampleAnswer },
  ])
  assert.equal(result.verdict, 'yes')
  assert.ok(result.score >= 60, `score ${result.score} should be >= 60`)
  assert.equal(result.stages.length, 2)
  assert.ok(result.stages.every((stage) => stage.verdict === 'yes'))
})

test('design session without answers returns zero score', () => {
  const result = evaluateDesignSession(question, [
    { title: 'Требования', question, answer: '' },
    { title: 'Масштаб', question, answer: '   ' },
  ])
  assert.equal(result.score, 0)
  assert.equal(result.verdict, 'no')
  assert.equal(result.feedback, 'Нет ответов для оценки.')
  assert.deepEqual(result.stages, [])
})

test('design session falls back to case question when stage question is missing', () => {
  const result = evaluateDesignSession(question, [
    { title: 'Требования', answer: question.exampleAnswer },
  ])
  assert.equal(result.stages.length, 1)
  assert.equal(result.stages[0].verdict, 'yes')
})

test('weak off-topic session gets no verdict', () => {
  const result = evaluateDesignSession(question, [
    { title: 'Требования', question, answer: 'Я люблю готовить борщ по выходным и гулять с собакой в парке. Вчера видел интересный фильм про космос и динозавров.' },
    { title: 'Масштаб', question, answer: 'Мой кот очень любит спать на клавиатуре, когда я пытаюсь работать из дома по утрам.' },
  ])
  assert.equal(result.verdict, 'no')
  assert.ok(result.score < 35, `score ${result.score} should be < 35`)
})
