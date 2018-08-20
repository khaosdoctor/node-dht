module.exports = (params) => {
  // Quando só houver dois nós, se um sair então o outro deve zerar seus nós
  if (params.nextId === global.myId) {
    global.previousNode = { id: null, ip: null, port: null }
    global.nextNode = { id: null, ip: null, port: null }
    return
  }

  global.nextNode = {
    id: params.nextId,
    ip: params.nextIp,
    port: params.nextPort
  }
}
