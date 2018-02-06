const fs           = require('fs')
const path         = require('path')
const chalk        = require('chalk')
const fuzzy        = require('fuzzy')
const inquirer     = require('inquirer')
const PathPrompt   = require('inquirer-path').PathPrompt
const autocomplete = require('inquirer-autocomplete-prompt')
const argv         = require('minimist')(process.argv.slice(2))

const utils   = require('./utils')

const readDir = utils.readDir
const allPatterns = readDir(path.resolve(`${process.custom.baseDir}/patterns/`))
const allFlows = readDir(path.resolve(`${process.custom.baseDir}/flows/`))

inquirer.registerPrompt('autocomplete', autocomplete)

function selectFlows(answers, input) {
  input = input || ''
  
  return new Promise((resolve) => {
    const fuzzyResult = fuzzy.filter(input, allFlows)

    resolve(fuzzyResult.map(el => el.original))
  })
}

const flowQuestions = {
  save : [
    {
      type    : 'input',
      name    : 'flowName',
      message : 'Enter Flow Name',
      default : argv.n,
      when(){
        return !argv.n
      }
    },
    {
      type    : 'checkbox',
      name    : 'flowSteps',
      message : 'Select flow steps',
      choices : allPatterns
    }
  ],
  generate : [
    {
      type     : 'autocomplete',
      name     : 'flowName',
      message  : 'Which flow do you want to execute?',
      source   : selectFlows
    }
  ]
}

function askQuestion(questions) {
  return function(){
    return inquirer.prompt(questions)
  }
}

module.exports = {
  askNewFlowQuestion      : askQuestion(flowQuestions.save),
  askGenerateFlowQuestion : askQuestion(flowQuestions.generate)
}

