const Node = require('./node')
const Rule = require('./rule')
const Query = require('./query')
const Series = require('./series')

class Block extends Node {
  parse() {
    let match = this.code.match(/[^\s]/)

    if (!match) return false

    this.start += match.index

    match = this.code.match(/\{/)

    if (!match) return false

    const scopeStart = match.index

    const queries = new Query.Series(this.root, this.start)
    const rules = new Rule.Series(this.root, this.start + scopeStart + 1)
    this.length = rules.end - this.start
    this.queries = queries.items
    this.rules = rules.items

    if (!this.code.trim()) return false

    return true
  }
}

Block.Series = class BlocksSeries extends Series {
  get Item() { return Block }
}

module.exports = Block
