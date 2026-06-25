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

// 评估点评: ✅ 正确且高效解法
// 优点: 使用Set数据结构高效检测重复，一次遍历完成验证
// 核心概念: Set去重、二维数组遍历、数学计算（3x3块索引）
// 小问题: 包含调试代码console.log，生产环境应移除
// 时间复杂度: O(1) - 固定9x9网格，空间复杂度: O(1)

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

// 评估点评: ❌ 算法逻辑错误
// 问题:
// 1. 误解题意：不是每次必须跳到最大距离，而是可以选择跳1到最大距离的任意步数
// 2. 算法过于简单，没有考虑最优路径选择
// 3. 第一个条件判断错误：arr[0] > len时应该返回true而不是false
//
// 正确解法:
function canJumpCorrect(nums) {
  let maxReach = 0

  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false // 无法到达当前位置
    maxReach = Math.max(maxReach, i + nums[i]) // 更新最远可达位置
    if (maxReach >= nums.length - 1) return true // 可以到达最后位置
  }

  return maxReach >= nums.length - 1
}
// 核心概念: 贪心算法、动态规划思想、最优子结构

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

// 评估点评: ❌ 二分查找算法实现错误
// 问题:
// 1. 没有维护left和right边界，导致搜索范围不正确
// 2. 中点计算错误，应该是(left + right) / 2
// 3. 循环条件不正确，可能导致无限循环或遗漏目标
//
// 正确解法:
function binarySearchCorrect(arr, target) {
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    const middle = Math.floor((left + right) / 2)

    if (arr[middle] === target) {
      return middle
    } else if (arr[middle] < target) {
      left = middle + 1
    } else {
      right = middle - 1
    }
  }

  return -1
}
// 核心概念: 二分查找、边界维护、对数时间复杂度O(log n)

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
        for (const charKey of currentKeyMaps) {
          temp.push(`${saveKey}${charKey}`)
        }
      }
      result = [...temp]
    }
  }
  return result
}

// 评估点评: ⚠️ 基本正确但可以优化
// 优点: 逻辑正确，能生成所有组合
// 问题:
// 1. 变量名keyMap在内层循环中被重用，容易混淆
// 2. 不必要的字符串模板转换和数字转换
// 3. 没有处理空字符串的边界情况
// 4. 可以使用递归或更简洁的方法
//
// 改进解法:
function letterCombinationsImproved(digits) {
  if (!digits) return []

  const phoneMap = {
    2: 'abc',
    3: 'def',
    4: 'ghi',
    5: 'jkl',
    6: 'mno',
    7: 'pqrs',
    8: 'tuv',
    9: 'wxyz',
  }

  const result = []

  function backtrack(index, currentCombination) {
    if (index === digits.length) {
      result.push(currentCombination)
      return
    }

    const letters = phoneMap[digits[index]]
    for (const letter of letters) {
      backtrack(index + 1, currentCombination + letter)
    }
  }

  backtrack(0, '')
  return result
}
// 核心概念: 回溯算法、递归、笛卡尔积

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

// 评估点评: ❌ 逻辑错误 - 缺少双向映射检查
// 问题:
// 1. 只检查了模式字符到单词的映射，没有检查单词到模式字符的反向映射
// 2. 例如pattern="abba", s="dog dog dog dog"会错误返回true
// 3. 需要确保一对一的双向映射关系
//
// 正确解法:
function wordPatternCorrect(pattern, s) {
  const words = s.split(' ')
  if (pattern.length !== words.length) return false

  const charToWord = new Map()
  const wordToChar = new Map()

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i]
    const word = words[i]

    // 检查字符到单词的映射
    if (charToWord.has(char)) {
      if (charToWord.get(char) !== word) return false
    } else {
      charToWord.set(char, word)
    }

    // 检查单词到字符的映射
    if (wordToChar.has(word)) {
      if (wordToChar.get(word) !== char) return false
    } else {
      wordToChar.set(word, char)
    }
  }

  return true
}
// 核心概念: 双向映射、一对一关系、Map数据结构

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

// 评估点评: ⚠️ 边界条件处理错误
// 问题:
// 1. 当数组长度为1时应该返回该字符串，而不是空字符串
// 2. 当数组为空时应该返回空字符串
// 3. 算法逻辑正确但可以优化
//
// 改进解法:
function longestCommonPrefixImproved(strs) {
  if (!strs || strs.length === 0) return ''
  if (strs.length === 1) return strs[0]

  let prefix = strs[0]

  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1)
      if (prefix === '') return ''
    }
  }

  return prefix
}

// 更高效的解法（垂直扫描）:
function longestCommonPrefixOptimal(strs) {
  if (!strs || strs.length === 0) return ''

  for (let i = 0; i < strs[0].length; i++) {
    const char = strs[0][i]
    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== char) {
        return strs[0].slice(0, i)
      }
    }
  }

  return strs[0]
}
// 核心概念: 字符串比较、前缀匹配、边界处理

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

// 评估点评: ✅ 正确且高效解法
// 优点: 算法逻辑正确，正确实现了外观数列的生成规则
// 核心概念: 字符串处理、计数逻辑、迭代生成
// 时间复杂度: O(n * m) 其中n是index，m是字符串长度
// 空间复杂度: O(m) 用于存储中间结果

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

// 评估点评: ❌ 字符比较逻辑错误
// 问题:
// 1. str[i-1].indexOf(str[i]) === 0 逻辑错误，应该直接比较字符相等性
// 2. 最后一个字符的处理不完整，应该总是添加最后一组
// 3. 边界情况处理不当
//
// 正确解法:
function compressCorrect(str) {
  if (!str) return str

  let result = ''
  let count = 1

  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i - 1]) {
      count++
    } else {
      result += str[i - 1] + count
      count = 1
    }
  }

  // 添加最后一组字符
  result += str[str.length - 1] + count

  return result.length < str.length ? result : str
}
// 核心概念: 字符串压缩、连续字符计数、边界处理

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

// 评估点评: ⚠️ 不符合题目要求 - 应该原地旋转
// 问题:
// 1. 题目要求"必须原地旋转图像"，但当前解法创建了新数组
// 2. 空间复杂度O(n²)，不符合原地操作要求
// 3. 算法逻辑正确但不满足约束条件
//
// 原地旋转解法:
function rotateImageInPlace(matrix) {
  const n = matrix.length

  // 先转置矩阵
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      ;[matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
    }
  }

  // 再水平翻转每一行
  for (let i = 0; i < n; i++) {
    matrix[i].reverse()
  }

  return matrix
}

// 更直接的原地旋转:
function rotateImageDirect(matrix) {
  const n = matrix.length

  for (let i = 0; i < Math.floor(n / 2); i++) {
    for (let j = i; j < n - i - 1; j++) {
      const temp = matrix[i][j]
      matrix[i][j] = matrix[n - 1 - j][i]
      matrix[n - 1 - j][i] = matrix[n - 1 - i][n - 1 - j]
      matrix[n - 1 - i][n - 1 - j] = matrix[j][n - 1 - i]
      matrix[j][n - 1 - i] = temp
    }
  }

  return matrix
}
// 核心概念: 原地算法、矩阵变换、空间复杂度优化

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

// 评估点评: ⚠️ 简单但效率不高
// 优点: 代码简洁，逻辑正确
// 问题:
// 1. 时间复杂度O(n)，没有利用数组有序的特性
// 2. findLastIndex方法兼容性问题（ES2022新增）
// 3. 对于大数组效率较低
//
// 高效解法（二分查找）:
function searchRangeOptimal(nums, target) {
  const findFirst = (nums, target) => {
    let left = 0,
      right = nums.length - 1
    let result = -1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (nums[mid] === target) {
        result = mid
        right = mid - 1 // 继续向左查找
      } else if (nums[mid] < target) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }

    return result
  }

  const findLast = (nums, target) => {
    let left = 0,
      right = nums.length - 1
    let result = -1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (nums[mid] === target) {
        result = mid
        left = mid + 1 // 继续向右查找
      } else if (nums[mid] < target) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }

    return result
  }

  return [findFirst(nums, target), findLast(nums, target)]
}
// 核心概念: 二分查找、有序数组优化、时间复杂度O(log n)

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

// 评估点评: ✅ 正确且最优解法
// 优点: 使用双指针技巧，时间复杂度O(n)，空间复杂度O(1)
// 核心概念: 双指针、贪心算法、面积计算
// 算法思路: 总是移动较短的指针，因为移动较长的指针不可能得到更大面积
// 时间复杂度: O(n)，空间复杂度: O(1)

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

// 评估点评: ❌ 算法逻辑完全错误
// 问题:
// 1. 算法思路错误：不是寻找回文子串的正确方法
// 2. 逻辑混乱：record变量的使用没有意义
// 3. 无法正确识别回文：reverseStr和recordStr的比较逻辑错误
// 4. 边界处理不当：没有考虑空字符串等情况
// 5. 可能返回undefined：当result为空时
//
// 正确解法（中心扩展法）:
function longestPalindromeCorrect(s) {
  if (!s || s.length < 2) return s

  let start = 0,
    maxLen = 1

  // 中心扩展函数
  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const currentLen = right - left + 1
      if (currentLen > maxLen) {
        start = left
        maxLen = currentLen
      }
      left--
      right++
    }
  }

  for (let i = 0; i < s.length; i++) {
    // 奇数长度回文（以i为中心）
    expandAroundCenter(i, i)
    // 偶数长度回文（以i和i+1为中心）
    expandAroundCenter(i, i + 1)
  }

  return s.substring(start, start + maxLen)
}

// 动态规划解法:
function longestPalindromeDP(s) {
  if (!s || s.length < 2) return s

  const n = s.length
  const dp = Array.from({ length: n }, () => new Array(n).fill(false))
  let start = 0,
    maxLen = 1

  // 单个字符都是回文
  for (let i = 0; i < n; i++) {
    dp[i][i] = true
  }

  // 检查长度为2的子串
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === s[i + 1]) {
      dp[i][i + 1] = true
      start = i
      maxLen = 2
    }
  }

  // 检查长度大于2的子串
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1
      if (s[i] === s[j] && dp[i + 1][j - 1]) {
        dp[i][j] = true
        start = i
        maxLen = len
      }
    }
  }

  return s.substring(start, start + maxLen)
}
// 核心概念: 回文字符串、中心扩展、动态规划、字符串处理
// 时间复杂度: 中心扩展O(n²)，动态规划O(n²)
// 空间复杂度: 中心扩展O(1)，动态规划O(n²)

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

// 评估点评: ❌ 算法逻辑完全错误（已在前面评估过）
// 问题:
// 1. 完全误解题意：组合总和需要找出所有可能的组合，不是简单的模运算
// 2. 算法逻辑错误：使用模运算无法找到所有组合
// 3. 缺少回溯算法的核心思想
// 4. 无法处理复杂的组合情况
//
// 正确解法（回溯算法）:
function combinationSumCorrect(candidates, target) {
  const result = []

  function backtrack(start, currentCombination, remainingSum) {
    if (remainingSum === 0) {
      result.push([...currentCombination])
      return
    }

    if (remainingSum < 0) {
      return
    }

    for (let i = start; i < candidates.length; i++) {
      currentCombination.push(candidates[i])
      // 可以重复使用同一个数字，所以start还是i
      backtrack(i, currentCombination, remainingSum - candidates[i])
      currentCombination.pop() // 回溯
    }
  }

  candidates.sort((a, b) => a - b) // 排序优化
  backtrack(0, [], target)
  return result
}
// 核心概念: 回溯算法、递归、组合问题、剪枝优化

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

// 评估点评: ❌ 逻辑完全颠倒
// 问题:
// 1. 逻辑错误：Number.isNaN(Number(str)) 返回true表示不是数字，但函数应该返回true表示是有效数字
// 2. 过于简化：没有考虑题目的具体要求和边界情况
// 3. 测试用例验证：isNumber("0") 应该返回true，但当前实现返回false
// 4. 不符合题目要求：题目要求验证特定格式的有效数字
//
// 正确解法（正则表达式）:
function isNumberCorrect(s) {
  // 去除首尾空格
  s = s.trim()
  if (s === '') return false

  // 有效数字的正则表达式
  // ^[+-]? : 可选的正负号
  // (\d+\.?\d*|\.\d+) : 整数部分.小数部分 或 .小数部分
  // ([eE][+-]?\d+)? : 可选的科学计数法部分
  const regex = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/

  return regex.test(s)
}

// 状态机解法:
function isNumberStateMachine(s) {
  s = s.trim()
  if (s === '') return false

  let hasNum = false // 是否见过数字
  let hasE = false // 是否见过e/E
  let hasDot = false // 是否见过小数点
  let hasSign = false // 是否见过符号

  for (let i = 0; i < s.length; i++) {
    const char = s[i]

    if (char >= '0' && char <= '9') {
      hasNum = true
    } else if (char === '.') {
      // 小数点不能在e后面，且只能出现一次
      if (hasE || hasDot) return false
      hasDot = true
    } else if (char === 'e' || char === 'E') {
      // e前面必须有数字，且只能出现一次
      if (hasE || !hasNum) return false
      hasE = true
      hasNum = false // e后面必须有数字
    } else if (char === '+' || char === '-') {
      // 符号只能在开头或e后面
      if (i !== 0 && s[i - 1] !== 'e' && s[i - 1] !== 'E') return false
    } else {
      return false // 无效字符
    }
  }

  return hasNum
}

// 简化版本:
function isNumberSimple(s) {
  return !isNaN(parseFloat(s)) && isFinite(s)
}
// 核心概念: 字符串验证、正则表达式、状态机、数字格式解析
// 时间复杂度: O(n)，空间复杂度: O(1)

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

// 评估点评: ❌ 算法逻辑错误，未正确处理路径规则
// 问题:
// 1. 误解题意：没有正确处理 ".." 返回上级目录的逻辑
// 2. 逻辑错误：简单跳过 "." 字符无法正确处理 "./" 和 "../"
// 3. 边界处理不当：没有考虑根目录和空路径的情况
// 4. 算法设计错误：应该使用栈来处理路径组件
//
// 正确解法（栈方法）:
function simplifyPathCorrect(path) {
  const stack = []
  const components = path.split('/')

  for (const component of components) {
    if (component === '' || component === '.') {
      // 空组件或当前目录，跳过
      continue
    } else if (component === '..') {
      // 返回上级目录
      if (stack.length > 0) {
        stack.pop()
      }
    } else {
      // 正常目录名
      stack.push(component)
    }
  }

  // 构建简化后的路径
  return '/' + stack.join('/')
}

// 一行解法:
function simplifyPathOneLine(path) {
  return (
    '/' +
    path
      .split('/')
      .reduce((stack, dir) => {
        if (dir === '..') stack.pop()
        else if (dir && dir !== '.') stack.push(dir)
        return stack
      }, [])
      .join('/')
  )
}

// 正则表达式预处理版本:
function simplifyPathRegex(path) {
  // 先处理多个连续斜杠
  path = path.replace(/\/+/g, '/')

  const stack = []
  const parts = path.split('/')

  for (const part of parts) {
    if (part === '' || part === '.') {
      continue
    } else if (part === '..') {
      if (stack.length > 0) {
        stack.pop()
      }
    } else {
      stack.push(part)
    }
  }

  const result = '/' + stack.join('/')
  return result === '' ? '/' : result
}
// 核心概念: 栈数据结构、路径解析、字符串处理、Unix文件系统
// 时间复杂度: O(n)，空间复杂度: O(n)

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

// 评估点评: ⚠️ 基本正确但有严重性能问题
// 优点:
// 1. 基本逻辑正确：使用Map存储键值对，数组维护访问顺序
// 2. 容量控制正确：超出容量时删除最旧的元素
// 3. 访问更新正确：get时将元素移到最新位置
//
// 问题:
// 1. 性能问题：indexOf和splice操作时间复杂度O(n)，导致get操作效率低
// 2. 边界处理：没有处理key已存在的put操作
// 3. 值检查错误：if (!value) 无法区分值为0、false、空字符串的情况
// 4. 缺少容量边界检查
//
// 高效解法（双向链表 + Map）:
class LRUCacheOptimal {
  constructor(capacity) {
    this.capacity = capacity
    this.cache = new Map()

    // 创建虚拟头尾节点
    this.head = { key: -1, value: -1 }
    this.tail = { key: -1, value: -1 }
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  // 添加节点到头部
  addToHead(node) {
    node.prev = this.head
    node.next = this.head.next
    this.head.next.prev = node
    this.head.next = node
  }

  // 移除节点
  removeNode(node) {
    node.prev.next = node.next
    node.next.prev = node.prev
  }

  // 移动节点到头部
  moveToHead(node) {
    this.removeNode(node)
    this.addToHead(node)
  }

  // 移除尾部节点
  removeTail() {
    const last = this.tail.prev
    this.removeNode(last)
    return last
  }

  get(key) {
    const node = this.cache.get(key)
    if (!node) return -1

    // 移动到头部（标记为最近使用）
    this.moveToHead(node)
    return node.value
  }

  put(key, value) {
    const node = this.cache.get(key)

    if (node) {
      // 更新现有节点
      node.value = value
      this.moveToHead(node)
    } else {
      // 创建新节点
      const newNode = { key, value }

      if (this.cache.size >= this.capacity) {
        // 删除最久未使用的节点
        const tail = this.removeTail()
        this.cache.delete(tail.key)
      }

      this.addToHead(newNode)
      this.cache.set(key, newNode)
    }
  }
}

// 使用Map的插入顺序特性的简化版本:
class LRUCacheSimple {
  constructor(capacity) {
    this.capacity = capacity
    this.cache = new Map()
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)
      // 重新插入以更新顺序
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    return -1
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // 更新现有键
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      // 删除最旧的键（Map的第一个键）
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, value)
  }
}
// 核心概念: LRU缓存、双向链表、Map数据结构、时间复杂度优化
// 时间复杂度: 优化版O(1)，原版get操作O(n)
// 空间复杂度: O(capacity)

/*
=== 第二阶段练习题整体评估总结 ===

经过详细评估，发现以下主要问题：

❌ 严重错误的题目 (需要重写):
- 第52题 canJump: 完全误解题意，不理解跳跃游戏的规则
- 第53题 binarySearch: 二分查找算法实现错误，缺少边界维护
- 第55题 wordPattern: 缺少双向映射检查，逻辑不完整
- 第58题 compress: 字符比较逻辑错误，边界处理不当
- 第65题 combinationSum: 算法逻辑完全错误，误用模运算

⚠️ 需要改进的题目:
- 第54题 letterCombinations: 基本正确但可以用回溯算法优化
- 第56题 longestCommonPrefix: 边界条件处理错误
- 第59题 rotateImage: 不符合原地旋转要求
- 第60题 searchRange: 效率不高，未利用有序数组特性

✅ 正确且优秀的解法:
- 第51题 isValidSudoku: 使用Set高效检测重复
- 第57题 countAndSay: 正确实现外观数列生成
- 第61题 maxArea: 双指针算法最优解

主要问题类型:
1. 算法理解错误 - 多个题目完全误解了算法要求
2. 数据结构应用不当 - 未选择合适的数据结构
3. 边界条件处理不完善 - 缺少对特殊情况的考虑
4. 效率优化不足 - 未利用题目特性进行优化
5. 约束条件忽视 - 不满足题目的特殊要求（如原地操作）

重点需要加强的知识点:
1. 回溯算法和递归思想
2. 二分查找的正确实现
3. 双指针技巧的应用
4. 动态规划基础
5. 字符串处理算法
6. 图论和树的遍历

建议:
1. 重点复习算法基础，特别是回溯和递归
2. 加强对题目约束条件的理解
3. 练习常见算法模板的标准实现
4. 重视边界情况和异常处理
5. 学习时间复杂度分析和优化技巧
*/
