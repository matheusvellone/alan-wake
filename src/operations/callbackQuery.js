const wol = require('wol')
const bot = require('../bot')
const macAddresses = require('../../MACs.json')

const wake = macAddress => new Promise((resolve, reject) => {
  wol.wake(macAddress, function (err, res) {
    if (err) {
      reject(err)
    } else {
      resolve(res)
    }
  })
})

module.exports = async (msg) => {
  const mac = msg.data
  const user = msg.from.username

  const target = macAddresses
    .find(data => data.mac === mac && data.users.includes(user))

  const messageIdentifier = {
    message_id: msg.message.message_id,
    chat_id: msg.message.chat.id,
  }

  if (!target) {
    await bot.editMessageReplyMarkup({}, messageIdentifier)
    await bot.editMessageText(`You don't have permission to turn it on`, messageIdentifier)

    return
  }

  await wake(mac)

  await bot.editMessageReplyMarkup({}, messageIdentifier)
  await bot.editMessageText(`${target.alias} turned on`, messageIdentifier)
}