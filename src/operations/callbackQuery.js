const wol = require('wol')
const bot = require('../bot')
const dynamodb = require('../dynamodb')

const { BROADCAST_IP } = process.env

const wake = macAddress => new Promise((resolve, reject) => {
  wol.wake(
    macAddress,
    { address: BROADCAST_IP },
    (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    }
  )
})

module.exports = async (msg) => {
  const mac = msg.data

  const { Items: [target] } = await dynamodb.query({
    TableName: 'alan-wake',
    KeyConditionExpression: '#mac = :mac',
    ExpressionAttributeNames: {
      '#mac': 'mac',
    },
    ExpressionAttributeValues: {
      ':mac': mac,
    },
  }).promise()

  const messageIdentifier = {
    message_id: msg.message.message_id,
    chat_id: msg.message.chat.id,
  }

  if (!target) {
    await bot.editMessageReplyMarkup({}, messageIdentifier)
    await bot.editMessageText(`This PC is no longer available`, messageIdentifier)

    return
  }

  const user = msg.from.username
  const isAllowed = target.users.includes(user)

  if (!isAllowed) {
    await bot.editMessageReplyMarkup({}, messageIdentifier)
    await bot.editMessageText(`You don't have permission to turn it on`, messageIdentifier)

    return
  }

  await wake(mac)

  await bot.editMessageReplyMarkup({}, messageIdentifier)
  await bot.editMessageText(`${target.alias} turned on`, messageIdentifier)
}
