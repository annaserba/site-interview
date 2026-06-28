const VPS_URL = process.env.VPS_URL || 'http://192.144.59.118'
const TOKEN = process.env.BOT_TOKEN

if (!TOKEN) {
  console.error('BOT_TOKEN is required')
  process.exit(1)
}

const API = `https://api.telegram.org/bot${TOKEN}`
let offset = 0

async function tg(method, body = {}) {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

async function askRAG(query) {
  const res = await fetch(`${VPS_URL}/api/rag/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  return res.json()
}

function esc(text) {
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
    await tg('sendMessage', {
      chat_id: chatId,
      text: chunk,
      parse_mode: 'Markdown',
      ...(replyTo ? { reply_to_message_id: replyTo } : {}),
    })
  }
}

async function handleStart(chatId) {
  await sendLong(chatId, `Привет! Я помогаю готовиться к техническим собеседованиям.

Просто напишите вопрос — я найду релевантные ответы из базы.

Примеры:
• _"Как работает быстрая сортировка?"_
• _"Что такое Virtual DOM?"_
• _"Как рассказать о себе на собеседовании?"_

Команды:
/start — приветствие
/help — помощь`)
}

async function handleHelp(chatId) {
  await sendLong(chatId, `*Как пользоваться ботом:*

Напишите вопрос на естественном языке — бот найдёт ответ.

*Примеры:*
• _"расскажи про замыкания"_
• _"как работает event loop"_
• _"что такое Docker"_
• _"как ответить на вопрос о себе"_

*Фильтры:*
• _"react вопросы в Яндекс"_
• _"алгоритмы в Ozon"_`)
}

async function handleMessage(chatId, query, messageId) {
  try {
    await tg('sendChatAction', { chat_id: chatId, action: 'typing' })

    const result = await askRAG(query)

    if (!result.sources || result.sources.length === 0) {
      await sendLong(chatId, `По запросу _"${esc(query)}"_ ничего не найдено. Попробуйте переформулировать.`, messageId)
      return
    }

    const primary = result.sources[0]
    let text = `*${esc(primary.title)}*\n\n`
    text += `*Короткий ответ:*\n${esc(primary.answer)}\n\n`

    if (primary.keyPoints && primary.keyPoints.length > 0) {
      text += `*Как раскрыть:*\n`
      for (const [i, point] of primary.keyPoints.entries()) {
        text += `${i + 1}. *${esc(point.title)}:* ${esc(point.text)}\n`
      }
      text += '\n'
    }

    if (primary.pitfalls && primary.pitfalls.length > 0) {
      text += `*Чего избегать:*\n`
      for (const pit of primary.pitfalls.slice(0, 3)) {
        text += `— ${esc(pit)}\n`
      }
      text += '\n'
    }

    if (primary.companies && primary.companies.length > 0) {
      text += `*Компании:* ${esc(primary.companies.join(', '))}\n`
    }
    if (primary.stage) {
      text += `*Тема:* ${esc(primary.stage)}\n`
    }

    if (result.sources.length > 1) {
      text += `\n*Связанные вопросы:*\n`
      for (const src of result.sources.slice(1, 4)) {
        text += `— ${esc(src.title)}\n`
      }
    }

    await sendLong(chatId, text, messageId)
  } catch (error) {
    console.error('Error:', error.message)
    await sendLong(chatId, 'Произошла ошибка. Попробуйте позже.', messageId)
  }
}

async function poll() {
  try {
    const { result: updates } = await tg('getUpdates', {
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
      } else if (text === '/help') {
        await handleHelp(chatId)
      } else {
        await handleMessage(chatId, text, messageId)
      }
    }
  } catch (error) {
    console.error('Poll error:', error.message, error.cause?.code || '')
    await new Promise((r) => setTimeout(r, 5000))
  }
}

console.log(`Telegram bot starting...`)
console.log(`VPS API: ${VPS_URL}`)
console.log('Bot is running. Press Ctrl+C to stop.')

while (true) {
  await poll()
}
