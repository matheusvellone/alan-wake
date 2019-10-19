const wol = require('wol')
const TelegramBot = require('node-telegram-bot-api')
require('dotenv').config()

const { MAC_ADDRESS, TOKEN } = process.env

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

bot.onText(/ping$/i, (msg) => {
  const chatId = msg.chat.id

  await bot.sendMessage(chatId, 'Pong!')
})

bot.onText(/start/, async (msg) => {
  const chatId = msg.chat.id
  
  try {
    console.log('Received message to turn on PC', new Date())
    await wake(MAC_ADDRESS)
    console.log('PC turned on')
    await bot.sendMessage(chatId, 'Turning on PC')
  } catch (error) {
    await bot.sendMessage(chatId, 'Something went wrong')
    await bot.sendMessage(chatId, error.stack)
  }
})
