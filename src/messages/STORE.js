const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  const keyChecksum = parseInt(params.key, 16)
  const idChecksum = parseInt(global.myId, 16)
  const nextIdChecksum = global.nextNode.id ? parseInt(global.nextNode.id, 16) : 0

  // Se a diferença entre o id deste nó (em termos absolutos) for menor que a diferença entre a chave e o próximo id
  // Então este é o mais próximo dos nós
  if (Math.abs(idChecksum - keyChecksum) <= Math.abs(nextIdChecksum - keyChecksum)) {
    global.fileList[params.key] = params.value
  } else {
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.STORE,
      outSocket.createCommandPayload(messageCommand.STORE)(params.key, params.value)
    )
  }
}
