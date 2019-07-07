const Node = require('./node')
const Series = require('./series')

class Rule extends Node {
  parse() {
    let match = this.code.match(/[^\s]/)

    if (!match) return false

    this.start += match.index

    match = this.code.match(/[};]/)

    if (!match) return false

    this.length = match.index

    if (!this.code.trim()) return false

    const [key, value] = this.code.split(':').map(s => s.trim())
    this.key = key
    this.value = value

    return true
  }
}

Rule.Series = class RulesSeries extends Series {
  get Item() { return Rule }
}

module.exports = Rule
