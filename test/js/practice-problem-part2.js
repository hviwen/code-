/*
### 51. 有效数独
**描述**：判断 9x9 的数独板是否有效。
- 每行必须包含数字 1-9，不能重复。
- 每列必须包含数字 1-9，不能重复。
- 九个 3x3 的子方格中的每一个必须包含数字 1-9，不能重复。

**输入**：二维数组 (9x9)
**输出**：布尔值

**示例**：
```javascript
isValidSudoku([
 ["5","3",".",".","7",".",".",".","."],
 ["6",".",".","1","9","5",".",".","."],
 [".","9","8",".",".",".",".","6","."],
 ["8",".",".",".","6",".",".",".","3"],
 ["4",".",".","8",".","3",".",".","1"],
 ["7",".",".",".","2",".",".",".","6"],
 [".","6",".",".",".",".","2","8","."],
 [".",".",".","4","1","9",".",".","5"],
 [".",".",".",".","8",".",".","7","9"]
]) // 返回 true
```*/
function isValidSudoku(arr) {
  const rows = Array.from({ length: 9 }, () => new Set())
  const columns = Array.from({ length: 9 }, () => new Set())
  const blocks = Array.from({ length: 9 }, () => new Set())

  for (let c = 0; c < 9; c++) {
    for (let r = 0; r < 9; r++) {
      const elem = arr[c][r]
      if (elem === '.') continue
      if (!/^[1-9]$/.test(elem)) return false

      const boxIndex = Math.floor(c / 3) * 3 + Math.floor(r / 3)
      console.log('boxIndex', boxIndex)

      if (rows[r].has(elem)) return false
      rows[r].add(elem)

      if (columns[c].has(elem)) return false
      columns[c].add(elem)

      if (blocks[boxIndex].has(elem)) return false
      blocks[boxIndex].add(elem)
    }
  }
  return true
}

/*
### 52. 跳跃游戏
**描述**：确定你是否能够到达数组的最后一个索引。
- 从索引 0 开始，每个元素表示你在该位置的最大跳跃长度。
- 如果能到达最后一个索引，返回 true，否则返回 false。

**输入**：非负整数数组
**输出**：布尔值

**示例**：
```javascript
canJump([2,3,1,1,4]) // 返回 true
canJump([3,2,1,0,4]) // 返回 false
```*/
function canJump(arr) {
  const len = arr.length - 1
  if (arr[0] > len) return false
  let sumJum = arr[0]
  while (sumJum < len) {
    let next = arr[sumJum]
    if (next === 0) return false
    sumJum = sumJum + next
    if (sumJum === len) return true
  }
  return false
}

/*
### 53. 二分查找
**描述**：实现二分查找，在有序数组中查找目标值的索引。
- 如果目标不在数组中，返回 -1。

**输入**：有序数字数组，目标数字
**输出**：数字 (索引)

**示例**：
```javascript
binarySearch([1, 2, 3, 4, 5, 6, 7], 5) // 返回 4
binarySearch([1, 2, 3, 4, 5, 6, 7], 8) // 返回 -1
```*/
function binarySearch(arr, target) {
  if (arr.length === 0) return -1
  let middle = Math.floor(arr.length / 2)
  while (arr[middle] !== target && middle > 0 && middle < arr.length - 1) {
    if (arr[middle] > target) {
      middle = Math.floor(middle / 2)
    } else {
      middle = Math.floor((arr.length + middle) / 2)
    }
  }
  return arr[middle] === target ? middle : -1
}

/*
### 54. 电话号码的字母组合
**描述**：给定一个包含 2-9 的字符串，返回所有可能的字母组合，这些数字在电话键盘上可以表示。
- 2: abc, 3: def, 4: ghi, 5: jkl, 6: mno, 7: pqrs, 8: tuv, 9: wxyz

**输入**：数字字符串 (2-9)
**输出**：字符串数组

**示例**：
```javascript
letterCombinations("23") // 返回 ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
letterCombinations("2") // 返回 ["a", "b", "c"]
```*/
function letterCombinations(nums) {
  let result = []
  const keyMap = {
    2: ['a', 'b', 'c'],
    3: ['d', 'e', 'f'],
    4: ['g', 'h', 'i'],
    5: ['j', 'k', 'l'],
    6: ['m', 'n', 'o'],
    7: ['p', 'q', 'r', 's'],
    8: ['t', 'u', 'v'],
    9: ['w', 'x', 'y', 'z'],
  }

  for (const num of `${nums}`.split('').map(i => Number(i))) {
    const currentKeyMaps = keyMap[num]
    if (result.length === 0) {
      result.push(...currentKeyMaps)
    } else {
      const temp = []
      for (const saveKey of result) {
        for (const keyMap of currentKeyMaps) {
          temp.push(`${saveKey}${keyMap}`)
        }
      }
      result = [...temp]
    }
  }
  return result
}

/*
### 55. 单词模式
**描述**：给定一个模式和一个字符串，判断字符串是否遵循相同的模式。
- 模式中的每个字符对应字符串中的一个单词。
- 相同的字符必须对应相同的单词，不同的字符必须对应不同的单词。

**输入**：字符串模式，字符串 s
**输出**：布尔值

**示例**：
```javascript
wordPattern("abba", "dog cat cat dog") // 返回 true
wordPattern("abba", "dog cat cat fish") // 返回 false
wordPattern("aaaa", "dog dog dog dog") // 返回 true
```*/
function wordPattern(mode, str) {
  const modeArr = mode.split('')
  const strArr = str.split(' ')
  if (modeArr.length !== strArr.length) return false
  const map = new Map()

  for (let i = 0; i < modeArr.length; i++) {
    const modeK = modeArr[i]
    if (!map.has(modeK)) {
      map.set(modeK, strArr[i])
    }
  }

  const result = []
  for (const mode of modeArr) {
    result.push(map.get(mode))
  }

  return result.join(' ') === str
}

/*
### 56. 最长公共前缀
**描述**：查找字符串数组中的最长公共前缀。
- 如果没有公共前缀，则返回空字符串。

**输入**：字符串数组
**输出**：字符串

**示例**：
```javascript
longestCommonPrefix(["flower", "flow", "flight"]) // 返回 "fl"
longestCommonPrefix(["dog", "racecar", "car"]) // 返回 ""
```*/
function longestCommonPrefix(arr) {
  if (arr.length <= 1) return ''

  let prefix = arr[0]
  for (let i = 1; i < arr.length; i++) {
    while (arr[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1)
      if (prefix === '') return ''
    }
  }

  return prefix
}

/*
### 57. 外观数列
**描述**：实现外观数列。
- 从 "1" 开始
- 后续每一项是对前一项的描述，读作数字序列。
- 例如："一个 1" => "11"，"两个 1" => "21"，"一个 2，一个 1" => "1211" 等。

**输入**：数字 n (1-30)
**输出**：字符串

**示例**：
```javascript
countAndSay(1) // 返回 "1"
countAndSay(4) // 返回 "1211"
```*/
function countAndSay(index) {
  if (index < 1 || index > 30) {
    throw new Error(`${index} must be 1-30`)
  }
  let s = '1'
  for (let i = 1; i < index; i++) {
    let count = 1
    const parts = []

    for (let j = 1; j <= s.length; j++) {
      if (s[j] === s[j - 1]) {
        count++
      } else {
        parts.push(String(count), s[j - 1])
        count = 1
      }
    }

    s = parts.join('')
  }
  return s
}

/*
### 58. 字符串压缩
**描述**：使用重复字符的计数实现基本的字符串压缩。
- 如果压缩后的字符串不小于原始字符串，则返回原始字符串。

**输入**：字符串 (1-1000 个字符)
**输出**：字符串

**示例**：
```javascript
compress("aabcccccaaa") // 返回 "a2b1c5a3"
compress("abcdef") // 返回 "abcdef"
```*/
function compress(str) {
  let result = ''
  let count = 1
  for (let i = 1; i < str.length; i++) {
    if (str[i - 1].indexOf(str[i]) === 0) {
      count++
    } else {
      result += `${str[i - 1]}${count}`
      count = 1
    }
  }
  if (count > 1) {
    result += `${str[str.length - 1]}${count}`
  }
  return result.length < str.length ? result : str
}

/*
### 59. 旋转图像
**描述**：将 n×n 的二维矩阵顺时针旋转 90 度。
- 必须原地旋转图像。

**输入**：二维数组
**输出**：二维数组

**示例**：
```javascript
rotateImage([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]) // 返回 [
//  [7, 4, 1],
//  [8, 5, 2],
//  [9, 6, 3]
//]
```*/
function rotateImage(arr) {
  if (arr.length === 0) return []
  const tempArr = Array.from({ length: arr.length }, () => new Array(arr.length).fill(null))

  const len = arr.length
  for (let i = 0; i < len; i++) {
    let rotateIndex = len - 1
    for (let j = 0; j < len; j++) {
      tempArr[j][rotateIndex - i] = arr[i][j]
    }
  }

  return tempArr
}

/*
### 60. 查找第一个和最后一个位置
**描述**：在有序数组中查找给定目标值的起始和结束位置。
- 如果找不到目标，则返回 [-1, -1]。

**输入**：有序数组，目标值
**输出**：数组 [第一个位置, 最后一个位置]

**示例**：
```javascript
searchRange([5, 7, 7, 8, 8, 10], 8) // 返回 [3, 4]
searchRange([5, 7, 7, 8, 8, 10], 6) // 返回 [-1, -1]
```*/
function searchRange(arr, target) {
  return [arr.findIndex(i => i === target), arr.findLastIndex(i => i === target)]
}

/*
### 61. 盛最多水的容器
**描述**：给定 n 个非负整数表示每个宽度为 1 的柱子的高度，找出两条线与 x 轴共同构成的容器，使其能够容纳最多的水。

**输入**：高度数组
**输出**：数字 (最大容水量)

**示例**：
```javascript
maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) // 返回 49
maxArea([1, 1]) // 返回 1
```*/
function maxArea(arr) {
  let maxSize = 0
  let left = 0
  let right = arr.length - 1

  while (left < right) {
    const currentHeight = Math.min(arr[left], arr[right])
    const currentSize = (right - left) * currentHeight
    maxSize = Math.max(maxSize, currentSize)
    if (arr[left] < arr[right]) {
      left++
    } else {
      right--
    }
  }

  return maxSize
}

/*
### 62. 缺失的第一个正数
**描述**：找出数组中缺失的最小正整数。
- 算法应该在 O(n) 时间内运行并使用 O(1) 额外空间。

**输入**：整数数组
**输出**：数字

**示例**：
```javascript
firstMissingPositive([1, 2, 0]) // 返回 3
firstMissingPositive([3, 4, -1, 1]) // 返回 2
firstMissingPositive([7, 8, 9, 11, 12]) // 返回 1
```*/
function firstMissingPositive(nums) {
  const n = nums.length
  // 原地把值 x 放到下标 x-1
  for (let i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const targetIdx = nums[i] - 1
      // 交换 nums[i] 和 nums[targetIdx]
      ;[nums[i], nums[targetIdx]] = [nums[targetIdx], nums[i]]
    }
  }

  // 找到第一个不在正确位置的下标
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1
  }
  return n + 1
}

/*
### 63. 最长回文子串
**描述**：找出字符串中最长的回文子串。
- 回文是指正序和倒序读都相同的字符串。

**输入**：字符串 (1-1000 个字符)
**输出**：字符串

**示例**：
```javascript
longestPalindrome("babad") // 返回 "bab" 或 "aba"
longestPalindrome("cbbd") // 返回 "bb"
```*/
function longestPalindrome(str) {
  if (str.length === 1) return str

  const result = []
  let record = str[0]

  for (let i = 1; i < str.length; i++) {
    const char = str[i]
    if (record.includes(char)) {
      const rIndex = record.indexOf(char)
      const reverseStr = str
        .slice(rIndex, i + 1)
        .split('')
        .reverse()
        .join('')
      const recordStr = record.slice(rIndex) + char

      if (reverseStr === recordStr) {
        result.push(reverseStr)
      }
    }
    record += char
  }
  result.sort((a, b) => b.length - a.length)

  return result[0]
}

/*
### 65. 组合总和
**描述**：找出数组中所有和等于目标值的唯一组合。
- 每个数字可以使用多次。

**输入**：不同整数数组，目标整数
**输出**：数组的数组

**示例**：
```javascript
combinationSum([2, 3, 6, 7], 7) // 返回 [[2, 2, 3], [7]]
combinationSum([2, 3, 5], 8) // 返回 [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
```*/
function combinationSum(arr, num) {
  if (arr.every(i => i > num)) return []
  const sortArr = [...arr].sort((a, b) => a - b)
  const result = []

  for (let i = 0; i < sortArr.length; i++) {
    const diff = num % sortArr[i]
    const len = Math.floor(num / sortArr[i])
    if (diff === 0) {
      result.push(Array.from({ length: len }).fill(sortArr[i]))
    } else {
      if (sortArr.includes(diff)) {
        const comb = [diff, ...Array.from({ length: len }).fill(sortArr[i])]
        result.push(comb)
      } else if (sortArr.includes(len)) {
        const comb = [...Array.from({ length: len - 1 }).fill(sortArr[i]), len]
        const sum = comb.reduce((prev, curr) => prev + curr, 0)
        if (sum === num) {
          result.push(comb)
        }
      } else {
        continue
      }
    }
  }

  return result
}

/*
### 66. 字符串相乘
**描述**：将两个表示为字符串的非负整数相乘。
- 数字可以任意大。
- 不要使用内置的大整数库或直接将输入转换为整数。

**输入**：两个字符串
**输出**：字符串

**示例**：
```javascript
multiply("2", "3") // 返回 "6"
multiply("123", "456") // 返回 "56088"
```*/
function multiply(n, m) {
  if (n === '0' || m === '0') return '0'
  const nLen = n.length
  const mLen = m.length

  const numArr = Array.from({ length: nLen + mLen }).fill(0)
  for (let i = nLen - 1; i >= 0; i--) {
    for (let j = mLen - 1; j >= 0; j--) {
      const mul = (m[i] - '0') * (n[j] - '0')
      const sum = numArr[i + j + 1] + mul
      numArr[i + j + 1] = sum % 10
      numArr[i + j] += Math.floor(sum / 10)
    }
  }

  const index = numArr.findIndex(i => i !== 0)
  return numArr.slice(index).join('')
}

/*
### 67. 有效数字
**描述**：验证一个字符串是否为有效数字。
- 有效数字可以是：整数、小数、科学计数法。
- 示例格式："0"、"-0.1"、"2e10"、"-90E3" 等。
- 无效格式："abc"、"1a"、"1e"、"e3"、"99e2.5"、"--6" 等。

**输入**：字符串
**输出**：布尔值

**示例**：
```javascript
isNumber("0") // 返回 true
isNumber("e") // 返回 false
isNumber("0.1") // 返回 true
isNumber(".1") // 返回 true
isNumber("3.") // 返回 true
```*/
function isNumber(str) {
  return Number.isNaN(Number(str))
}

/*
### 68. 简化路径
**描述**：简化 Unix 风格的文件路径。
- 以斜杠 '/' 开头
- 任何包含 '.' 的组件被忽略
- 任何包含 '..' 的组件导致前一个组件被忽略
- 多个连续的斜杠被视为单个斜杠

**输入**：字符串路径
**输出**：字符串简化路径

**示例**：
```javascript
simplifyPath("/home/") // 返回 "/home"
simplifyPath("/../") // 返回 "/"
simplifyPath("/home//foo/") // 返回 "/home/foo"
```*/
function simplifyPath(path) {
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1)
  }
  let _path = ''
  for (let i = 0; i < path.length; i++) {
    if (path[i] === '.' || (path[i] === '/' && _path.at(-1) === '/')) {
      continue
    } else {
      _path += path[i]
    }
  }

  return _path
}

/*
### 69. LRU 缓存
**描述**：实现具有 get 和 put 操作的最近最少使用（LRU）缓存。
- get(key)：如果键存在，则返回键的值，否则返回 -1。
- put(key, value)：设置或插入值。当缓存达到其容量时，淘汰最近最少使用的键。

**输入**：操作和值
**输出**：操作结果

**示例**：
```javascript
const lruCache = new LRUCache(2);
lruCache.put(1, 1); // 缓存是 {1=1}
lruCache.put(2, 2); // 缓存是 {1=1, 2=2}
lruCache.get(1);    // 返回 1
lruCache.put(3, 3); // 淘汰键 2，缓存是 {1=1, 3=3}
lruCache.get(2);    // 返回 -1 (未找到)
```*/
class LRUCache {
  constructor(count) {
    this.count = count
    this.map = new Map()
    this.stack = []
  }

  put(key, value) {
    if (this.map.size < this.count) {
      this.map.set(key, value)
      this.stack.push(key)
    } else {
      const head = this.stack.shift()
      this.map.delete(head)
      this.map.set(key, value)
      this.stack.push(key)
    }
  }

  get(key) {
    const value = this.map.get(key)
    if (!value) return -1
    const index = this.stack.indexOf(key)
    this.stack.splice(index, 1)
    this.stack.push(key)
    return value
  }
}
