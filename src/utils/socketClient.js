const net = require('net')

function sendMessageTo (address, port, message) {
  const client = new net.Socket()

  client.on('error', (err) => {
    throw err
  })

  client.connect(port, address)
  client.write(message)
  client.end()
}

module.exports = {
  sendMessageTo
}
