require('dotenv').config()

const bot = require('./bot')

const {
  ping,
  start,
  callbackQuery,
} = require('./operations')

bot.onText(/^ping$/i, ping)

bot.onText(/^start$/i, start)

bot.on('callback_query', callbackQuery)
