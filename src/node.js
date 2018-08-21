const hashMaker = require('./utils/hashFactory')
const commandMessages = require('./config/messageStrings')
const inSocket = require('./utils/socketServer')
const outSocket = require('./utils/socketClient')
const logger = require('knoblr')

// Propriedades do nó
global.ADDRESS = '127.0.0.1'
global.PORT = inSocket.getPort() // Porta atual que o nó está ouvindo
global.fileList = {} // Vai armazenar a lista de arquivos deste nó no formato de dicionário chave/valor
global.myId = hashMaker.generateHashFrom(`${global.PORT}:${global.ADDRESS}`) // ID deste nó
global.nextNode = { ip: null, port: null, id: null } // Informações do próximo nó
global.previousNode = { ip: null, port: null, id: null } // Informações do nó anterior

/**
 * Tenta se conectar ao primeiro nó conhecido da rede
 * @param {{nodeAddress: string, nodePort: number}[]} nodeList Lista de nós conhecidos da rede
 */
function connectToDHT (nodeList) {
  if (nodeList.length <= 0) {
    logger.info(`Nenhum nó encontrado, criando uma nova rede`) // Não há nós, então ele é o primeiro nó da DHT
    global.myId = hashMaker.generateHashFrom(
      (0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff).toString(16)
    )
    return setUpUser()
  }

  const handleConnectionError = (err) => {
    logger.error(
      `Erro ao enviar mensagem para o nó ${nodeToConnect.nodeAddress}:${nodeToConnect.nodePort}, enviando para o próximo nó`
    )
    connectToDHT(nodeList) // Chama a função novamente com o elemento a menos
  }

  const nodeToConnect = nodeList.shift() // Remove o primeiro elemento e retorna
  outSocket.sendCommandTo(
    nodeToConnect.nodeAddress,
    nodeToConnect.nodePort,
    commandMessages.JOIN,
    outSocket.createCommandPayload(commandMessages.JOIN)(global.ADDRESS, global.PORT),
    handleConnectionError
  )
  setTimeout(setUpUser, 1500)
}

// Trata saídas bruscas jogando para um evento conhecido
function setUpExitProtocol () {
  process.on('SIGINT', () => process.exit(34)) // 34 é um código arbitrário que definimos como uma saída brusca
  // Evento conhecido de saída
  process.on('exit', (code) => {
    console.log() // Nova linha pelo ctrl+c

    if (code === 34) {
      logger.info('Detecting exit')
      require('./consoleCommands/leave')() // Roda o comando de saída
    }
  })
}

/**
 * Cria a conexão local para receber mensagens
 */
function setUpLocalTCPServer () {
  // Cria o servidor do socket TCP deste nó
  const server = inSocket.createServer()
  server.listen(PORT, ADDRESS, () =>
    logger.info(`Server listening on ${server.address().address}:${server.address().port}`)
  )

  server.on('connection', (socket) => {
    // Abre a porta para recebimento de mensagens TCP
    // logger.info(`The client ${socket.remoteAddress}:${socket.remotePort} connected to this server`)

    socket.on('data', (data) => {
      // Evento de handling de mensagens que chegam
      const message = JSON.parse(data.toString())
      require(`./messages/${message.commandString}`)(message.commandParams)
    })

    socket.on('close', () => {
      // Quando um cliente desconecta deste socket
      // logger.info(`The client ${socket.remoteAddress}:${socket.remotePort} disconnected from this server`)
    })
  })
}

/**
 * Mostra a mensagem de inicio
 */
function printWelcomeMessage () {
  console.log(`-- You're now connected to the DHT as ${global.myId} --`)
  console.log(`Type 'help' to see the list of available commands.`)
  process.stdout.write('> ')
}

/**
 * Prepara a STDIN para receber mensagens
 */
function openStdIn () {
  // Abre o standard input para interação do usuário com o sistema
  const stdIn = process.openStdin()
  stdIn.addListener('data', (input) => {
    const inStr = input.toString().replace(/\n$/, '')
    if (inStr.length >= 1) {
      const [commandString, ...params] = inStr.split(' ')
      switch (commandString) {
        case 'store':
        case 'retrieve':
        case 'help':
        case 'leave':
        case 'info':
          require(`./consoleCommands/${commandString}`)(params)
          break
        default:
          logger.error(`This command is not recognized, type 'help' for a list of available commands`)
          break
      }
    }
    process.stdout.write('> ')
  })
}

/**
 * Agrupa funções que deixam o console utilizável para os usuários
 */
function setUpUser () {
  setUpExitProtocol()
  printWelcomeMessage()
  openStdIn()
}

/**
 * Ponto de entrada
 * @param {{nodePort: number, nodeAddress: string}[]} nodeList Lista de nós conhecidos da rede
 */
function start (nodeList) {
  try {
    setUpLocalTCPServer()
    connectToDHT(nodeList)
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = { start }
