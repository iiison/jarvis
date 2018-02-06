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
      const flowPath = `${process.custom.baseDir}/flows`

      if (!fs.existsSync(flowPath)) {
        mkpath.sync(flowPath)
      }

      fs.writeFile(`${flowPath}/${answers.flowName}`, answers.flowSteps)

      console.log(chalk.green(`\n 🤓  Saved a new flow with name ${answers.flowName}.`))
    })
}

module.exports = {
  saveFlow
}

