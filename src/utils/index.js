exports.flatten = (arr, mapFn = x => x) => {
  return arr.reduce((flat, arr) => {
    return flat.concat(mapFn(arr))
  }, [])
}
