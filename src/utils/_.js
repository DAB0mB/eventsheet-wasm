const default_ = Symbol('eventsheet')

function __(obj, _ = default_) {
  if (this instanceof __) {
    _ = Symbol(`eventsheet${typeof obj == 'string' ? `:${obj}` : ''}`)

    return obj => __(obj, _)
  }

  if (!obj[_]) {
    obj[_] = {}
  }

  return obj[_]
}

module.exports = __
