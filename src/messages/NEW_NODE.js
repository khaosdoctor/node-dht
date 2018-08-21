module.exports = (params) => {
  global.nextNode = {
    ip: params.ingressAddress,
    port: params.ingressPort,
    id: params.ingressId
  }
}
