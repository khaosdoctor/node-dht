module.exports = (params) => {
  global.nextNode = {
    ip: params.ingressAddress,
    port: params.ingressPort,
    id: params.ingressId
  }
  console.log('Recebido NEW_NODE, novo nó seguinte é:', global.nextNode)
}
