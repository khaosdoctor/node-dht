const net = require('net')
const getRandomInt = require('./getRandomInt')

/**
 * Cria e retorna o servidor TCP
 */
function createServer () {
  return net.createServer()
}

function getPort () {
  return getRandomInt(3000, 65000)
}

module.exports = {
  createServer,
  getPort
}
