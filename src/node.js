const hashMaker = require('./utils/hashFactory')
const outSocket = require('./utils/socketClient')
const inSocket = require('./utils/socketServer')
const logger = require('knoblr')

const fileList = {} // Vai armazenar a lista de arquivos deste nó no formato de dicionário chave/valor
const myId = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff // ID deste nó (por padrão começa sempre com o maior hexa possível)
const nextNode = { ip: null, port: null } // Informações do próximo nó
const previousNode = { ip: null, port: null } // Informações do nó anterior

// Trata saídas bruscas jogando para um evento conhecido
process.on('SIGINT', () => process.exit(34))

const stdIn = process.openStdin()
stdIn.addListener('data', (input) => {})

// Evento conhecido de saída
process.on('exit', (code) => {
  // Desconecta da rede com sucesso
})
