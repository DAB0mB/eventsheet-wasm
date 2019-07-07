class Selector {
  static register(ctor, eventsheet) {
    const proto = ctor.prototype

    if (!(proto instanceof Selector)) {
      throw TypeError('Received ctor must inherit from Selector')
    }

    if (!(ctor.selectorPattern instanceof RegExp)) {
      throw TypeError('Selector.selectorPattern must be defined')
    }

    if (typeof proto.test !== 'function') {
      throw TypeError('Selector.test must be a implemented')
    }

    eventsheet.selectors.push(ctor)
  }
}

module.exports = Selector
