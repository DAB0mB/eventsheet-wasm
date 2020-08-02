let css

const getter = (get) => () => {
  const value = get()

  if (!value) {
    throw Error('Did you forget to await EventSheet.wasm?')
  }

  return value
}

exports._init = Promise.all([
  import('~/cargos/wasm-css').then((_css) => css = _css),
])

exports.__defineGetter__('css', getter(() => css))
