const fs         = require('fs')
const path       = require('path')
const inquirer   = require('inquirer')
const PathPrompt = require('inquirer-path').PathPrompt
const chalk      = require('chalk')
const argv       = require('minimist')(process.argv.slice(2))

const utils   = require('./utils')

const exists  = utils.exists
const readDir = utils.readDir

inquirer.registerPrompt('path', PathPrompt)
const patternQuestions = {
  save : [
    {
      type    : 'input',
      name    : 'patternName',
      message : 'What is the name of the pattern',
      default : argv.n,
      when(){
        return !argv.n
      }
    },
    {
      type     : 'path',
      name     : 'patternAddress',
      message  : 'Tell me the pattern location',
      default  : argv.a,
      validate : answer => exists(answer)
        ? true 
        : 'The path does not exist',
      when(){
        return !argv.a
      }
    }
  ],
  generate(patternName){
    return [
      {
        type    : 'rawlist',
        name    : 'patternName',
        message : 'Pick one pattern:',
        choices : readDir(path.resolve(`${process.custom.baseDir}/patterns/`)),
        default : patternName || argv.n || '',
        when(){
          return !patternName
        }
      },
      {
        type    : 'confirm',
        name    : 'isSnippet',
        default : true,
        message : 'Shall I generate a new file for this pattern?'
      },
      {
        type    : 'input',
        name    : 'fileName',
        message : 'What should I name the the new file?',
        when(answers){
          return answers.isSnippet
        }
      },
      {
        type     : 'path',
        name     : 'fileAddress',
        message  : 'Give me the address to generate the file',
        when(answers){
          return answers.isSnippet
        }
      },
      {
        type     : 'confirm',
        name     : 'updateIndexFile',
        default  : true,
        message  : 'Shall I update any index file?',
      },
      {
        type     : 'path',
        name     : 'indexPath',
        message  : `Enter index file URL to be updated`,
        when(answers){
          return answers.updateIndexFile
        }
      }
    ]
  }
}

function askQuestion(questions) {
  return function(){
    return inquirer.prompt(questions)
  }
}

module.exports = {
  askNewPatternQuestion : askQuestion(patternQuestions.save),
  generatePattern(pattern) {
    return () => inquirer.prompt(patternQuestions.generate(pattern))
  }
}

