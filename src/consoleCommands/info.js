const logger = require('knoblr')
module.exports = (params) => {
  logger.info(`Previous Node Information: `)
  console.log(global.previousNode)
  logger.info(`Current Node Information:`)
  console.log({ ip: global.ADDRESS, port: global.PORT, id: global.myId })
  logger.info(`Next Node Information:`)
  console.log(global.nextNode)
}
