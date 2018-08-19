const net = require('net')
const getRandomInt = require('./getRandomInt')
const messages = require('../config/messageStrings')

/**
 * Cria e retorna o servidor TCP
 */
function createServer () {
  return net.createServer()
}

/**
 * Atrela um evento a um socket com uma função de tratamento
 * @param {{socket: Socket, event: string, handler: function}} options Objeto de configuração
 * @returns {Socket} O socket enviado
 */
function bindEventToSocket (options) {
  const { socket, event, handler } = options
  return socket.on(event, handler)
}
