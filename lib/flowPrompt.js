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

inquirer.registerPrompt('autocomplete', autocomplete)

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
  ]
}

function askQuestion(questions) {
  return function(){
    return inquirer.prompt(questions)
  }
}

module.exports = {
  askNewFlowQuestion : askQuestion(flowQuestions.save),
}

