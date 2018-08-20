const net = require('net')
const commandMessages = require('../config/messageStrings')
const { generateHashFrom } = require('./hashFactory')

/**
 * Converte mensagens em objetos para buffers para podermos enviar como binário
 * @param {string|Object} message Mensagem a ser convertida
 */
function _convert (message) {
  let innerMessage = null

  switch (typeof innerMessage) {
    case 'string':
      innerMessage = message.replace(/\n$/, '')
      break
    case 'object':
      innerMessage = Buffer.from(JSON.stringify(message))
      break
    default:
      innerMessage = Buffer.from(message)
      break
  }

  return innerMessage
}

function handleError (err) {
  throw err
}

/**
 *
 * @param {string} address Endereço do destinatário
 * @param {number} port Porta do destinatário
 * @param {string} command String do comando
 * @param {*} params Parâmetros do comando
 */
function sendCommandTo (address, port, command, params, errorCb = handleError) {
  const fullCommand = {
    commandString: command,
    commandParams: params
  }
  sendMessageTo(address, port, fullCommand, errorCb)
}

/**
 * Cria os dados que serão enviados com o comando para padronização
 * @param {string} command String do comando
 */
function createCommandPayload (command) {
  switch (command) {
    case commandMessages.JOIN:
      return (address, port) => ({
        nodeAddress: address,
        nodePort: parseInt(port, 10),
        id: global.myId
      })
    case commandMessages.JOIN_ACK:
      return () => ({
        previousNode: {
          port: global.previousNode.port || global.PORT,
          ip: global.previousNode.ip || global.ADDRESS,
          id: global.previousNode.id || global.myId
        },
        nextNode: {
          port: global.PORT,
          ip: global.ADDRESS,
          id: global.myId
        }
      })
    case commandMessages.NEW_NODE:
      return (ingressAddress, ingressPort, ingressId) => ({
        ingressAddress,
        ingressPort,
        ingressId
      })
    case commandMessages.LEAVE:
      return (newPreviousNode) => ({
        leavingNode: {
          ip: global.ADDRESS,
          port: global.PORT,
          id: global.myId
        },
        newPreviousNode
      })
    case commandMessages.NODE_GONE:
      return () => ({
        nextIp: global.ADDRESS,
        nextPort: global.PORT,
        nextId: global.myId
      })
  }
}

/**
 * Envia uma mensagem a um nó
 * @param {string} address Endereço do destinatário
 * @param {number} port Porta do destinarátio
 * @param {string|Buffer} message Mensagem a ser enviada
 */
function sendMessageTo (address, port, message, errorCb) {
  const client = new net.Socket()
  let innerMessage = _convert(message)

  client.on('error', errorCb)

  client.connect(port, address)
  client.write(innerMessage)
  client.end()
}

module.exports = {
  sendMessageTo,
  sendCommandTo,
  createCommandPayload
}
