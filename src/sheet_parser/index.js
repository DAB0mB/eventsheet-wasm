const Root = require('./root')

exports.parse = (sheet) => {
  return new Root(sheet)
}
