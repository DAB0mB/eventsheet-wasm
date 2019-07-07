const { flatten } = require('.')

exports.normalizeMutations = (mutations) => {
  const addedNodes = new Map()
  const removedNodes = new Map()
  const modifiedNodes = new Map()

  mutations.forEach((mutation) => {
    if (mutation.type != 'childList') return

    mutation.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return

      if (removedNodes.has(node)) {
        removedNodes.delete(node)
      }
      else {
        addedNodes.set(node, {
          type: 'add',
          target: node,
          previousSibling: mutation.previousSibling,
          nextSibling: mutation.nextSibling,
        })
      }
    })

    mutation.removedNodes.forEach((node) => {
      if (!(node instanceof Element)) return

      if (addedNodes.has(node)) {
        addedNodes.delete(node)
      }
      else {
        removedNodes.set(node, {
          type: 'del',
          target: node,
          previousSibling: mutation.previousSibling,
          nextSibling: mutation.nextSibling,
        })
      }
    })
  })

  mutations.forEach((mutation) => {
    if (mutation.type != 'attributes') return

    const node = mutation.target
    const attr = mutation.attributeName
    let nodeModifications = modifiedNodes.get(node)

    if (!nodeModifications) {
      modifiedNodes.set(node, nodeModifications = new Map())
    }

    nodeModifications.set(attr, {
      type: 'mod',
      target: node,
      attributeName: attr,
      attributeNamespace: mutation.attributeNamespace,
      oldValue: mutation.oldValue,
    })
  })

  const { getGreatestMutation, synthesizeMutations } = exports
  const greatestAddMutation = getGreatestMutation(Array.from(addedNodes.values()))
  const greatestRemoveMutation = getGreatestMutation(Array.from(removedNodes.values()))

  return {
    addedNodes: greatestAddMutation ? [greatestAddMutation].concat(synthesizeMutations(greatestAddMutation.target, 'add')) : [],
    removedNodes: greatestRemoveMutation ? [greatestRemoveMutation].concat(synthesizeMutations(greatestRemoveMutation.target, 'del')) : [],
    modifiedNodes: flatten(Array.from(modifiedNodes.values()), mods => Array.from(mods.values())),
  }
}

exports.getGreatestMutation = (mutations) => {
  let greatestMutation
  for (let mutation of mutations) {
    if (greatestMutation) {
      if (mutation.target.contains(greatestMutation.target)) {
        greatestMutation = mutation
      }
    } else {
      greatestMutation = mutation
    }
  }

  return greatestMutation
}

exports.synthesizeMutations = (el, type) => {
  if (!el.children.length) return []

  return Array.from(el.children).reduce((mutations, childEl) => {
    return mutations.concat(exports.synthesizeMutations(childEl, type)).concat({
      type,
      target: childEl,
      previousSibling: childEl.previousSibling,
      nextSibling: childEl.nextSibling,
    })
  }, [])
}
