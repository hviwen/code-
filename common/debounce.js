export function debounce(fn, delay = 300, options = {}) {
  const {immediate = false, maxWrit} = options
  let timeOutId = null
  let lastCallTime = 0
  let maxTimeOutId = 0

  const debounced = (...args) => {
    const currentTime = Date.now()

    if (timeOutId) {
      clearTimeout(timeOutId)
    }

    if (immediate && !timeOutId) {
      fn.apply(this, args)
      lastCallTime = currentTime
    }

    timeOutId = setTimeout(() => {
      if (!immediate) {
        fn.apply(this, args)
      }
      timeOutId = null
      maxTimeOutId = null
      lastCallTime = currentTime
    }, delay)

    if (maxWrit && !maxTimeOutId) {
      maxTimeOutId = setTimeout(() => {
        if (timeOutId) {
          clearTimeout(timeOutId)
          fn.apply(this, args)
          timeOutId = null
          maxTimeOutId = null
          lastCallTime = currentTime
        }
      }, maxWrit)
    }
  }

  debounced.cancel = () => {
    if (timeOutId) {
      clearTimeout(timeOutId)
      timeOutId = null
    }
    if (maxTimeOutId) {
      clearTimeout(maxTimeOutId)
      maxTimeOutId = null
    }
  }

  debounced.flush = () => {
    if (timeOutId) {
      clearTimeout(timeOutId)
      fn.apply(this, arguments)
      timeOutId = null
      maxTimeOutId = null
    }
  }

  return debounced
}
