class Rule {
  static register(ctor, eventsheet) {
    const proto = ctor.prototype

    if (!(proto instanceof Rule)) {
      throw TypeError('Received ctor must inherit from Rule')
    }

    if (typeof ctor.ruleName !== 'string') {
      throw TypeError('Rule.ruleName must be defined')
    }

    eventsheet.rules.push(ctor)
  }
}

module.exports = Rule
