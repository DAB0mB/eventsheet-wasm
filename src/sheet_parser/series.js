const Node = require('./node')

class Series extends Node {
  get size() {
    return this.items.length
  }

  get Item() {
    throw Error('Series.Item must be defined')
  }

  parse() {
    this.items = []

    let child = new this.Item(this.root, this.start)
    while (child.found) {
      this.items.push(child)
      child = new this.Item(this.root, child.end)
    }

    if (!this.items.length) return false

    this.start = this.items[0].start
    this.length = this.items[this.items.length - 1].end - this.start

    return true
  }
}

module.exports = Series
