const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  // Quando só houver dois nós, se um sair então o outro deve zerar seus nós
  if (params.newPreviousNode.id === global.myId) {
    global.previousNode = { id: null, ip: null, port: null }
    global.nextNode = { id: null, ip: null, port: null }
    return
  }

  global.previousNode = params.newPreviousNode

  if (global.previousNode.ip) {
    outSocket.sendCommandTo(
      global.previousNode.ip,
      global.previousNode.port,
      messageCommand.NODE_GONE,
      outSocket.createCommandPayload(messageCommand.NODE_GONE)()
    )
  }
}
