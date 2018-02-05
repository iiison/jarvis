const figlet = require('figlet')
const chalk  = require('chalk')
const clear  = require('clear')
const _      = require('lodash')

process.custom = {
  baseDir : process.argv[1].slice(0, process.argv[1].lastIndexOf('/'))
}

const confs  = require('./bin/commands-conf');

const argv   = require('minimist')(process.argv.slice(2))

clear()

console.log(
  chalk.blue(
    figlet.textSync('J a r v i s', {
      horizontalLayout : 'default',
      font : 'Doh'
    })
  )
)

const command = argv['_']

if (command && command.length > 0) {
  let execute = `${command}${_.capitalize(argv.type)}`

  if ( confs[execute].constructor === Function ) {
    confs[execute](argv)
  } else {
    console.log(chalk.red(`\n \n Command not found!`))
  }
}

