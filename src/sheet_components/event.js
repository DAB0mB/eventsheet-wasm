class Event {
  static register(ctor, eventsheet) {
    const proto = ctor.prototype

    if (!(proto instanceof Event)) {
      throw TypeError('Received ctor must inherit from Event')
    }

    if (typeof ctor.eventName !== 'string') {
      throw TypeError('Event.eventName must be defined')
    }

    if (typeof proto.listen !== 'function') {
      throw TypeError('Event.listen must be a implemented')
    }

    eventsheet.events.push(ctor)
  }
}

module.exports = Event
