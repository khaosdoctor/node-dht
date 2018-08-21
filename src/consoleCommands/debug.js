module.exports = (params) => {
  global.DEBUG = !global.DEBUG // Liga ou desliga o modo debug
  require('knoblr').info(`Debug mode is ${global.DEBUG ? 'on' : 'off'}`)
}
