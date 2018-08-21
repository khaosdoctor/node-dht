const logger = require('knoblr')
const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  if (!global.nextNode.ip && !global.previousNode.ip) {
    process.exit(0)
  }
  if (global.nextNode.ip) {
    let timeout = 0
    // Se existem arquivos nesse nó temos que mandar eles para o nó seguinte
    if (Object.keys(global.fileList).length > 0) {
      // Ajustamos o tempo de saída de acordo com a quantidade de arquivos que temos que responder
      timeout = Object.keys(global.fileList).length * 2000
      logger.info('Transfering files to next node')

      for (let fileHashName in global.fileList) {
        outSocket.sendCommandTo(
          global.nextNode.ip,
          global.nextNode.port,
          messageCommand.TRANSFER,
          outSocket.createCommandPayload(messageCommand.TRANSFER)(fileHashName, global.fileList[fileHashName], {
            ip: global.ADDRESS,
            port: global.PORT,
            id: global.myId
          })
        )
      }
    }

    performExit()
  }
  logger.info(`Disconnecting...`)
}

function performExit () {
  logger.info('File transfer completed. Sending exit message to next node')
  // Envia a mensagem de saída ao próximo nó
  outSocket.sendCommandTo(
    global.nextNode.ip,
    global.nextNode.port,
    messageCommand.LEAVE,
    outSocket.createCommandPayload(messageCommand.LEAVE)(global.previousNode)
  )
}
