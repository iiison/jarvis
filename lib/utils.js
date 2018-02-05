const fs       = require('fs')

function exists(filePath) {
  try {
    fs.accessSync(filePath, fs.R_OK)
    return true
  } catch (error) {
    return false
  }
}

function readDir(dir) {
  const filelist = []
  const files = fs.readdirSync(dir)

  files.forEach(function(file) {
    if (!fs.statSync(`${dir}/${file}`).isDirectory()) {
      filelist.push(file)
    }
  })

  return filelist
}

module.exports = {
  exists,
  readDir
}

