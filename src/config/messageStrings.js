module.exports = {
  JOIN: 'JOIN', // Entrada na rede (enviado pelo próprio nó quando quiser participar para um nó conhecido da rede)
  JOIN_ACK: 'JOIN_ACK', // Resposta de entrada na rede (Respondido pelo nó da rede que será o nó responsável por checar a posição do novo nó)
  NEW_NODE: 'NEW_NODE', // Enviada para o nó anterior comunicando a entrada de um novo nó
  NODE_GONE: 'NODE_GONE', // Enviada para o predecessor pelo nó que está saindo da rede, para atualizar seu sucesso
  RETRIEVE: 'RETRIEVE', // Enviado para a rede para buscar um par chave/valor
  FOUND: 'FOUND', // Enviado para o nó que fez a busca avisando que o recurso procurado foi encontrado
  NOT_FOUND: 'NOT_FOUND', // Enviado de volta para o nó que fez a busca informando que o recurso buscado não foi encontrado
  TRANSFER: 'TRANSFER', // Pedido de transferência de um recurso da responsabilidade de um nó para outro nó
  TRANSFER_ACK: 'TRANSFER_ACK', // Avisa que uma transferência foi recebida com sucesso e o arquivo pode ser removido da lista de origem
  STORE: 'STORE', // Pedido de armazenamento de um recurso na rede
  LEAVE: 'LEAVE', // Enviada pelo nó ao seu sucessor quando o mesmo vai sair da rede
  LEAVE_ACK: 'LEAVE_ACK' // Enviada pelo nó sucessor ao que enviou a mensagem leave para confirmar a saída
}
