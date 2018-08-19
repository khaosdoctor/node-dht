const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  if (global.myId >= params.id) {
    outSocket.sendCommandTo(
      // Envia a mensagem de OK para o nó que enviou o pedido de JOIN com o sucessor e o antecessor
      params.nodeAddress,
      params.nodePort,
      messageCommand.JOIN_ACK,
      outSocket.createCommandPayload(messageCommand.JOIN_ACK)()
    )

    outSocket.sendCommandTo(
      // Envia a mensagem de novo nó na rede para o antecessor
      global.previousNode.ip,
      global.previousNode.port,
      messageCommand.NEW_NODE,
      outSocket.createCommandPayload(messageCommand.NEW_NODE)(params.nodeAddress, params.nodePort, params.id)
    )

    global.previousNode = {
      // Atualiza o nó anterior
      ip: params.nodeAddress,
      port: params.nodePort,
      id: params.id
    }
  }
}
