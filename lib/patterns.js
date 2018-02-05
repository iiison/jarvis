const fs       = require('fs')
const path     = require('path')
const chalk    = require('chalk')
const mkpath   = require('mkpath')
const relative = require('relative')

const prompt           = require('./patternPrompt')
const flagQuestionsMap = require('../configs/flag-question-map')

function savePattern(args) {
  console.log(chalk.green('🍻  Generating new pattern:'))

  prompt
    .askNewPatternQuestion()
    .then (answers => {
      const pattern = fs.readFileSync(answers.patternAddress, 'utf8')

      fs.writeFile(`${process.custom.baseDir}/patterns/${answers.patternName}`, pattern)
      console.log(chalk.green(`\n 🤓  Saved a new pattern with name ${answers.patternName}.`))
    })
}

function generatePattern() {
  console.log(chalk.green('🗂  Adding new file:'))

  prompt
    .generatePattern()
    .then (answers => {
      let fileDir = answers.fileAddress.replace(/\/$/, '')

      fileDir += '/'

      if (!fs.existsSync(fileDir)) {
        mkpath.sync(fileDir)
      }

      const pattern = fs.readFileSync(`${process.custom.baseDir}/patterns/${answers.patternName}`, 'utf8')

      fs.writeFile(`${fileDir}${answers.fileName}`, pattern)

      if (answers.updateIndexFile) {
        let relativePathToIndex = relative(answers.indexPath, `${fileDir}${answers.fileName}`)

        relativePathToIndex = /^\W/.test(relativePathToIndex)
          ? `./${relativePathToIndex}`
          : relativePathToIndex

        const content = `import ${answers.fileName} from '${relativePathToIndex}'`

        const indexContent = fs.readFileSync(answers.indexPath, 'utf8')
        const updatedContent = `${indexContent}\n${content}`

        fs.writeFileSync(answers.indexPath, updatedContent)
      }

      console.log(
        chalk.green(`\n 🤓  Generated a new file at `) + 
        chalk.yellow.underline(`${fileDir}${answers.fileName}`) +  
        chalk.green(` from `) + 
        chalk.yellow.underline(`${answers.patternName}`) + chalk.green(` pattern`)
      )
    })
}

module.exports = {
  savePattern,
  generatePattern
} 

