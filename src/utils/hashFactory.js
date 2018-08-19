const crypto = require('crypto')

function generateHashFrom (something) {
  const secret = 'nodeDHTSecret'
  const hash = crypto.createHmac('sha256', secret).update(something).digest('hex')
  return hash
}

module.exports = {
  generateHashFrom
}
