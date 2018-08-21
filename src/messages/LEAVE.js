const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  if (!global.previousNode.ip && !global.nextNode.ip) {
    require('../messages/LEAVE_ACK')()
  }

  outSocket.sendCommandTo(
    params.leavingNode.ip,
    params.leavingNode.port,
    messageCommand.LEAVE_ACK,
    outSocket.createCommandPayload(messageCommand.LEAVE_ACK)()
  )

  // Quando só houver dois nós, se um sair então o outro deve zerar seus nós
  if (params.newPreviousNode.id === global.myId) {
    global.previousNode = { id: null, ip: null, port: null }
    global.nextNode = { id: null, ip: null, port: null }
    return
  }

  global.previousNode = params.newPreviousNode

  outSocket.sendCommandTo(
    params.newPreviousNode.ip,
    params.newPreviousNode.port,
    messageCommand.NODE_GONE,
    outSocket.createCommandPayload(messageCommand.NODE_GONE)()
  )
}
