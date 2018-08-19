const logger = require('knoblr')
const getRandomInt = require('./src/utils/getRandomInt')
const messages = require('./src/config/messageStrings')
const net = require('net')

const server = net.createServer()
server.listen(process.argv[2], '127.0.0.1', () =>
  logger.info(`Server listening on ${server.address().address}:${server.address().port}`)
)

server.on('connection', (socket) => {
  logger.info(`The client ${socket.remoteAddress}:${socket.remotePort} has connected to this server`)

  socket.on('data', (data) => {
    logger.info(`Received data from ${socket.remoteAddress}:${socket.remotePort}: "${data}"`)
    socket.write(messages.ACK)
  })

  socket.on('close', (data) => {
    logger.warn(`The client ${socket.remoteAddress}:${socket.remotePort} has disconnected from this server`)
  })
})

const stdin = process.openStdin()
stdin.addListener('data', (data) => {
  if (data.length <= 1) return logger.info('Empty data not sent')
  const message = require('./src/utils/hashFactory').generateHashFrom(data.toString().replace(/\n$/, ''))
  require('./src/utils/socketClient').sendMessageTo('127.0.0.1', 4567, message)
})
