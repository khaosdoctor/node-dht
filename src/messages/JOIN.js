const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  // Se o ID dele for maior que o ID do nó ingressante então ele é o sucessor
  // Fazemos a verificação de IP para saber se ele não está sozinho na rede, neste caso obrigatoriamente ele será o sucessor
  if (global.myId >= params.id || !global.previousNode.ip) {
    console.log('recebendo mensagem de JOIN')
    outSocket.sendCommandTo(
      // Envia a mensagem de OK para o nó que enviou o pedido de JOIN com o sucessor e o antecessor
      params.nodeAddress,
      params.nodePort,
      messageCommand.JOIN_ACK,
      outSocket.createCommandPayload(messageCommand.JOIN_ACK)()
    )

    // Checa se ele tem um antecessor (se ele não tiver então ele está sozinho na rede e não tem para quem mandar a mensagem)
    if (global.previousNode.ip) {
      outSocket.sendCommandTo(
        // Envia a mensagem de novo nó na rede para o antecessor
        global.previousNode.ip,
        global.previousNode.port,
        messageCommand.NEW_NODE,
        outSocket.createCommandPayload(messageCommand.NEW_NODE)(params.nodeAddress, params.nodePort, params.id)
      )
    }

    // Se ele não tiver sucessor ele está sozinho na rede
    // Temos que atualizar a lista com ele também
    if (!global.nextNode.ip) {
      global.nextNode = {
        ip: params.nodeAddress,
        port: params.nodePort,
        id: params.id
      }
    }

    global.previousNode = {
      // Atualiza o nó anterior para o novo nó ingressante
      ip: params.nodeAddress,
      port: params.nodePort,
      id: params.id
    }
    console.log('Nó sucessor:', global.nextNode)
    console.log('Nó antecessor', global.previousNode)
  } else {
    console.log('Repassando JOIN para o próximo nó da lista')
    // Se o ID não for maior, então temos que rotear a mensagem para o próximo nó
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.JOIN,
      outSocket.createCommandPayload(messageCommand.JOIN)(params.nodeAddress, params.nodePort)
    )
  }
}
