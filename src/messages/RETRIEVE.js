const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
  const keyChecksum = parseInt(params.key, 16)
  const idChecksum = parseInt(global.myId, 16)
  const nextIdChecksum = global.nextNode.id ? parseInt(global.nextNode.id, 16) : 0

  if (Math.abs(keyChecksum - idChecksum) >= Math.abs(nextIdChecksum - idChecksum)) {
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.RETRIEVE,
      outSocket.createCommandPayload(messageCommand.RETRIEVE)(params.key, params.saveLocation, params.sender)
    )
  } else {
    if (!global.fileList[params.key]) {
      // Arquivo não existe no nó
      return outSocket.sendCommandTo(params.sender.ip, params.sender.port, messageCommand.NOT_FOUND, {})
    }

    outSocket.sendCommandTo(
      params.sender.ip,
      params.sender.port,
      messageCommand.FOUND,
      outSocket.createCommandPayload(messageCommand.FOUND)(params.key, global.fileList[params.key], params.saveLocation)
    )
  }
}
