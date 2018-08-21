const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const hashMaker = require('../utils/hashFactory')
const logger = require('knoblr')
const path = require('path')
const fs = require('fs')

module.exports = (params) => {
  const [key, saveLocation] = params
  const searchKey = hashMaker.generateHashFrom(key)
  const resolvedLocation = path.resolve(saveLocation)

  if (global.fileList[searchKey]) return saveFileToDisk(searchKey, resolvedLocation)

  if (global.nextNode.ip) {
    return outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.RETRIEVE,
      outSocket.createCommandPayload(messageCommand.RETRIEVE)(searchKey, resolvedLocation, {
        ip: global.ADDRESS,
        port: global.PORT,
        id: global.myId
      })
    )
  }

  // Se só houver ele na rede
  saveFileToDisk()
}

function saveFileToDisk (searchKey, saveLocation) {
  if (!global.fileList[searchKey]) return logger.error(`Could not find searched file`)

  logger.info('File exists locally. Saving...')
  const fileContents = Buffer.from(global.fileList[searchKey], 'base64')
  fs.writeFileSync(saveLocation, fileContents)
  logger.info(`File saved at '${saveLocation}'`)
}
