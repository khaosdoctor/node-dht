module.exports = (params) => {
  // Se recebeu um Ack de que o arquivo de transferência foi recebido do outro lado, então pode deletar ele da lista
  delete global.fileList[params.key]
}
