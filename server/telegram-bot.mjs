import { answerQuestion, retrieve, loadQuestions } from './rag-core.mjs'

const TOKEN = process.env.BOT_TOKEN
if (!TOKEN) {
  console.error('BOT_TOKEN is required')
  process.exit(1)
}

const API = `https://api.telegram.org/bot${TOKEN}`
let offset = 0

async function api(method, body = {}) {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

function escapeMd(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/\[/g, '\\[')
    .replace(/]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/>/g, '\\>')
    .replace(/#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\./g, '\\.')
    .replace(/!/g, '\\!')
}

async function sendLong(chatId, text, replyTo) {
  const maxLen = 4096
  for (let i = 0; i < text.length; i += maxLen) {
    const chunk = text.slice(i, i + maxLen)
    await api('sendMessage', {
      chat_id: chatId,
      text: chunk,
      parse_mode: 'Markdown',
      ...(replyTo ? { reply_to_message_id: replyTo } : {}),
    })
  }
}

async function handleStart(chatId) {
  const questions = await loadQuestions()
  const count = questions.length
  const companies = [...new Set(questions.flatMap((q) => q.companies))].filter(Boolean).length

  await sendLong(chatId, `Привет! Я помогаю готовиться к техническим собеседованиям в российские IT-компании.

У меня в базе *${count} вопросов* из *${companies} компаний*: Яндекс, Ozon, Avito, Т-Банк, VK и других.

Просто напишите вопрос — я найду релевантные ответы.

Примеры:
• Алгоритмы: _"Как работает быстрая сортировка?"_
• Фронтенд: _"Что такое Virtual DOM?"_
• Системный дизайн: _"Спроектируй систему уведомлений"_
• Карьера: _"Как рассказать о себе на собеседовании?"_

Команды:
/start — приветствие
/list — список вопросов по темам
/help — помощь`)
}

async function handleList(chatId) {
  const questions = await loadQuestions()
  const byStage = {}
  for (const q of questions) {
    const stage = q.stage || 'Другое'
    if (!byStage[stage]) byStage[stage] = []
    byStage[stage].push(q)
  }

  let text = '*Вопросы по темам:*\n\n'
  for (const [stage, qs] of Object.entries(byStage)) {
    text += `*${escapeMd(stage)}* (${qs.length})\n`
    for (const q of qs.slice(0, 5)) {
      text += `  • ${escapeMd(q.title)}\n`
    }
    if (qs.length > 5) {
      text += `  _...и ещё ${qs.length - 5}_\n`
    }
    text += '\n'
  }
  await sendLong(chatId, text)
}

async function handleHelp(chatId) {
  await sendLong(chatId, `*Как пользоваться ботом:*

Просто напишите вопрос на естественном языке — бот найдёт релевантные ответы из базы вопросов для собеседований.

*Примеры запросов:*
• _"расскажи про замыкания"_
• _"как работает event loop"_
• _"что такое Docker"_
• _"как проходит системное проектирование"_
• _"как ответить на вопрос о себе"_

*Фильтры:*
Можно уточнить поиск, указав компанию или тему:
• _"react вопросы в Яндекс"_
• _"алгоритмы в Ozon"_

*Команды:*
/start — приветствие
/list — все вопросы по темам
/help — эта справка`)
}

async function handleQuestion(chatId, query, messageId) {
  try {
    const result = await answerQuestion(query)

    if (!result.sources || result.sources.length === 0) {
      await sendLong(chatId, `По запросу _"${escapeMd(query)}"_ ничего не найдено. Попробуйте переформулировать.`, messageId)
      return
    }

    const primary = result.sources[0]
    let text = `*${escapeMd(primary.title)}*\n\n`
    text += `*Короткий ответ:*\n${escapeMd(primary.answer)}\n\n`

    if (primary.keyPoints && primary.keyPoints.length > 0) {
      text += `*Как раскрыть:*\n`
      for (const [i, point] of primary.keyPoints.entries()) {
        text += `${i + 1}. *${escapeMd(point.title)}:* ${escapeMd(point.text)}\n`
      }
      text += '\n'
    }

    if (primary.pitfalls && primary.pitfalls.length > 0) {
      text += `*Чего избегать:*\n`
      for (const pit of primary.pitfalls.slice(0, 3)) {
        text += `— ${escapeMd(pit)}\n`
      }
      text += '\n'
    }

    if (primary.companies && primary.companies.length > 0) {
      text += `*Компании:* ${escapeMd(primary.companies.join(', '))}\n`
    }
    if (primary.stage) {
      text += `*Тема:* ${escapeMd(primary.stage)}\n`
    }

    if (result.sources.length > 1) {
      text += `\n*Связанные вопросы:*\n`
      for (const src of result.sources.slice(1, 4)) {
        text += `— ${escapeMd(src.title)}\n`
      }
    }

    await sendLong(chatId, text, messageId)
  } catch (error) {
    console.error('Error:', error)
    await sendLong(chatId, 'Произошла ошибка при обработке запроса. Попробуйте позже.', messageId)
  }
}

async function poll() {
  try {
    const { result: updates } = await api('getUpdates', {
      offset,
      timeout: 30,
      allowed_updates: ['message'],
    })

    if (!updates) return

    for (const update of updates) {
      offset = update.update_id + 1
      const msg = update.message
      if (!msg || !msg.text) continue

      const chatId = msg.chat.id
      const text = msg.text.trim()
      const messageId = msg.message_id

      console.log(`[${new Date().toISOString()}] @${msg.from?.username || msg.from?.id}: ${text}`)

      if (text === '/start') {
        await handleStart(chatId)
      } else if (text === '/list') {
        await handleList(chatId)
      } else if (text === '/help') {
        await handleHelp(chatId)
      } else {
        await handleQuestion(chatId, text, messageId)
      }
    }
  } catch (error) {
    console.error('Poll error:', error.message, error.cause?.code || '')
    await new Promise((r) => setTimeout(r, 5000))
  }
}

console.log('Telegram bot starting...')
console.log(`Loading questions...`)
const questions = await loadQuestions()
console.log(`Loaded ${questions.length} questions`)
console.log('Bot is running. Press Ctrl+C to stop.')

while (true) {
  await poll()
}
