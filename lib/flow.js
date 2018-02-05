const fs       = require('fs')
const path     = require('path')
const chalk    = require('chalk')
const mkpath   = require('mkpath')
const relative = require('relative')

const prompt           = require('./flowPrompt')
const flagQuestionsMap = require('../configs/flag-question-map')

function saveFlow() {
  console.log(chalk.green('🍻  Creating New Flow:'))

 prompt
  .askNewFlowQuestion()
    .then(answers => {
      console.log(chalk.red('******************************'))
      console.log(chalk.red(answers))
      console.log(chalk.red('******************************'))
    })
}

module.exports = {
  saveFlow
}

