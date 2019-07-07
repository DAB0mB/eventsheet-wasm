class Node {
  get root() {
    return this._root
  }

  get start() {
    return this._start
  }

  // Set start property and slice code
  set start(start) {
    if (typeof this._found == 'boolean') {
      throw Error('Node.start cannot be set outside Node.parse() method')
    }

    if (typeof start != 'number') {
      throw TypeError('Node.start must be a number')
    }

    this._start = start
  }

  get length() {
    return this._length
  }

  // Set length property and slice code
  set length(length) {
    if (typeof this._found == 'boolean') {
      throw Error('Node.length cannot be set outside Node.parse() method')
    }

    if (typeof length != 'number') {
      throw TypeError('Node.length must be a number')
    }

    this._length = length
  }

  get end() {
    return this._start + this._length
  }

  get code() {
    return this._root.code.slice(this._start, this.end)
  }

  get found() {
    return this._found
  }

  get self() {
    return this._found ? this : null
  }

  constructor(root, start = 0, length = Infinity, ...parseArgs) {
    if (!(root instanceof require('./root'))) {
      throw TypeError('root arg must be of Root instance')
    }

    if (typeof start != 'number') {
      throw TypeError('start arg must be a number')
    }

    if (typeof length != 'number') {
      throw TypeError('length arg must be a number')
    }

    if (typeof this.parse != 'function') {
      throw Error('Node.parse must be implemented')
    }

    this._root = root
    this._start = start
    this._length = length
    this._found = this.parse(...parseArgs)

    if (typeof this._found != 'boolean') {
      throw TypeError('Node.parse() must return a boolean')
    }

    if (!this._found) {
      this._length = 0
    }
  }
}

module.exports = Node
