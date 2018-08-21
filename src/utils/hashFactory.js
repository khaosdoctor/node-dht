const crypto = require('crypto')

function generateHashFrom (something) {
  const secret = 'nodeDHTSecret'
  const hash = crypto.createHmac('sha256', secret).update(something).digest('hex')
  return hash
}

function encodeBase64 (value) {
  return Buffer.from(value, 'utf-8').toString('base64')
}

function decodeBase64 (base64String) {
  return Buffer.from(base64String, 'base64').toString()
}

module.exports = {
  generateHashFrom,
  encodeBase64,
  decodeBase64
}
