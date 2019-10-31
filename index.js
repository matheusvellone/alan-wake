require('dotenv').config()
const wol = require('wol')
const TelegramBot = require('node-telegram-bot-api')

const { TOKEN } = process.env

const pattern = /MAC_ADDRESS_(\d+)/
const macAddresses = Object.keys(process.env)
  .filter(env => pattern.test(env))
  .map((env) => {
    const [, index] = env.match(pattern)
    const mac = process.env[env]
    const alias = process.env[`ALIAS_${index}`] || mac.toUpperCase()
    const users = process.env[`USER_${index}`]
      ? process.env[`USER_${index}`].split(',')
      : []

    return {
      alias,
      mac,
      users,
    }
  })

const wake = (macAddress) => new Promise((resolve, reject) => {
  wol.wake(macAddress, function (err, res) {
    if (err) {
      reject(err)
    } else {
      resolve(res)
    }
  })
})

const bot = new TelegramBot(TOKEN, { polling: true })

bot.onText(/^ping$/i, async (msg) => {
  const chatId = msg.chat.id

  await bot.sendMessage(chatId, 'Pong!')
})

bot.onText(/^start$/i, async (msg) => {
  const chatId = msg.chat.id
  const user = msg.from.username

  const availableMacs = macAddresses
    .filter((data) => data.users.includes(user))
  
  try {
    if (!availableMacs.length) {
      await bot.sendMessage(chatId, `User "${user}" not allowed in any MAC address`)

      return
    }

    const iKeys = availableMacs
      .map(data => ({
        text: data.alias,
        callback_data: JSON.stringify({
          mac: data.mac,
          alias: data.alias,
          users: data.users,
        }),
      }))

    await bot.sendMessage(
      chatId,
      'Which one?',
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [iKeys],
          remove_keyboard: true,
        },
      }
    )
  } catch (error) {
    await bot.sendMessage(chatId, 'Something went wrong')
    await bot.sendMessage(chatId, error.stack)
  }
})

bot.on('callback_query', async (msg) => {
  const data = JSON.parse(msg.data)
  const messageIdentifier = {
    message_id: msg.message.message_id,
    chat_id: msg.message.chat.id,
  }

  if (!data.users.includes(msg.from.username)) {
    await bot.editMessageReplyMarkup({}, messageIdentifier)
    await bot.editMessageText(`You have no permission to turn ${data.alias} on`, messageIdentifier)

    return
  }

  await wake(data.mac)

  await bot.editMessageReplyMarkup({}, messageIdentifier)
  await bot.editMessageText(`${data.alias} turned on`, messageIdentifier)
})
