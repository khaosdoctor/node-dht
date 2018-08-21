const logger = require('knoblr')

module.exports = (params) => {
  logger.info(`You have been disconnected from the DHT`)
  logger.info(`Exiting... Bye!`)
  process.exit(0)
}
