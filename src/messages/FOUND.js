const fs = require('fs')
const path = require('path')
const logger = require('knoblr')

module.exports = (params) => {
  const fileContents = Buffer.from(params.value, 'base64')
  logger.info(`Saving file to ${params.saveLocation}`)
  try {
    fs.writeFileSync(path.resolve(params.saveLocation), fileContents)
  } catch (e) {
    logger.error(`Could not save the file: ${e.message}`)
  }
}
