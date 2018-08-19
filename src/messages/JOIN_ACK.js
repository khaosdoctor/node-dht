module.exports = (params) => {
  console.log('Atualizando lista de nós')
  global.nextNode = params.nextNode
  global.previousNode = params.previousNode
  console.log('Novos nós')
  console.log('next', global.nextNode)
  console.log('previous', global.previousNode)
}
