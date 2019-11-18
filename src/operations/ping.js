const bot = require('../bot')

module.exports = async (msg) => {
  const chatId = msg.chat.id

  await bot.sendMessage(chatId, 'Pong!')
}