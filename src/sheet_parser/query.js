const Node = require('./node')
const Series = require('./series')

class Query extends Node {
  parse() {
    let match = this.code.match(/[^\s,]/)

    if (!match) return false

    this.start += match.index

    match = this.code.match(/[{,]/)

    if (!match) return false

    this.length = match.index

    if (!this.code.trim()) return false

    this.selectors = this.code.split(/ +/)

    return true
  }
}

Query.Series = class QuerysSeries extends Series {
  get Item() { return Query }
}

module.exports = Query
