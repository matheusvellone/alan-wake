const bot = require('../bot')
const macAddresses = require('../../MACs.json')

module.exports = async (msg) => {
  const chatId = msg.chat.id
  const user = msg.from.username

  const availableMacs = macAddresses
    .filter((data) => data.users.includes(user))

  if (!availableMacs.length) {
    await bot.sendMessage(chatId, `User "${user}" not allowed in any MAC address`)

    return
  }
  
  try {
    const iKeys = availableMacs
      .map(data => ({
        text: data.alias,
        callback_data: data.mac,
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
    console.log(error.response.body)
    // await bot.sendMessage(chatId, 'Something went wrong')
    // await bot.sendMessage(chatId, error.stack)
  }
}