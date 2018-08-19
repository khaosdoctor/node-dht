const argList = process.argv[2] ? process.argv[2].split(',') : []

const nodeList = argList.map((nodeAddress) => {
  const [address, port] = nodeAddress.split(':')
  return {
    nodeAddress: address,
    nodePort: parseInt(port, 10)
  }
})

require('./src/node').start(nodeList)
