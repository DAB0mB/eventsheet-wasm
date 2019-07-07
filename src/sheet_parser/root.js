const Block = require('./block')

class Root {
  get code() {
    return this._code
  }

  constructor(code) {
    if (typeof code != 'string') {
      throw TypeError('code arg must be a strings')
    }

    this._code = code

    this.parse()
  }

  parse() {
    this.blocks = new Block.Series(this).items
  }
}

module.exports = Root
