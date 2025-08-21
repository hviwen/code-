export function throttle(fn, delay = 300, options = {}) {
  const {leading = true, trailing = true} = options

  let lastExecTime = 0
  let timeoutId = null
  let lastArgs = null

  const throttled = (...args) => {
    const currentTime = Date.now()
    lastArgs = args

    if (leading && currentTime - lastExecTime >= delay) {
      fn.apply(this, args)
      lastExecTime = currentTime
      return
    }

    if (trailing && !timeoutId) {
      timeoutId = setTimeout(() => {
        if (currentTime - lastExecTime >= delay) {
          fn.apply(this, lastArgs)
          lastExecTime = Date.now()
        }
        timeoutId = null
      }, delay - (currentTime - lastExecTime))
    }
  }

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    lastExecTime = 0
  }

  return throttled
}
