function longestPalindrome(s) {
  if (!s || s.length <= 1) return s
  let start = 0
  let maxLen = 1

  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const currentLen = right - left + 1
      if (currentLen > maxLen) {
        maxLen = currentLen
        start = left
      }
      left--
      right++
    }
  }

  for (let i = 0; i < s.length; i++) {
    expandAroundCenter(i, i)
    expandAroundCenter(i, i + 1)
  }

  return s.substring(start, start + maxLen)
}

function compressString(s) {
  if (!s || s.length <= 1) return s

  let count = 1
  let compressed = ''

  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) {
      count++
    } else {
      compressed += count + s[i - 1]
      count = 1
    }
  }
  compressed += count + s[s.length - 1]
  return compressed.length < s.length ? compressed : s
}

function hasFourWords(text) {
  const words = text.split(/\s+/).filter(w => /^([a-zA-Z]+)$/.test(w))
  return words.length >= 4
}

function advancedFreqSort(arr) {
  const findMap = new Map()
  const findIndexMap = new Map()

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    findMap.set(item, (findMap.get(item) || 0) + 1)
    if (!findIndexMap.has(item)) {
      findIndexMap.set(item, i)
    }
  }

  const uniqueItems = Array.from(findMap.keys()).sort((a, b) => {
    const diff = findMap.get(b) - findMap.get(a)
    if (diff !== 0) return diff
    return findMap.get(a) - findMap.get(b)
  })
  console.log(uniqueItems)

  const result = []
  for (const item of uniqueItems) {
    const freq = findMap.get(item)
    for (let i = 0; i < freq; i++) {
      result.push(item)
    }
  }

  return result
}

function smartValidate(str) {
  const validate = {
    '(': ')',
    '{': '}',
    '[': ']',
  }
  const stack = []
  const openSet = new Set(['(', '{', '['])
  const closeSet = new Set([')', '}', ']'])

  for (const elem of str) {
    if (openSet.has(elem)) {
      stack.push(elem)
    } else if (closeSet.has(elem)) {
      const char = stack.pop()
      if (!char || validate[char] !== elem) return false
    }
  }

  return stack.length === 0
}

function complexGroupAnagrams(str) {
  const findMap = new Map()
  const findIndex = new Map()

  for (let i = 0; i < str.length; i++) {
    const item = str[i]
    const key = item.split('').sort().join('')

    if (!findMap.has(key)) {
      findMap.set(key, [])
      findIndex.set(key, i)
    }
    findMap.get(key).push(item)
  }

  return Array.from(findMap.entries())
    .sort((a, b) => findIndex.get(a[0]) - findIndex.get(b[0]))
    .map(([key, value]) => value)
}

function enhancedAbsoluteSort(arr) {
  return [...arr].sort((a, b) => Math.abs(a) - Math.abs(b))
}

function advancedTranslate(text) {
  const sounds = new Set(['a', 'e', 'i', 'o', 'u'])

  return text
    .split(' ')
    .map(word => {
      let result = ''
      let i = 0

      while (i < word.length) {
        const char = word[i]

        if (sounds.has(char)) {
          result += char
          while (i + 1 < word.length && word[i + 1] === char) {
            i++
          }
        } else {
          result += char
          if (i + 1 < word.length && sounds.has(word[i + 1])) {
            i++
          }
        }
        i++
      }

      return result
    })
    .join(' ')
}

function combinationSum(candidates, target) {
  const result = []

  function backTracking(start, currentCombination, remainingSum) {
    if (remainingSum === 0) {
      result.push([...currentCombination])
      return
    }

    if (remainingSum < 0) {
      return
    }

    for (let i = start; i < candidates.length; i++) {
      currentCombination.push(candidates[i])
      backTracking(i, currentCombination, remainingSum - candidates[i])
      currentCombination.pop()
    }
  }

  backTracking(0, [], target)
  return result
}

function longestCommonPrefix(strs) {
  if (!strs || strs.length === 0) return ''

  for (let i = 0; i < strs[0].length; i++) {
    const char = strs[0][i]

    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== char) {
        return strs[0].splice(0, i)
      }
    }
  }
  return strs[0]
}

class MyQueen {
  constructor() {
    this.inStack = []
    this.outStack = []
  }

  enqueue(val) {
    this.inStack.push(val)
  }

  _transferIfNeeded() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop())
      }
    }
  }

  dequeue() {
    this._transferIfNeeded()
    return this.outStack.length === 0 ? null : this.outStack.pop()
  }

  peek() {
    this._transferIfNeeded()
    return this.outStack.length === 0 ? null : this.outStack[this.outStack.length - 1]
  }

  isEmpty() {
    return this.outStack.length === 0 && this.inStack.length === 0
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.cache = new Map()
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    return -1
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }
}

class LFUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.minReq = 0

    this.keyToValue = new Map()
    this.keyToFreq = new Map()
    this.freqToKeys = new Map()
  }

  #_updateFreq(key) {
    const freq = this.keyToFreq.get(key)
    this.freqToKeys.get(freq).delete(key)

    if (this.freqToKeys.get(key).size === 0 && this.minReq === freq) {
      this.minReq++
    }

    const newFreq = freq + 1
    this.keyToFreq.set(key, newFreq)

    if (!this.freqToKeys.has(newFreq)) {
      this.freqToKeys.set(newFreq, new Set())
    }
    this.freqToKeys.get(newFreq).add(key)
  }

  get(key) {
    if (!this.keyToValue.has(key)) {
      return -1
    }
    this.#_updateFreq(key)
    return this.keyToValue.get(key)
  }

  put(key, value) {
    if (this.capacity <= 0) return
    if (this.keyToValue.has(key)) {
      this.keyToValue.set(key, value)
      this.#_updateFreq(key)
      return
    }
    if (this.keyToValue.size >= this.capacity) {
      const miniKeys = this.freqToKeys.get(this.minReq)

      const oldKey = miniKeys.values().next().value
      miniKeys.delete(oldKey)
      this.keyToValue.delete(oldKey)
      this.keyToFreq.delete(oldKey)
    }

    this.keyToValue.set(key, value)
    this.keyToFreq.set(key, 1)
    if (!this.freqToKeys.has(1)) {
      this.freqToKeys.set(1, new Set())
    }
    this.freqToKeys.get(1).add(key)
    this.minReq = 1
  }
}
