const Event = require('./sheet_components/event')
const Rule = require('./sheet_components/rule')
const Selector = require('./sheet_components/selector')
const sheetParser = require('./sheet_parser')
const __ = require('./utils/_')
const { addEventListener, removeAllEventListeners } = require('./utils/events')
const { normalizeMutations, synthesizeMutations } = require('./utils/mutations')
import('~/cargos/wasm-css');

const _ = new __('index')

class EventSheet {
  static get Event() {
    return Event
  }

  static get Rule() {
    return Rule
  }

  static get Selector() {
    return Selector
  }

  constructor() {
    this.events = []
    this.selectors = []
    this.rules = []

    this.handleMutations = this.handleMutations.bind(this)
  }

  registerEvent(ctor) {
    Event.register(ctor, this)
  }

  registerRule(ctor) {
    Rule.register(ctor, this)
  }

  registerSelector(ctor) {
    Selector.register(ctor, this)
  }

  attach(sheetString) {
    const sheetAst = sheetParser.parse(sheetString)

    this.sheet = {}

    this.sheet.blocks = sheetAst.blocks.map((blockAst) => {
      const block = {}

      block.queries = blockAst.queries.map((queryAst) => {
        return queryAst.selectors.map((selectorString) => {
          let match
          const Selector = this.selectors.find((Selector) =>
            match = selectorString.match(Selector.selectorPattern)
          )

          if (Selector) {
            const selector = new Selector()

            return {
              test(el) {
                return selector.test(el, ...match)
              }
            }
          }
        }).filter(Boolean)
      }).filter(query => query.length)

      block.rules = blockAst.rules.map((ruleAst) => {
        const Rule = this.rules.find((Rule) =>
          Rule.ruleName === ruleAst.key
        )

        if (Rule) {
          const rule = new Rule()
          const wrappedRule = {}

          for (let method of Object.getOwnPropertyNames(Rule.prototype)) {
            if (/^on /.test(method)) {
              wrappedRule[method] = (e) => {
                return rule[method](e, ruleAst.value)
              }
            }
          }

          return wrappedRule
        }
      }).filter(Boolean)

      return block
    })
  }

  observe(el) {
    this.root = el
    this.observer = new MutationObserver(this.handleMutations)
    this.observer.observe(el, { attributes: true, attributeOldValue: true, subtree: true, childList: true })
    this.handleMutations([], this.observer, {
      addedNodes: synthesizeMutations(el, 'add'),
      removedNodes: [],
      modifiedNodes: [],
    })
  }

  handleMutations(mutations, observer, { addedNodes, removedNodes, modifiedNodes } = normalizeMutations(mutations)) {
    addedNodes.concat(modifiedNodes).forEach((mutation) => {
      this.removeEventListeners(mutation)
      this.addEventListeners(mutation)

      const newEvents = this.events.map((Event) => {
        const event = new Event()

        event.listen(mutation, (detail = {}) =>  {
          const e = new CustomEvent(Event.eventName, { detail })

          mutation.target.dispatchEvent(e)
        })

        return event
      })

      let events = _(mutation.target).events
      if (!events) {
        events = _(mutation.target).events = []
      }

      events.push(...newEvents)

      this.observer.takeRecords()
    })

    removedNodes.forEach((mutation) => {
      _(mutation.target).events.forEach((event) => {
        if (typeof event.stopListening == 'function') {
          event.stopListening(mutation)
        }
      })

      delete _(mutation.target).events
      this.removeEventListeners(mutation)
    })
  }

  addEventListeners(mutation) {
    this.sheet.blocks.forEach((block) => {
      const isRelevant = block.queries.some(selectors => {
        const [selfSelector, ...parentSelectors] = selectors

        if (!selfSelector.test(mutation.target)) return false

        let parentSelector = parentSelectors.pop()
        let parent = mutation.target.parentElement

        while (parent && parent !== this.root && parentSelector) {
          if (parentSelector.test(parent)) {
            parentSelector = parentSelectors.pop()
          }

          parent = parent.parentElement
        }

        return !parentSelector
      })

      if (!isRelevant) return

      block.rules.forEach((rule) => {
        for (let method in rule) {
          if (!/^on /.test(method)) continue

          const handler = rule[method]
          const events = method.split(/ +/).slice(1).join('').split(',')

          events.forEach((event) => {
            // Will be able to run dispose method returned by handler on removal
            addEventListener(mutation.target, event, handler)
          })
        }
      })
    })
  }

  removeEventListeners(mutation) {
    removeAllEventListeners(mutation.target)
  }
}

module.exports = EventSheet
