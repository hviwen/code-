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
function rotateImage(arr){
  if(arr.length === 0) return []
  const _arr = [...arr]



}