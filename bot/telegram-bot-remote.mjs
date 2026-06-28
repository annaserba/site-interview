const API_URL = process.env.API_URL || 'http://127.0.0.1:3001'
const TOKEN = process.env.BOT_TOKEN

if (!TOKEN) {
  console.error('BOT_TOKEN is required')
  process.exit(1)
}

const TG_API = `https://api.telegram.org/bot${TOKEN}`
let offset = 0

async function tg(method, body = {}) {
  const res = await fetch(`${TG_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

async function askRAG(query) {
  const res = await fetch(`${API_URL}/api/rag/ask`, {
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

Просто напишите вопрос — я найду ответ.

Примеры:
• _"Как работает быстрая сортировка?"_
• _"Что такое Virtual DOM?"_
• _"Как рассказать о себе на собеседовании?"_

Команды:
/start — приветствие
/help — помощь`)
}

async function handleHelp(chatId) {
  await sendLong(chatId, `*Как пользоваться:*

Напишите вопрос — бот найдёт ответ.

*Примеры:*
• _"расскажи про замыкания"_
• _"как работает event loop"_
• _"что такое Docker"_

*Фильтры:*
• _"react вопросы в Яндекс"_`)
}

async function handleMessage(chatId, query, messageId) {
  try {
    await tg('sendChatAction', { chat_id: chatId, action: 'typing' })

    const result = await askRAG(query)

    if (!result.sources || result.sources.length === 0) {
      await sendLong(chatId, `По запросу _"${esc(query)}"_ ничего не найдено.`, messageId)
      return
    }

    const primary = result.sources[0]
    let text = `*${esc(primary.title)}*\n\n`
    text += `*Ответ:*\n${esc(primary.answer)}\n\n`

    if (primary.keyPoints && primary.keyPoints.length > 0) {
      text += `*Как раскрыть:*\n`
      for (const [i, point] of primary.keyPoints.entries()) {
        text += `${i + 1}. *${esc(point.title)}:* ${esc(point.text)}\n`
      }
      text += '\n'
    }

    if (primary.pitfalls && primary.pitfalls.length > 0) {
      text += `*Ловушки:*\n`
      for (const pit of primary.pitfalls.slice(0, 3)) {
        text += `— ${esc(pit)}\n`
      }
      text += '\n'
    }

    if (primary.companies && primary.companies.length > 0) {
      text += `*Компании:* ${esc(primary.companies.join(', '))}\n`
    }

    if (result.sources.length > 1) {
      text += `\n*Связанные:*\n`
      for (const src of result.sources.slice(1, 4)) {
        text += `— ${esc(src.title)}\n`
      }
    }

    await sendLong(chatId, text, messageId)
  } catch (error) {
    console.error('Error:', error.message)
    await sendLong(chatId, 'Ошибка. Попробуйте позже.', messageId)
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

console.log(`Bot starting... API: ${API_URL}`)

while (true) {
  await poll()
}
