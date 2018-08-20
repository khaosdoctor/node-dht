const logger = require('knoblr')
const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  // Envia a mensagem de saída ao próximo nó
  outSocket.sendCommandTo(
    global.nextNode.ip,
    global.nextNode.port,
    messageCommand.LEAVE,
    outSocket.createCommandPayload(messageCommand.LEAVE)(global.previousNode)
  )
  logger.info(`You have been disconnected from the DHT`)
  logger.info(`Exiting... Bye!`)
  process.exit(0)
}
