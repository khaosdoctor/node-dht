const logger = require('knoblr')
const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  if (!global.nextNode.ip && !global.previousNode.ip) {
    process.exit(0)
  }
  if (global.nextNode.ip) {
    logger.info('Sending exit message to next node')
    // Envia a mensagem de saída ao próximo nó
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.LEAVE,
      outSocket.createCommandPayload(messageCommand.LEAVE)(global.previousNode)
    )
  }
  logger.info(`Disconnecting...`)
}
