const fs       = require('fs')
const path     = require('path')
const mkdirp   = require('mkdirp')
const mkpath   = require('mkpath')
const chalk    = require('chalk')
const relative = require('relative')

const prompt           = require('./patternPrompt')
const flagQuestionsMap = require('../configs/flag-question-map')

function savePattern(args) {
  console.log(chalk.green('\n🍻  Generating new pattern:'))

  prompt
    .askNewPatternQuestion()
    .then (answers => {
      const patternsPath = `${process.custom.baseDir}/patterns`
      const pattern = fs.readFileSync(answers.patternAddress, 'utf8')

      if (!fs.existsSync(patternsPath)) {
        mkpath.sync(patternsPath)
      }

      fs.writeFile(`${patternsPath}/${answers.patternName}`, pattern)

      console.log(chalk.green(`\n 🤓  Saved a new pattern with name ${answers.patternName}.\n`))
    })
}

function generatePattern(patterns) {
  if (patterns) {
    console.log(
      chalk.green('\n🗂  Generating new file from ') +
      chalk.green.underline(`${patterns[0]}`) +
      chalk.green(' pattern:')
    )
  } else {
    console.log(chalk.green('\n🗂  Generating new file:'))
  }

  prompt
    .generatePattern(patterns && patterns[0])()
    .then (answers => {
      answers.patternName = answers.patternName || patterns[0]

      let fileDir = answers.fileAddress.replace(/\/$/, '')

      fileDir += '/'

      if (!fs.existsSync(fileDir)) {
        mkpath.sync(fileDir)
      }

      const pattern = fs.readFileSync(`${process.custom.baseDir}/patterns/${answers.patternName}`, 'utf8')

      fs.writeFileSync(`${fileDir}${answers.fileName}`, pattern)
      patterns && patterns.shift()

      console.log(
        chalk.green(`\n 🤓  Generated a new file at `) +
        chalk.yellow.underline(`${fileDir}${answers.fileName}`) +
        chalk.green(` from `) +
        chalk.yellow.underline(`${answers.patternName}`) + 
        chalk.green(` pattern`) +
        '\n'
      )

      if (answers.updateIndexFile) {
        let relativePathToIndex = relative(answers.indexPath, `${fileDir}${answers.fileName}`)

        relativePathToIndex = /^\W/.test(relativePathToIndex)
          ? `./${relativePathToIndex}`
          : relativePathToIndex


        if (!fs.existsSync(answers.indexPath)) {
          fs.writeFileSync(answers.indexPath, '')
        }

        const fileName = answers.fileName.replace(/\.(js|jsx)$/, '')
        const relativePath = relativePathToIndex.replace(/\.(js|jsx)$/, '')

        const content = `export ${fileName} from '${relativePath}'`

        const indexContent = fs.readFileSync(answers.indexPath, 'utf8').replace(/\n$/, '')
        const updatedContent = `${indexContent}\n${content}\n`

        fs.writeFileSync(answers.indexPath, updatedContent)
      }

      if (patterns && patterns.length > 0) {
        generatePattern(patterns)
      }
    })
}

module.exports = {
  savePattern,
  generatePattern
}
