const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  global.fileList[params.key] = params.value

  // Quando este nó receber o comando transfer, ele deve enviar uma confirmação de que recebeu o arquivo para o nó que o enviou para que este possa remover o arquivo da lista dele
  outSocket.sendCommandTo(
    params.sender.ip,
    params.sender.port,
    messageCommand.TRANSFER_ACK,
    outSocket.createCommandPayload(messageCommand.TRANSFER_ACK)(params.key)
  )
}
