const __ = require('./_')

const _ = new __('events')

exports.addEventListener = (target, event, handler) => {
  const wrappedHandler = (e) => {
    const dispose = handler(e)

    if (dispose != null && typeof dispose != 'function') {
      throw TypeError('return value must be a function')
    }

    _(wrappedHandler).dispose = dispose
  }

  let events = _(target).events
  if (!events) {
    events = _(target).events = new Map()
  }

  let eventHandlers = events.get(event)
  if (!eventHandlers) {
    events.set(event, eventHandlers = new Set())
  }

  eventHandlers.add(wrappedHandler)

  target.addEventListener(event, wrappedHandler)
}

exports.removeAllEventListeners = (target) => {
  const events = _(target).events

  if (!events) return

  delete _(target).events

  for (let [event, eventHandlers] of events) {
    if (!eventHandlers) continue

    events.delete(event)

    for (let wrappedHandler of eventHandlers) {
      const dispose = _(wrappedHandler).dispose

      if (dispose) {
        dispose()
      }

      target.removeEventListener(event, wrappedHandler)
    }
  }
}
