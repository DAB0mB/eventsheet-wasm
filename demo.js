const EventSheet = require('./src')

EventSheet.wasm.then(() => {
  const eventsheet = new EventSheet()

  class InitializeEvent extends EventSheet.Event {
    static get eventName() {
      return 'initialize'
    }

    listen(mutation, trigger) {
      if (mutation.type === 'add' || mutation.type === 'mod') {
        trigger()
      }
    }
  }

  eventsheet.registerEvent(InitializeEvent)

  class ClassNameSelector extends EventSheet.Selector {
    static get selectorPattern() {
      return /\.(\w+)/
    }

    test(el, selector, className) {
      return el.classList.contains(className)
    }
  }

  eventsheet.registerSelector(ClassNameSelector)

  class BoomRule extends EventSheet.Rule {
    static get ruleName() {
      return 'boom'
    }

    ['on initialize'](e, params) {
      const [backgroundColor, borderColor, color] = params.split(/ +/)
      const target = e.target

      const backup = {
        innerText: target.innerText,
        fontWeight: target.style.fontWeight,
        color: target.style.color,
        border: target.style.border,
        backgroundColor: target.style.backgroundColor,
      };

      target.innerText = 'BOOM!'
      target.style.backgroundColor = backgroundColor
      target.style.border = `8px dashed ${borderColor}`
      target.style.fontWeight = 'bold'
      target.style.color = color

      return () => {
        target.innerText = backup.innerText
        target.style.backgroundColor = backup.backgroundColor
        target.style.border = backup.border
        target.style.fontWeight = backup.fontWeight
        target.style.color = backup.color
      }
    }
  }

  eventsheet.registerRule(BoomRule)

  eventsheet.attach(`
    .test {
      boom: red yellow white;
    }
  `)

  eventsheet.observe(document)

  {
    const div = document.createElement('div')
    div.style.height = '100px'
    div.style.width = '100px'
    div.style.border = '1px solid black'
    div.style.borderRadius = '999px'
    div.style.backgroundColor = 'white'
    div.style.position = 'fixed'
    div.style.top = 'calc(50vh - 50px)'
    div.style.left = 'calc(50vw - 50px)'
    div.style.zIndex = '999'
    div.style.display = 'flex'
    div.style.textAlign = 'center'
    div.style.justifyContent = 'center'
    div.style.flexDirection = 'column'
    div.innerText = 'click me'

    div.onclick = () => {
      div.classList.toggle('test')
    }

    document.body.append(div)
  }
});
