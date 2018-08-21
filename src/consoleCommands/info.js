const logger = require('knoblr')
module.exports = (params) => {
  logger.info('Printing information')
  console.log(`--- Previous Node Information: `)
  console.log(global.previousNode)
  console.log(`--- Current Node Information:`)
  console.log({ ip: global.ADDRESS, port: global.PORT, id: global.myId })
  console.log(`--- Next Node Information:`)
  console.log(global.nextNode)
  console.log(`--- Current File List:`)
  console.log(global.fileList)
  console.log(`--- Total received messages:`)
  console.log(global.stats)
}
