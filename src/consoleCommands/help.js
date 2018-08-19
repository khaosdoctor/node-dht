module.exports = (params) => {
  console.log('-- DHT --')
  console.log('Available commands:')
  console.log(`
  -> leave: Leaves the network and closes the node
  -> retrieve <fileName> <storageLocation>: Retrieves <fileName> from the network and stores at <storageLocation>
  -> store <fileName> <fileContent>: Stores <fileContent> as <fileName> in the network
  -> help: Shows this
  `)
}
