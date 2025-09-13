/***
### 1. 第一个单词
**描述**：编写一个函数，返回给定文本中的第一个单词。
- 文本可以包含 a-z, A-Z, 0-9, 空格和标点符号。
- 第一个单词是第一个连续的非空格字符序列。

**输入**：字符串 (1-1000 个字符)
**输出**：字符串

**示例**：
```javascript
firstWord("Hello world") // 返回 "Hello"
firstWord("a word") // 返回 "a"
firstWord("hi!") // 返回 "hi"
```*/
function firstWord(text) {
  const m = text.match(/[A-Za-z0-9]+/)
  return m ? m[0] : ''
}

// 评估点评: ✅ 正确且最佳解法
// 优点: 使用正则表达式简洁高效，正确匹配字母和数字组合
// 核心概念: 正则表达式、条件运算符、字符串匹配
// 时间复杂度: O(n)，空间复杂度: O(1)

/*
### 2. 连续三个单词
**描述**：编写一个函数，检查输入字符串是否至少包含三个连续的单词。
- 单词是由字母组成并由空格分隔的序列。
- 数字不被视为单词。

**输入**：字符串 (1-1000 个字符)
**输出**：布尔值

**示例**：
```javascript
threeWords("Hello World hello") // 返回 true
threeWords("He is 123 man") // 返回 false
threeWords("1 2 3 4") // 返回 false
```*/
function threeWords(text) {
  text = text.trim()
  return text.split(' ').length === 3
}

// 评估点评: ❌ 错误解法 - 完全误解题意
// 问题:
// 1. 题目要求检查是否有"三个连续的单词"，不是总共三个单词
// 2. 需要验证单词只包含字母，数字不算单词
// 3. 当前解法只检查总单词数是否为3
//
// 正确解法:
function threeWordsCorrect(text) {
  const words = text.split(/\s+/).filter(word => /^[a-zA-Z]+$/.test(word))
  let consecutiveCount = 0
  let maxConsecutive = 0

  for (const word of text.split(/\s+/)) {
    if (/^[a-zA-Z]+$/.test(word)) {
      consecutiveCount++
      maxConsecutive = Math.max(maxConsecutive, consecutiveCount)
    } else {
      consecutiveCount = 0
    }
  }
  return maxConsecutive >= 3
}
// 核心概念: 正则表达式验证、连续计数算法、字符串分割

/*
### 3. 最高价格
**描述**：编写一个函数，返回最贵物品的列表。
- 输入是一个包含 "name" 和 "price" 属性的对象数组。
- 输出是按价格降序排列的前 k 个物品数组。

**输入**：数字 k，对象数组
**输出**：对象数组

**示例**：
```javascript
biggerPrice(2, [
  {"name": "bread", "price": 100},
  {"name": "wine", "price": 138},
  {"name": "meat", "price": 15},
  {"name": "water", "price": 1}
]) // 返回 [{"name": "wine", "price": 138}, {"name": "bread", "price": 100}]
```*/
function biggerPrice(num, arr) {
  arr.sort((a, b) => b['price'] - a['price'])
  return arr.splice(0, num)
}

// 评估点评: ⚠️ 基本正确但有改进空间
// 优点: 逻辑正确，使用sort和splice实现需求
// 问题:
// 1. 修改了原数组(splice会改变原数组)，违反函数式编程原则
// 2. 使用括号访问属性不如点号访问简洁
//
// 改进解法:
function biggerPriceImproved(num, arr) {
  return [...arr].sort((a, b) => b.price - a.price).slice(0, num)
}
// 核心概念: 数组排序、浅拷贝避免副作用、slice vs splice

/*
### 4. 常见单词
**描述**：编写一个函数，计算文本中每个单词出现的次数。
- 单词应转换为小写。
- 单词由空格、换行符和制表符分隔。

**输入**：字符串文本，字符串数组单词
**输出**：对象 (键为单词，值为计数)

**示例**：
```javascript
popularWords(`
When I was One
I had just begun
When I was Two
I was nearly new`, ['i', 'was', 'three', 'near'])
// 返回 { i: 4, was: 3, three: 0, near: 0 }
```
*/
function popularWords(str, arr = []) {
  const strArr = str
    .split(' ')
    .map(i => `${i}`.toLowerCase())
    .map(i => (i.includes('\n') ? i.split('\n') : i))
    .flat(Infinity)
    .filter(i => i)

  const map = new Map()
  if (strArr.length) {
    for (const item of strArr) {
      if (map.has(item)) {
        let count = map.get(item)
        map.set(item, ++count)
      } else {
        map.set(item, 1)
      }
    }
  }

  const result = {}
  for (const key of arr) {
    result[key] = 0
    if (map.has(key)) {
      result[key] = map.get(key)
    }
  }

  return result
}

// 评估点评: ⚠️ 逻辑正确但过于复杂
// 优点: 正确处理换行符和制表符，使用Map统计频率
// 问题:
// 1. 处理空白字符的方式过于复杂
// 2. 可以使用正则表达式简化分割逻辑
// 3. Map计数逻辑可以简化
//
// 改进解法:
function popularWordsImproved(str, arr = []) {
  // 使用正则表达式分割所有空白字符
  const words = str
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word)

  // 使用Map统计词频
  const wordCount = new Map()
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1)
  })

  // 构建结果对象
  const result = {}
  arr.forEach(word => {
    result[word] = wordCount.get(word) || 0
  })

  return result
}
// 核心概念: 正则表达式、Map数据结构、词频统计算法

/*
### 5. 第二个索引
**描述**：在字符串中找到子字符串的第二次出现位置。
- 如果子字符串只出现一次或不出现，则返回 undefined。

**输入**：字符串文本，字符串子字符串
**输出**：数字或 undefined

**示例**：
```javascript
secondIndex("sims", "s") // 返回 3
secondIndex("find the river", "e") // 返回 12
secondIndex("hi", "h") // 返回 undefined
```*/
function secondIndex(str, targetKey) {
  const strArr = str.split('')
  const index = strArr.indexOf(targetKey)
  if (index === -1) {
    return undefined
  }
  const scendIndex = strArr.indexOf(targetKey, index + 1)
  if (scendIndex === -1) {
    return undefined
  }
  return scendIndex
}

// 评估点评: ⚠️ 逻辑正确但效率不佳
// 优点: 逻辑清晰，正确处理边界情况
// 问题:
// 1. 不需要将字符串转换为数组，字符串本身支持indexOf
// 2. 变量名有拼写错误(scendIndex应为secondIndex)
//
// 改进解法:
function secondIndexImproved(str, targetKey) {
  const firstIndex = str.indexOf(targetKey)
  if (firstIndex === -1) return undefined

  const secondIndex = str.indexOf(targetKey, firstIndex + 1)
  return secondIndex === -1 ? undefined : secondIndex
}
// 核心概念: 字符串indexOf方法、条件运算符、边界处理

/*
### 6. 标记之间
**描述**：提取两个标记之间的子字符串。
- 标记包含在原始字符串中，但不包含在结果中。

**输入**：字符串文本，字符串标记1，字符串标记2
**输出**：字符串

**示例**：
```javascript
betweenMarkers("What is >apple<", ">", "<") // 返回 "apple"
betweenMarkers("<head><title>My page</title></head>", "<title>", "</title>") // 返回 "My page"
```*/
function betweenMarkers(str, markLeft, markRight) {
  const ll = markLeft.length
  const lIndex = str.indexOf(markLeft)
  const rIndex = str.indexOf(markRight)

  if (lIndex === -1 || rIndex === -1) return null
  return str.slice(lIndex + ll, rIndex)
}

// 评估点评: ⚠️ 基本正确但有逻辑缺陷
// 优点: 使用indexOf和slice方法，逻辑清晰
// 问题:
// 1. 没有考虑右标记在左标记之前的情况
// 2. 没有考虑右标记应该在左标记之后查找
// 3. 返回null不符合题目要求(应该返回空字符串)
//
// 改进解法:
function betweenMarkersImproved(str, markLeft, markRight) {
  const leftIndex = str.indexOf(markLeft)
  if (leftIndex === -1) return ''

  const startPos = leftIndex + markLeft.length
  const rightIndex = str.indexOf(markRight, startPos)
  if (rightIndex === -1) return ''

  return str.slice(startPos, rightIndex)
}
// 核心概念: 字符串查找、位置计算、边界处理

/*
### 7. Fizz Buzz
**描述**：编写一个函数，如果数字能被 3 整除返回 "Fizz"，能被 5 整除返回 "Buzz"，同时能被 3 和 5 整除返回 "FizzBuzz"，否则返回该数字的字符串形式。

**输入**：数字 (1-1000)
**输出**：字符串

**示例**：
```javascript
fizzBuzz(15) // 返回 "FizzBuzz"
fizzBuzz(6) // 返回 "Fizz"
fizzBuzz(5) // 返回 "Buzz"
fizzBuzz(7) // 返回 "7"
```*/
function fizzBuzz(num) {
  if (num % 3 === 0 && num % 5 === 0) return 'FizzBuzz'
  if (num % 3 === 0) return 'Fizz'
  if (num % 5 === 0) return 'Buzz'
  return `${num}`
}

// 评估点评: ✅ 正确且经典解法
// 优点: 逻辑清晰，条件判断顺序正确
// 核心概念: 模运算、条件判断、字符串模板
// 替代解法: 可以使用数组join或三元运算符，但当前解法最易读

/*
### 8. 偶数索引与最后一个
**描述**：计算偶数索引 (0, 2, 4...) 处元素的和，并乘以最后一个元素。
- 如果数组为空，返回 0。

**输入**：数字数组
**输出**：数字

**示例**：
```javascript
evenLast([0, 1, 2, 3, 4, 5]) // 返回 30
evenLast([1, 3, 5]) // 返回 30
evenLast([6]) // 返回 36
```*/
function evenLast(arr) {
  if (arr.length === 0) return []
  const last = arr[arr.length - 1]
  const sum = arr.reduce((prev, current, i) => {
    if (i % 2 === 0) {
      return current + prev
    } else {
      return prev
    }
  }, 0)

  return sum * last
}

// 评估点评: ❌ 逻辑错误
// 问题:
// 1. 空数组应该返回0，不是空数组[]
// 2. reduce逻辑正确但可以简化
//
// 改进解法:
function evenLastImproved(arr) {
  if (arr.length === 0) return 0

  const evenSum = arr.filter((_, index) => index % 2 === 0).reduce((sum, val) => sum + val, 0)

  return evenSum * arr[arr.length - 1]
}
// 核心概念: 数组过滤、reduce累加、索引判断

/*
### 9. 秘密信息
**描述**：从文本中提取秘密信息，收集所有大写字母。

**输入**：字符串 (1-1000 个字符)
**输出**：字符串

**示例**：
```javascript
secretMessage("How are you? Eh, ok. Low or Lower? Ohhh.") // 返回 "HELLO"
secretMessage("hello world!") // 返回 ""
```*/
function secretMessage(str) {
  const m = str.match(/[A-Z]+/g)
  if (!m) return ''

  return m[0].join('')
}

// 评估点评: ❌ 严重错误
// 问题:
// 1. match(/[A-Z]+/g)返回的是字符串数组，不是字符数组
// 2. m[0]是字符串，字符串没有join方法
// 3. 只取了第一个匹配组，应该取所有大写字母
//
// 正确解法:
function secretMessageCorrect(str) {
  const matches = str.match(/[A-Z]/g)
  return matches ? matches.join('') : ''
}
// 核心概念: 正则表达式全局匹配、数组join方法

/*
### 10. 查找所有出现位置
**描述**：在字符串中查找子字符串的所有出现位置。
- 返回子字符串开始位置的索引数组。

**输入**：字符串文本，字符串子字符串
**输出**：数字数组

**示例**：
```javascript
findOccurrences("Hello, hello, hello, world!", "hello") // 返回 [7, 14]
findOccurrences("Hello, hello, hello, world!", "Hello") // 返回 [0]
```*/
function findOccurrences(str, target) {
  const result = []
  let index = str.indexOf(target)
  while (index !== -1) {
    result.push(index)
    index = str.indexOf(target, index + 1)
  }
  return result
}

// 评估点评: ✅ 正确且高效解法
// 优点: 使用while循环和indexOf，逻辑清晰，性能良好
// 核心概念: 字符串查找、循环控制、数组构建
// 时间复杂度: O(n*m)，其中n是字符串长度，m是匹配次数

/*
### 11. 数字求和
**描述**：计算字符串中所有数字的和。
- 数字是由非数字字符分隔的数字序列。

**输入**：字符串 (1-1000 个字符)
**输出**：数字

**示例**：
```javascript
sumNumbers("hi 5 there 6") // 返回 11
sumNumbers("This picture is worth 1000 words") // 返回 1000
```*/
function sumNumbers(str) {
  const strArr = str.split(' ') || []

  return strArr
    .map(i => Number(i))
    .filter(i => !Number.isNaN(i))
    .reduce((prev, current) => prev + current, 0)
}

// 评估点评: ⚠️ 逻辑有缺陷
// 问题:
// 1. 只按空格分割，无法处理其他分隔符(如标点符号)
// 2. 无法正确提取"hi5there6"中的数字
// 3. reduce中的第三个参数i未使用
//
// 改进解法:
function sumNumbersImproved(str) {
  const numbers = str.match(/\d+/g) || []
  return numbers.reduce((sum, num) => sum + parseInt(num), 0)
}
// 核心概念: 正则表达式提取数字、parseInt转换、reduce累加

/*
### 12. 三个连续数字
**描述**：检查数组是否包含三个具有相同值的连续数字。

**输入**：数字数组 (1-100 个元素)
**输出**：布尔值

**示例**：
```javascript
threeConsecutive([1, 1, 1, 2, 2]) // 返回 true
threeConsecutive([1, 1, 2, 1, 1]) // 返回 false
```*/
function threeConsecutive(arr) {
  for (let i = 0; i < arr.length - 2; i++) {
    if (arr[i] === arr[i + 1] && arr[i] === arr[i + 2]) {
      return true
    }
  }
  return false
}

// 评估点评: ✅ 正确且高效解法
// 优点: 逻辑清晰，一次遍历即可找到结果，提前返回优化性能
// 核心概念: 数组遍历、条件判断、短路求值
// 时间复杂度: O(n)，空间复杂度: O(1)

/*
### 13. 首字母大写
**描述**：将字符串中每个单词的首字母大写。

**输入**：字符串 (1-1000 个字符)
**输出**：字符串

**示例**：
```javascript
capitalizeFirst("hello world") // 返回 "Hello World"
capitalizeFirst("i love js") // 返回 "I Love Js"
```*/
function capitalizeFirst(text) {
  const strArr = text.split(' ')
  return strArr.map(i => `${i}`.charAt(0).toUpperCase() + `${i}`.substring(1)).join(' ')
}

// 评估点评: ⚠️ 基本正确但可以优化
// 优点: 逻辑正确，使用map和join处理
// 问题:
// 1. 不必要的字符串模板转换`${i}`
// 2. 没有处理空字符串的情况
//
// 改进解法:
function capitalizeFirstImproved(text) {
  return text
    .split(' ')
    .map(word => (word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ')
}
// 核心概念: 字符串分割、数组映射、字符串切片

/*
### 14. 数字乘法
**描述**：计算数字中所有数位的乘积。

**输入**：数字 (1-10^9)
**输出**：数字

**示例**：
```javascript
digitMultiplication(123) // 返回 6
digitMultiplication(9876) // 返回 3024
```*/
function digitMultiplication(num) {
  return `${num}`
    .split('')
    .map(i => Number(i))
    .reduce((prev, current) => prev * current, 1)
}

// 评估点评: ✅ 正确且简洁解法
// 优点: 使用函数式编程风格，链式调用清晰
// 核心概念: 字符串转换、数组映射、reduce累积
// 注意: 修复了未使用的参数i

/*
### 15. 反向字符串
**描述**：反转字符串。

**输入**：字符串 (1-1000 个字符)
**输出**：字符串

**示例**：
```javascript
backwardString("hello") // 返回 "olleh"
backwardString("world") // 返回 "dlrow"
```*/
function backwardString(text) {
  return (text.split('') || []).reverse().join('')
}

// 评估点评: ⚠️ 基本正确但有冗余
// 优点: 使用经典的split-reverse-join模式
// 问题:
// 1. split('')永远不会返回null，所以|| []是多余的
// 2. 可以使用更现代的方法
//
// 改进解法:
function backwardStringImproved(text) {
  return text.split('').reverse().join('')
  // 或者使用扩展运算符: return [...text].reverse().join('')
}
// 核心概念: 字符串反转、数组方法链式调用

/*
### 16. 移除指定值之前的所有元素
**描述**：移除数组中给定值之前的所有元素。
- 如果数组中不存在该值，则返回原始数组。

**输入**：数组，值
**输出**：数组

**示例**：
```javascript
removeAllBefore([1, 2, 3, 4, 5], 3) // 返回 [3, 4, 5]
removeAllBefore([1, 1, 2, 2, 3, 3], 2) // 返回 [2, 2, 3, 3]
```*/
function removeAllBefore(arr = [], key) {
  const index = arr.indexOf(key)
  if (index === -1) return arr
  return arr.splice(index)
}

// 评估点评: ⚠️ 修改原数组的问题
// 优点: 逻辑正确，使用indexOf查找位置
// 问题:
// 1. splice会修改原数组，违反函数式编程原则
// 2. 应该返回新数组而不是修改原数组
//
// 改进解法:
function removeAllBeforeImproved(arr = [], key) {
  const index = arr.indexOf(key)
  return index === -1 ? [...arr] : arr.slice(index)
}
// 核心概念: 数组查找、slice vs splice、避免副作用

/*
### 17. 全部相同
**描述**：检查数组中的所有元素是否相等。

**输入**：数组
**输出**：布尔值

**示例**：
```javascript
allTheSame([1, 1, 1]) // 返回 true
allTheSame([1, 2, 1]) // 返回 false
```*/
function allTheSame(arr) {
  return arr.every(i => i === arr[0])
}

// 评估点评: ✅ 正确且最优解法
// 优点: 使用every方法简洁高效，逻辑清晰
// 核心概念: 数组every方法、比较操作
// 时间复杂度: O(n)，但在发现不同元素时会提前返回

/*
### 18. 数字计数
**描述**：计算字符串中数字的个数。

**输入**：字符串 (1-1000 个字符)
**输出**：数字

**示例**：
```javascript
countDigits("hi") // 返回 0
countDigits("who is 1st here") // 返回 1
countDigits("my numbers is 2") // 返回 1
```*/
function countDigits(str) {
  return (str.split('') || [])
    .filter(i => i !== ' ')
    .map(i => Number(i))
    .filter(i => !Number.isNaN(i)).length
}

// 评估点评: ⚠️ 逻辑复杂且有问题
// 问题:
// 1. 过于复杂的处理流程
// 2. 只过滤空格，没有过滤其他非数字字符
// 3. 不必要的Number转换和NaN检查
//
// 改进解法:
function countDigitsImproved(str) {
  return (str.match(/\d/g) || []).length
}
// 核心概念: 正则表达式匹配数字、简洁的解决方案

/*
### 19. 开头零的数量
**描述**：计算字符串开头连续零的数量。

**输入**：字符串 (1-1000 个只包含数字的字符)
**输出**：数字

**示例**：
```javascript
beginningZeros("100") // 返回 0
beginningZeros("001") // 返回 2
beginningZeros("00100") // 返回 2
```*/
function beginningZeros(text) {
  let count = 0
  for (const item of text) {
    if (Number(item) === 0) {
      count++
    } else {
      break
    }
  }
  return count
}

// 评估点评: ⚠️ 逻辑正确但可以优化
// 优点: 逻辑清晰，正确处理连续零的计数
// 问题:
// 1. Number('0') === 0 可以简化为 item === '0'
// 2. 可以使用更简洁的方法
//
// 改进解法:
function beginningZerosImproved(text) {
  const match = text.match(/^0*/)
  return match ? match[0].length : 0
}
// 核心概念: 正则表达式匹配开头零、字符串比较

/*
### 20. 拆分成对
**描述**：将字符串拆分为两个字符一组。
- 如果字符串长度为奇数，则在最后一对中添加下划线。

**输入**：字符串
**输出**：字符串数组

**示例**：
```javascript
splitPairs("abcd") // 返回 ["ab", "cd"]
splitPairs("abc") // 返回 ["ab", "c_"]
```*/
function splitPairs(text) {
  text = (text.length % 2 === 0 ? text : `${text}_`).split('')
  const result = []
  for (let i = 0; i < text.length; i++) {
    result.push(`${text[i]}${text[++i]}`)
  }
  return result
}

// 评估点评: ⚠️ 逻辑正确但风格有问题
// 优点: 正确处理奇数长度字符串，添加下划线
// 问题:
// 1. 在循环中使用++i可能造成混淆
// 2. 可以使用更清晰的步长循环
//
// 改进解法:
function splitPairsImproved(text) {
  if (text.length % 2 === 1) text += '_'
  const result = []
  for (let i = 0; i < text.length; i += 2) {
    result.push(text.slice(i, i + 2))
  }
  return result
}
// 核心概念: 字符串切片、步长循环、条件处理

/*
### 21. 最接近的值
**描述**：在集合中找到最接近给定值的数。
- 如果两个值距离相等，则返回较小的一个。

**输入**：数字集合，数字
**输出**：数字

**示例**：
```javascript
nearestValue(new Set([4, 7, 10, 11, 12, 17]), 9) // 返回 10
nearestValue(new Set([4, 7, 10, 11, 12, 17]), 8) // 返回 7
```*/
function nearestValue(set, key) {
  const map = new Map()
  for (const i of set) {
    map.set(i, Math.abs(i - key))
  }
  const sortMap = Array.from(map.entries()).sort((a, b) => a[1] - b[1])
  return sortMap[0][0]
}

// 评估点评: ⚠️ 逻辑正确但过于复杂
// 优点: 正确计算距离并排序
// 问题:
// 1. 使用Map存储距离过于复杂
// 2. 没有处理距离相等时返回较小值的要求
//
// 改进解法:
function nearestValueImproved(set, key) {
  let nearest = null
  let minDistance = Infinity

  for (const value of set) {
    const distance = Math.abs(value - key)
    if (distance < minDistance || (distance === minDistance && value < nearest)) {
      nearest = value
      minDistance = distance
    }
  }
  return nearest
}
// 核心概念: 距离计算、最值查找、条件比较

/*
### 22. 最大数位
**描述**：找出数字中的最大数位。

**输入**：数字 (0-10^6)
**输出**：数字

**示例**：
```javascript
maxDigit(0) // 返回 0
maxDigit(52) // 返回 5
maxDigit(634) // 返回 6
```*/
function maxDigit(num) {
  if (num === 0) return 0
  return Number(`${num}`.charAt(0))
}

// 评估点评: ❌ 完全错误的解法
// 问题:
// 1. 只返回第一个数字，不是最大数字
// 2. 题目要求找出所有数位中的最大值
//
// 正确解法:
function maxDigitCorrect(num) {
  return Math.max(...String(num).split('').map(Number))
}
// 或者:
function maxDigitCorrect2(num) {
  let max = 0
  while (num > 0) {
    max = Math.max(max, num % 10)
    num = Math.floor(num / 10)
  }
  return max
}
// 核心概念: 数位分离、Math.max、扩展运算符

/*
### 23. 替换第一个元素
**描述**：从数组中移除第一个元素并将其添加到末尾。
- 如果数组为空，则返回空数组。

**输入**：数组
**输出**：数组

**示例**：
```javascript
replaceFirst([1, 2, 3, 4]) // 返回 [2, 3, 4, 1]
replaceFirst([1]) // 返回 [1]
replaceFirst([]) // 返回 []
```*/
function replaceFirst(arr) {
  if (arr.length === 0) return arr
  const head = arr.shift()
  arr.push(head)
  return arr
}

// 评估点评: ⚠️ 修改原数组的问题
// 优点: 逻辑正确，边界处理得当
// 问题:
// 1. shift()和push()会修改原数组，违反函数式编程原则
// 2. 应该返回新数组而不是修改原数组
//
// 改进解法:
function replaceFirstImproved(arr) {
  if (arr.length === 0) return []
  return [...arr.slice(1), arr[0]]
}
// 核心概念: 数组切片、扩展运算符、避免副作用

/*
### 24. 元音字母计数
**描述**：计算字符串中元音字母 (a, e, i, o, u) 的数量。
- 忽略大小写。

**输入**：字符串 (1-1000 个字符)
**输出**：数字

**示例**：
```javascript
countVowels("Hello") // 返回 2
countVowels("AEIOU") // 返回 5
```*/
function countVowels(text) {
  const base = ['a', 'e', 'i', 'o', 'u']
  let count = 0
  for (const item of text) {
    if (base.includes(`${item}`.toLowerCase())) {
      count++
    }
  }
  return count
}

// 评估点评: ⚠️ 基本正确但可以优化
// 优点: 逻辑正确，处理大小写
// 问题:
// 1. 不必要的字符串模板转换`${item}`
// 2. 可以使用更简洁的方法
//
// 改进解法:
function countVowelsImproved(text) {
  return (text.match(/[aeiou]/gi) || []).length
}
// 或者使用filter:
function countVowelsImproved2(text) {
  return text
    .toLowerCase()
    .split('')
    .filter(char => 'aeiou'.includes(char)).length
}
// 核心概念: 正则表达式、字符串匹配、函数式编程

/*
### 25. 是否为偶数
**描述**：检查一个数字是否为偶数。

**输入**：数字 (整数)
**输出**：布尔值

**示例**：
```javascript
isEven(2) // 返回 true
isEven(5) // 返回 false
isEven(0) // 返回 true
```*/
function isEven(num) {
  return num % 2 === 0
}

// 评估点评: ✅ 正确且最优解法
// 优点: 简洁明了，使用模运算符直接判断
// 核心概念: 模运算、布尔值返回
// 时间复杂度: O(1)，空间复杂度: O(1)

/*
### 26. 按元素频率排序数组
**描述**：按元素频率对数组进行排序，频率最高的元素排在前面。
- 如果两个元素频率相同，则保持原始顺序。

**输入**：数组
**输出**：数组

**示例**：
```javascript
frequencySort([4, 6, 2, 2, 6, 4, 4, 4]) // 返回 [4, 4, 4, 4, 6, 6, 2, 2]
frequencySort(['bob', 'bob', 'carl', 'alex', 'bob']) // 返回 ['bob', 'bob', 'bob', 'carl', 'alex']
```*/
function frequencySort(arr) {
  const map = new Map()
  for (const item of arr) {
    if (!map.has(item)) {
      map.set(item, 1)
    } else {
      let count = map.get(item)
      map.set(item, ++count)
    }
  }
  const result = []
  map.forEach((value, key) => {
    result.push(Array.from({ length: value }).fill(key))
  })

  return result.flat(Infinity)
}

// 评估点评: ❌ 逻辑错误 - 没有按频率排序
// 问题:
// 1. 题目要求按频率降序排序，但代码没有排序
// 2. 没有保持原始顺序的要求
// 3. forEach的第三个参数map未使用
//
// 正确解法:
function frequencySortCorrect(arr) {
  const freqMap = new Map()

  // 统计频率
  for (const item of arr) {
    freqMap.set(item, (freqMap.get(item) || 0) + 1)
  }

  // 按频率排序，频率相同时保持原始顺序
  return arr.sort((a, b) => {
    const freqDiff = freqMap.get(b) - freqMap.get(a)
    if (freqDiff !== 0) return freqDiff
    return arr.indexOf(a) - arr.indexOf(b) // 保持原始顺序
  })
}
// 核心概念: 频率统计、自定义排序、稳定排序

/*
### 27. 时间转换
**描述**：将时间从 24 小时制转换为 12 小时制。

**输入**：24 小时制格式的字符串时间 "HH:MM"
**输出**：12 小时制格式的字符串时间 "H:MM A.M./P.M."

**示例**：
```javascript
timeConverter("12:30") // 返回 "12:30 P.M."
timeConverter("09:00") // 返回 "9:00 A.M."
timeConverter("23:15") // 返回 "11:15 P.M."
```*/
function timeConverter(time) {
  let [h, m] = time.split(':').map(i => parseInt(i))
  if (h >= 24 || h < 0) return
  if (h >= 0 && h < 12) return `${h}:${m} A.M.`
  if (h === 12) return `${h}:${m} P.M.`
  h = h - 12
  return `${h}:${m} P.M.`
}

// 评估点评: ⚠️ 逻辑有缺陷
// 问题:
// 1. h=0时应该显示为12:XX A.M.，不是0:XX A.M.
// 2. 分钟数可能需要补零(如09:05)
// 3. 边界检查不完整
//
// 改进解法:
function timeConverterImproved(time) {
  let [h, m] = time.split(':').map(Number)

  if (h < 0 || h >= 24) return undefined

  const period = h < 12 ? 'A.M.' : 'P.M.'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const minute = m.toString().padStart(2, '0')

  return `${hour12}:${minute} ${period}`
}
// 核心概念: 时间格式转换、条件判断、字符串格式化

/*
### 28. 非唯一元素
**描述**：从数组中移除所有唯一元素，只保留出现多次的元素。
- 应保留原始顺序。

**输入**：数组
**输出**：数组

**示例**：
```javascript
nonUniqueElements([1, 2, 3, 1, 3]) // 返回 [1, 3, 1, 3]
nonUniqueElements([1, 2, 3, 4, 5]) // 返回 []
nonUniqueElements([5, 5, 5, 5, 5]) // 返回 [5, 5, 5, 5, 5]
```*/
function nonUniqueElements(arr = []) {
  const map = new Map()

  for (const i of arr) {
    if (!map.has(i)) {
      map.set(i, 1)
    } else {
      let count = map.get(i)
      map.set(i, ++count)
    }
  }
  const baseFilter = []
  map.forEach((key, value) => {
    if (key === 1) {
      baseFilter.push(value)
    }
  })
  return arr.filter(i => !baseFilter.includes(i))
}

// 评估点评: ❌ 逻辑错误 - 参数顺序混乱
// 问题:
// 1. forEach的参数顺序错误，应该是(value, key)而不是(key, value)
// 2. 逻辑混乱，应该检查频率是否大于1
// 3. 可以使用更简洁的方法
//
// 正确解法:
function nonUniqueElementsCorrect(arr = []) {
  const countMap = new Map()

  // 统计频率
  for (const item of arr) {
    countMap.set(item, (countMap.get(item) || 0) + 1)
  }

  // 过滤出现次数大于1的元素
  return arr.filter(item => countMap.get(item) > 1)
}
// 核心概念: 频率统计、数组过滤、Map数据结构

/*
### 29. 日期转换
**描述**：将日期从 "YYYY-MM-DD" 格式转换为 "DD.MM.YYYY" 格式。

**输入**："YYYY-MM-DD" 格式的字符串日期
**输出**："DD.MM.YYYY" 格式的字符串日期

**示例**：
```javascript
dateConverter("2021-01-15") // 返回 "15.01.2021"
dateConverter("1970-12-31") // 返回 "31.12.1970"
```*/
function dateConverter(time) {
  const [y, m, d] = time.split('-')
  return `${d}.${m}.${y}`
}

// 评估点评: ✅ 正确且简洁解法
// 优点: 使用解构赋值，代码简洁明了
// 核心概念: 解构赋值、字符串分割、模板字符串
// 时间复杂度: O(n)，空间复杂度: O(1)

/*
### 30. 最频繁元素
**描述**：在数组中找到出现频率最高的元素。
- 如果有多个元素具有相同的最高频率，则返回最先遇到的元素。

**输入**：数组
**输出**：任意数据类型

**示例**：
```javascript
mostFrequent([3, 1, 3, 1, 1]) // 返回 1
mostFrequent(["a", "b", "c", "a", "b", "a"]) // 返回 "a"
```*/
function mostFrequent(arr) {
  let map = new Map()
  for (const i of arr) {
    if (!map.has(i)) {
      map.set(i, 1)
    } else {
      let count = map.get(i)
      map.set(i, ++count)
    }
  }
  map = Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  return map[0][0]
}

// 评估点评: ⚠️ 逻辑正确但不符合题目要求
// 优点: 正确统计频率并排序
// 问题:
// 1. 题目要求返回"最先遇到"的元素，但排序会改变顺序
// 2. 频率统计可以简化
//
// 改进解法:
function mostFrequentImproved(arr) {
  const freqMap = new Map()
  let maxFreq = 0
  let result = arr[0]

  for (const item of arr) {
    const freq = (freqMap.get(item) || 0) + 1
    freqMap.set(item, freq)

    if (freq > maxFreq) {
      maxFreq = freq
      result = item
    }
  }

  return result
}
// 核心概念: 频率统计、一次遍历、保持原始顺序

/*
### 31. 展平列表
**描述**：将嵌套数组展平为单层数组。
- 数组可以有多层嵌套。

**输入**：嵌套数组
**输出**：展平后的数组

**示例**：
```javascript
flattenArray([1, 2, [3, 4, [5, 6], 7], 8]) // 返回 [1, 2, 3, 4, 5, 6, 7, 8]
flattenArray([1, [2, 3]]) // 返回 [1, 2, 3]
```*/
function flattenArray(arr) {
  return arr.flat(Infinity)
}

// 评估点评: ✅ 正确且最优解法
// 优点: 使用ES2019的flat方法，简洁高效
// 核心概念: 数组扁平化、ES6+特性
// 替代方案: 递归实现，但内置方法更优

/*
### 32. 密码验证器
**描述**：编写一个函数，根据以下规则验证密码：
- 至少 8 个字符长
- 同时包含大写和小写字母
- 至少有一个数字
- 至少包含一个特殊字符 (!, @, #, $, %, ^, &, *)

**输入**：字符串密码 (1-100 个字符)
**输出**：布尔值

**示例**：
```javascript
validatePassword("Passw0rd!") // 返回 true
validatePassword("abc123") // 返回 false
validatePassword("PASSWORD123") // 返回 false
```*/
function validatePassword(text) {
  const regex = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/
  return regex.test(text)
}

// 评估点评: ✅ 正确且高效解法
// 优点: 使用正则表达式的前瞻断言，一次性验证所有条件
// 核心概念: 正则表达式、前瞻断言、密码验证
// 解释: (?=.{8,}) 至少8字符，(?=.*[a-z]) 包含小写，(?=.*[A-Z]) 包含大写，
//       (?=.*\d) 包含数字，(?=.*[!@#$%^&*]) 包含特殊字符

/*
### 33. 按扩展名排序
**描述**：按扩展名对文件名数组进行排序。
- 具有相同扩展名的文件应按名称排序。
- 没有扩展名的文件排在前面。

**输入**：字符串数组
**输出**：字符串数组

**示例**：
```javascript
sortByExt(["1.cad", "1.bat", "1.aa", ".bat"]) // 返回 [".bat", "1.aa", "1.bat", "1.cad"]
sortByExt(["1.cad", "2.bat", "1.aa", ".bat"]) // 返回 [".bat", "1.aa", "2.bat", "1.cad"]
```*/
function sortByExt(arr) {
  let map = new Map()
  const result = []
  for (const item of arr) {
    const [name, ext] = item.split('.')
    if (name === '') {
      result.push(item)
    } else {
      if (!map.has(ext)) {
        map.set(ext, [name])
      } else {
        const names = map.get(ext)
        names.push(name)
        map.set(ext, names)
      }
    }
  }
  Array.from(map.entries()).forEach(([key, value]) => {
    value = value.map(i => Number(i)).sort((a, b) => a - b) || []
    value.forEach(i => result.push(`${i}.${key}`))
  })

  return result
}

// 评估点评: ⚠️ 逻辑有缺陷
// 问题:
// 1. 假设文件名都是数字，但实际可能是字符串
// 2. 没有按扩展名排序，只是按插入顺序
// 3. 逻辑过于复杂
//
// 改进解法:
function sortByExtImproved(arr) {
  return arr.sort((a, b) => {
    const getExt = filename => {
      const parts = filename.split('.')
      return parts.length > 1 ? parts[parts.length - 1] : ''
    }

    const getName = filename => {
      const parts = filename.split('.')
      return parts.length > 1 ? parts.slice(0, -1).join('.') : filename
    }

    const extA = getExt(a)
    const extB = getExt(b)

    // 先按扩展名排序
    if (extA !== extB) {
      return extA.localeCompare(extB)
    }

    // 扩展名相同时按文件名排序
    return getName(a).localeCompare(getName(b))
  })
}
// 核心概念: 自定义排序、字符串处理、文件名解析

/*
### 34. 最长重复
**描述**：找出由相同字符组成的最长子串的长度。

**输入**：字符串 (1-1000 个字符)
**输出**：数字

**示例**：
```javascript
longRepeat("sdsffffse") // 返回 4
longRepeat("ddvvrwwwrggg") // 返回 3
```*/
function longRepeat(str) {
  let map = new Map()
  for (const i of str) {
    map.set(i, (map.get(i) || 0) + 1)
  }

  map = Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  return map[0][1]
}

// 评估点评: ❌ 完全误解题意
// 问题:
// 1. 题目要求"连续相同字符"的最长长度，不是字符总出现次数
// 2. 当前解法统计的是字符频率，不是连续长度
//
// 正确解法:
function longRepeatCorrect(str) {
  if (!str) return 0

  let maxLength = 1
  let currentLength = 1

  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i - 1]) {
      currentLength++
      maxLength = Math.max(maxLength, currentLength)
    } else {
      currentLength = 1
    }
  }

  return maxLength
}
// 核心概念: 连续序列检测、滑动窗口、最值追踪

/*
### 35. 验证字谜
**描述**：检查两个字符串是否互为字谜。
- 字谜是通过重新排列另一个单词的字母而形成的单词。
- 不区分大小写。
- 忽略空格和标点符号。

**输入**：两个字符串
**输出**：布尔值

**示例**：
```javascript
isAnagram("Listen", "Silent") // 返回 true
isAnagram("Hello", "Ole Oh") // 返回 false
```*/
function isAnagram(strL, strR) {
  return (
    strL
      .match(/\w/g)
      .map(i => `${i}`.toLowerCase())
      .sort()
      .join('') ===
    strR
      .match(/\w/g)
      .map(i => `${i}`.toLowerCase())
      .sort()
      .join('')
  )
}

// 评估点评: ⚠️ 基本正确但可以优化
// 优点: 正确处理大小写和非字母字符，使用排序比较
// 问题:
// 1. 不必要的字符串模板转换`${i}`
// 2. 没有处理null情况
// 3. 可以使用更简洁的方法
//
// 改进解法:
function isAnagramImproved(strL, strR) {
  if (!strL || !strR) return false

  const normalize = str =>
    str
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .split('')
      .sort()
      .join('')
  return normalize(strL) === normalize(strR)
}
// 核心概念: 字符串标准化、正则表达式、排序比较

/*
### 36. 频率排序
**描述**：按照出现频率的降序对数组中的元素进行排序。
- 如果两个元素具有相同的频率，则按值排序。

**输入**：数字数组
**输出**：数字数组

**示例**：
```javascript
freqSort([4, 6, 2, 2, 6, 4, 4, 4]) // 返回 [4, 4, 4, 4, 2, 2, 6, 6]
freqSort([1, 2, 2, 1, 1, 1, 2, 2]) // 返回 [1, 1, 1, 1, 2, 2, 2, 2]
```*/
function freqSort(arr) {
  let map = new Map()
  for (const i of arr) {
    map.set(i,(map.get(i) || 0) + 1)
  }

  map = Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  const result = []
  map.forEach(([key, value]) => {
    const child = Array.from({ length: value }).fill(key)
    result.push(...child)
  })

  return result
}

// 评估点评: ⚠️ 逻辑正确但不符合题目要求
// 优点: 正确统计频率并按频率排序
// 问题:
// 1. 题目要求"频率相同时按值排序"，但当前实现没有处理
// 2. 频率统计可以简化
//
// 改进解法:
function freqSortImproved(arr) {
  const freqMap = new Map()

  // 统计频率
  for (const item of arr) {
    freqMap.set(item, (freqMap.get(item) || 0) + 1)
  }

  // 按频率降序排序，频率相同时按值升序排序
  const sortedEntries = Array.from(freqMap.entries()).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1] // 频率降序
    return a[0] - b[0] // 值升序
  })

  // 构建结果数组
  const result = []
  sortedEntries.forEach(([value, freq]) => {
    result.push(...Array(freq).fill(value))
  })

  return result
}
// 核心概念: 频率统计、多条件排序、数组构建

/*
### 37. 中位数
**描述**：找出数字数组的中位数。
- 如果数组长度为奇数，则中位数是中间值。
- 如果数组长度为偶数，则中位数是两个中间值的平均值。

**输入**：数字数组
**输出**：数字

**示例**：
```javascript
median([1, 2, 3, 4, 5]) // 返回 3
median([3, 1, 2, 5, 3]) // 返回 3
median([1, 300, 2, 200, 1]) // 返回 2
median([3, 6, 20, 99, 10, 15]) // 返回 12.5
```*/
function median(arr) {
  arr.sort((a, b) => a - b)
  if (arr.length % 2 === 0) {
    return (arr[Math.floor(arr.length / 2)] + arr[Math.floor(arr.length / 2) - 1]) / 2
  }

  return arr[Math.floor(arr.length / 2)]
}

// 评估点评: ⚠️ 逻辑正确但修改原数组
// 优点: 正确计算中位数，处理奇偶数情况
// 问题:
// 1. sort()会修改原数组，违反函数式编程原则
// 2. 应该返回新数组而不是修改原数组
//
// 改进解法:
function medianImproved(arr) {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}
// 核心概念: 数组排序、中位数计算、避免副作用

/*
### 38. 绝对值排序
**描述**：按绝对值对数字数组进行排序。
- 在排序结果中保留原始值。

**输入**：数字数组
**输出**：数字数组

**示例**：
```javascript
absoluteSort([-20, -5, 10, 15]) // 返回 [-5, 10, 15, -20]
absoluteSort([1, 2, 3, 0]) // 返回 [0, 1, 2, 3]
```*/
function absoluteSort(arr) {
  let map = new Map()
  for (const i of arr) {
    if (i < 0) {
      map.set(Math.abs(i), -1)
    } else {
      map.set(i, 1)
    }
  }
  map = Array.from(map.entries()).sort((a, b) => a[0] - b[0])
  const result = []

  map.forEach(([key, value]) => {
    result.push(key * value)
  })
  return result
}

// 评估点评: ❌ 逻辑错误 - 会丢失重复元素
// 问题:
// 1. 使用Map会覆盖相同绝对值的元素，如[-5, 5]只会保留一个
// 2. 逻辑过于复杂，可以直接排序
//
// 正确解法:
function absoluteSortCorrect(arr) {
  return [...arr].sort((a, b) => Math.abs(a) - Math.abs(b))
}
// 核心概念: 自定义排序、绝对值比较、避免副作用

/*
### 39. 复制零
**描述**：复制数组中的每个零，将剩余元素向右移动。
- 数组长度保持不变（多余的元素被丢弃）。

**输入**：数字数组
**输出**：数字数组

**示例**：
```javascript
duplicateZeros([1, 0, 2, 3, 0, 4, 5, 0]) // 返回 [1, 0, 0, 2, 3, 0, 0, 4]
duplicateZeros([0, 0, 0]) // 返回 [0, 0, 0]
```*/
function duplicateZeros(arr) {
  const len = arr.length

  let index = arr.indexOf(0)
  while (index !== -1) {
    arr.splice(index, 0, 0)
    index = arr.indexOf(0, ++index + 1)
  }
  arr.length = len
  return arr
}

// 评估点评: ⚠️ 逻辑正确但修改原数组
// 优点: 正确实现零的复制和数组截断
// 问题:
// 1. 修改原数组，违反函数式编程原则
// 2. 时间复杂度较高，每次indexOf都是O(n)
//
// 改进解法:
function duplicateZerosImproved(arr) {
  const result = []

  for (let i = 0; i < arr.length && result.length < arr.length; i++) {
    result.push(arr[i])
    if (arr[i] === 0 && result.length < arr.length) {
      result.push(0)
    }
  }

  return result
}
// 核心概念: 数组遍历、条件插入、避免副作用

/*
### 40. 共同单词
**描述**：找出同时出现在两个输入字符串中的共同单词。
- 单词不区分大小写。
- 结果应按字母顺序排序。

**输入**：两个字符串
**输出**：字符串数组

**示例**：
```javascript
commonWords("hello,world", "hello,earth") // 返回 ["hello"]
commonWords("one,two,three", "four,five,one,two,six,three") // 返回 ["one", "three", "two"]
```*/
function commonWords(strL, strR) {
  const leftSet = new Set([...strL.split(',').map(i => `${i}`.toLowerCase())])
  const rightSet = new Set([...strR.split(',').map(i => `${i}`.toLowerCase())])
  return leftSet.intersection(rightSet)
}

// 评估点评: ❌ 使用了不存在的方法
// 问题:
// 1. Set.prototype.intersection() 方法在大多数环境中不存在
// 2. 题目要求返回数组并按字母顺序排序
// 3. 不必要的扩展运算符和字符串转换
//
// 正确解法:
function commonWordsCorrect(strL, strR) {
  const leftWords = new Set(strL.toLowerCase().split(','))
  const rightWords = new Set(strR.toLowerCase().split(','))

  const common = []
  for (const word of leftWords) {
    if (rightWords.has(word)) {
      common.push(word)
    }
  }

  return common.sort()
}
// 核心概念: Set交集操作、数组排序、字符串处理

/*
### 41. 按类型求和
**描述**：将混合数组中的数字相加并连接字符串。

**输入**：混合类型数组
**输出**：数组 [数字和, 连接后的字符串]

**示例**：
```javascript
sumByType([1, 2, "hello", 3, "world"]) // 返回 [6, "helloworld"]
sumByType(["1", 2, 3]) // 返回 [5, "1"]
```*/
function sumByType(arr) {
  let sum = 0
  let words = ''
  for (const i of arr) {
    if (typeof i === 'number') {
      sum += i
    } else if (typeof i === 'string') {
      words += i
    } else {
      continue
    }
  }
  return [sum, words]
}

// 评估点评: ✅ 正确且简洁解法
// 优点: 逻辑清晰，正确区分数字和字符串类型
// 核心概念: 类型检查、累加操作、字符串连接
// 时间复杂度: O(n)，空间复杂度: O(1)

/*
### 42. 鸟语翻译器
**描述**：将鸟语翻译成人类语言。
- 在鸟语中，元音会重复 (a -> aa, e -> ee 等)
- 在每个辅音后，会添加一个随机元音 ('p' -> 'pa', 'k' -> 'ko' 等)
- 通过删除额外的元音进行翻译。

**输入**：鸟语字符串
**输出**：人类语言字符串

**示例**：
```javascript
translate("hieeelalaooo") // 返回 "hello"
translate("hoooowe yyyooouuu duoooiiine") // 返回 "how you doin"
```*/
function translate(text) {
  const base = ['a', 'e', 'i', 'o', 'u']
  const result = []

  for (const words of text.split(' ')) {
    const items = []
    const _words = words.split('') || []
    const filterKeys = []
    for (let i = 0; i < _words.length - 1; i++) {
      if (!base.includes(_words[i]) && base.includes(_words[i + 1])) {
        filterKeys.push(i + 1)
      }
    }
    // console.log(filterKeys)
    for (const key of filterKeys) {
      _words[key] = null
    }
    _words
      .filter(i => i)
      .map(i => {
        if (!base.includes(i)) {
          items.push(i)
        } else {
          if (!items.includes(i)) {
            items.push(i)
          }
        }
      })

    result.push(items.join(''))
  }

  return result.join(' ')
}

// 评估点评: ❌ 逻辑错误且过于复杂
// 问题:
// 1. 算法逻辑不正确，没有正确处理鸟语规则
// 2. 代码过于复杂，难以理解和维护
// 3. 使用map但不返回值，应该用forEach
//
// 正确解法:
function translateCorrect(text) {
  const vowels = 'aeiou'

  return text
    .split(' ')
    .map(word => {
      let result = ''
      let i = 0

      while (i < word.length) {
        const char = word[i]

        if (vowels.includes(char)) {
          // 元音：跳过重复的相同元音
          result += char
          while (i + 1 < word.length && word[i + 1] === char) {
            i++
          }
        } else {
          // 辅音：添加辅音，跳过后面的元音
          result += char
          if (i + 1 < word.length && vowels.includes(word[i + 1])) {
            i++ // 跳过辅音后的元音
          }
        }
        i++
      }

      return result
    })
    .join(' ')
}
// 核心概念: 字符串处理、状态机、模式识别

/*
### 43. 全字母句检查器
**描述**：检查一个句子是否是全字母句。
- 全字母句是一个包含字母表中每个字母至少一次的句子。
- 不区分大小写。

**输入**：字符串
**输出**：布尔值

**示例**：
```javascript
isPangram("The quick brown fox jumps over the lazy dog") // 返回 true
isPangram("Hello world") // 返回 false
```*/
function isPangram(text) {
  return (
    new Set([
      ...text
        .split('')
        .filter(i => i && i !== ' ')
        .map(i => `${i}`.toLowerCase()),
    ]).size === 26
  )
}

// 评估点评: ⚠️ 基本正确但可以优化
// 优点: 使用Set去重，逻辑正确
// 问题:
// 1. 不必要的字符串模板转换`${i}`
// 2. 过滤条件不够精确，应该只保留字母
// 3. 可以使用更简洁的方法
//
// 改进解法:
function isPangramImproved(text) {
  const letters = new Set(text.toLowerCase().match(/[a-z]/g))
  return letters.size === 26
}
// 核心概念: Set去重、正则表达式、字母检测

/*
### 44. 有效括号
**描述**：检查括号字符串是否有效。
- 开括号必须以正确的顺序关闭。
- 有效的括号包括：(, ), [, ], {, }

**输入**：字符串 (1-1000 个字符)
**输出**：布尔值

**示例**：
```javascript
isValid("()") // 返回 true
isValid("()[{}]") // 返回 true
isValid("(]") // 返回 false
isValid("([)]") // 返回 false
```*/
function isValid(str) {
  if (str.length % 2 !== 0) return false
  if (str.includes('(')) {
    str = str.replaceAll('(', ' -1 ')
  }
  if (str.includes(')')) {
    str = str.replaceAll(')', ' 1 ')
  }
  if (str.includes('[')) {
    str = str.replaceAll('[', ' -2 ')
  }
  if (str.includes(']')) {
    str = str.replaceAll(']', ' 2 ')
  }
  if (str.includes('{')) {
    str = str.replaceAll('{', ' -3 ')
  }
  if (str.includes('}')) {
    str = str.replaceAll('}', ' 3 ')
  }

  const allKeys = str
    .split(' ')
    .filter(i => i && i !== ' ')
    .map(i => Number(i))
  return allKeys.reduce((prev, current) => prev + current, 0) === 0
}

// 评估点评: ❌ 错误的算法思路
// 问题:
// 1. 括号匹配需要考虑顺序，不能简单相加
// 2. "([)]" 这种情况相加为0但不是有效括号
// 3. 需要使用栈来验证括号的正确配对
//
// 正确解法:
function isValidCorrect(str) {
  const stack = []
  const pairs = { '(': ')', '[': ']', '{': '}' }

  for (const char of str) {
    if (char in pairs) {
      stack.push(char)
    } else if (Object.values(pairs).includes(char)) {
      const last = stack.pop()
      if (!last || pairs[last] !== char) {
        return false
      }
    }
  }

  return stack.length === 0
}
// 核心概念: 栈数据结构、括号匹配算法、配对验证

/*
### 45. Unix 匹配
**描述**：检查字符串是否匹配 Unix 风格的模式。
- '*' 匹配任何字符序列
- '?' 匹配任何单个字符

**输入**：字符串，模式
**输出**：布尔值

**示例**：
```javascript
unixMatch("somefile.txt", "*") // 返回 true
unixMatch("somefile.txt", "*.txt") // 返回 true
unixMatch("1name.txt", "?name.txt") // 返回 true
unixMatch("1name.txt", "?name.???") // 返回 true
```*/
function unixMatch(str, pattern) {
  const regexStr = pattern.replaceAll('.', '\\.').replaceAll('*', '.*').replaceAll('?', '.')
  const regex = new RegExp(`^${regexStr}$`)
  return regex.test(str)
}

// 评估点评: ✅ 正确且高效解法
// 优点: 正确将Unix通配符转换为正则表达式
// 核心概念: 正则表达式、字符串替换、模式匹配
// 注意: 需要先转义点号，再处理通配符，顺序很重要

/*
### 46. 寻找岛屿
**描述**：计算二维网格中岛屿的数量。
- 岛屿被水包围，由水平或垂直相邻的陆地组成。
- 1 表示陆地，0 表示水。

**输入**：由 0 和 1 组成的二维数组
**输出**：数字

**示例**：
```javascript
countIslands([
  [0, 1, 0, 0],
  [1, 1, 1, 0],
  [0, 1, 0, 0],
  [1, 0, 0, 1]
]) // 返回 3
```*/
function countIslands(arr) {
  const result = []
  const m = arr.length
  const n = arr[0].length

  const dfs = (column, row) => {
    if (column < 0 || row < 0 || column >= m || row >= n) return
    if (arr[column][row] !== 1) return
    arr[column][row] = -1
    dfs(column - 1, row)
    dfs(column + 1, row)
    dfs(column, row - 1)
    dfs(column, row + 1)
  }

  for (let column = 0; column < m; column++) {
    for (let row = 0; row < n; row++) {
      const current = arr[column][row]
      if (current === 1) {
        result.push(current)
        dfs(column, row)
      }
    }
  }
  return result.length
}

// 评估点评: ⚠️ 逻辑正确但修改原数组
// 优点: 正确使用DFS算法，岛屿计数逻辑正确
// 问题:
// 1. 修改原数组，将1改为-1，违反函数式编程原则
// 2. result数组不必要，可以直接计数
//
// 改进解法:
function countIslandsImproved(grid) {
  if (!grid || grid.length === 0) return 0

  const visited = Array(grid.length)
    .fill()
    .map(() => Array(grid[0].length).fill(false))
  let count = 0

  const dfs = (i, j) => {
    if (
      i < 0 ||
      i >= grid.length ||
      j < 0 ||
      j >= grid[0].length ||
      visited[i][j] ||
      grid[i][j] === 0
    )
      return

    visited[i][j] = true
    dfs(i - 1, j)
    dfs(i + 1, j)
    dfs(i, j - 1)
    dfs(i, j + 1)
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        dfs(i, j)
        count++
      }
    }
  }

  return count
}
// 核心概念: DFS深度优先搜索、图遍历、访问标记

/*
### 47. 罗马数字转整数
**描述**：将罗马数字转换为整数。
- 有效的罗马数字包括：I, V, X, L, C, D, M
- 值：I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000
  - 特殊情况：IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900

  **输入**：字符串 (罗马数字, 1-15 个字符)
**输出**：数字

**示例**：
```javascript
romanToInt("III") // 返回 3
romanToInt("IV") // 返回 4
romanToInt("LVIII") // 返回 58
romanToInt("MCMXCIV") // 返回 1994
```*/
function romanToInt(romanText) {
  const rObj = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  }
  const leftGen = { I: ['V', 'X'], X: ['L', 'C'], C: ['D', 'M'] }
  const sumMap = new Map()

  const rts = romanText.split('').map(i => `${i}`.toUpperCase())
  for (let i = 0; i < rts.length; i++) {
    const rKey = rts[i]
    if (sumMap.size !== 0) {
      const { key: prevKey, value } = sumMap.get(i - 1)
      if (prevKey !== rKey) {
        if (Object.hasOwn(leftGen, prevKey) && leftGen[prevKey].includes(rKey)) {
          sumMap.set(i, { key: rKey, value: rObj[rKey] - value * 2 })
        } else {
          sumMap.set(i, { key: rKey, value: rObj[rKey] })
        }
      } else {
        sumMap.set(i, { key: rKey, value: rObj[rKey] })
      }
    } else {
      sumMap.set(i, { key: rKey, value: rObj[rKey] })
    }
  }
  let result = 0
  sumMap.forEach(({ value }) => {
    result += value
  })
  return result
}

// 评估点评: ⚠️ 逻辑正确但过于复杂
// 优点: 正确处理罗马数字的减法规则
// 问题:
// 1. 代码过于复杂，难以理解和维护
// 2. 使用Map存储中间结果不必要
// 3. 可以使用更简洁的方法
//
// 改进解法:
function romanToIntImproved(s) {
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let result = 0

  for (let i = 0; i < s.length; i++) {
    const current = values[s[i]]
    const next = values[s[i + 1]]

    if (next && current < next) {
      result -= current
    } else {
      result += current
    }
  }

  return result
}
// 核心概念: 罗马数字规则、前瞻比较、累加计算

/*
### 48. 整数转罗马数字
**描述**：将整数转换为罗马数字。
- 有效范围：1 到 3999

**输入**：数字 (1-3999)
**输出**：字符串 (罗马数字)

**示例**：
```javascript
intToRoman(3) // 返回 "III"
intToRoman(4) // 返回 "IV"
intToRoman(58) // 返回 "LVIII"
intToRoman(1994) // 返回 "MCMXCIV"
```*/
function intToRoman(num) {
  if (typeof num !== 'number' || num < 0 || num > 3999) return
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

  let res = ''
  for (let i = 0; i < values.length; i++) {
    while (num > values[i]) {
      num -= values[i]
      res += syms[i]
    }
    if (num === 0) break
  }

  return res
}

// 评估点评: ⚠️ 逻辑有小错误
// 优点: 使用贪心算法，从大到小处理，思路正确
// 问题:
// 1. while条件应该是 >= 而不是 >，否则无法处理相等情况
// 2. 边界检查可以改进
//
// 改进解法:
function intToRomanImproved(num) {
  if (num < 1 || num > 3999) return ''

  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

  let result = ''

  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      num -= values[i]
      result += symbols[i]
    }
  }

  return result
}
// 核心概念: 贪心算法、数值映射、字符串构建

/*
### 49. 字谜分组
**描述**：将字符串数组中的字谜分组。
- 字谜是通过重新排列另一个单词的字母而形成的单词。

**输入**：字符串数组
**输出**：字符串数组的数组

**示例**：
```javascript
groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
// 返回 [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
```*/
function groupAnagrams(arr) {
  const bwns = Array.from({ length: 26 }, (_, i) => i + 1)
  const wns = 'abcdefghijklmnopqrstuvwxyz'.split('')

  arr.map(i => `${i}`.toLowerCase())
  const map = new Map()
  for (const item of arr) {
    const itemSum = `${item}`.split('').reduce((prev, current) => {
      return prev + bwns[wns.indexOf(current)]
    }, 0)
    map.set(item, itemSum)
  }
  const resMap = new Map()
  const result = []
  map.forEach((key, value) => {
    if (!resMap.has(key)) {
      resMap.set(key, [value])
    } else {
      const saveKeys = resMap.get(key) || []
      saveKeys.push(value)
      resMap.set(key, saveKeys)
    }
  })
  resMap.values().forEach(item => {
    result.push(item)
  })

  return result
}

// 评估点评: ❌ 算法错误且过于复杂
// 问题:
// 1. 使用字母位置求和不能正确识别字谜，如"ab"和"ba"求和相同但"aab"和"bb"也相同
// 2. 代码过于复杂，逻辑混乱
// 3. map操作没有返回值，应该用forEach
//
// 正确解法:
function groupAnagramsCorrect(strs) {
  const groups = new Map()

  for (const str of strs) {
    // 将字符串排序作为key，相同字谜排序后结果相同
    const key = str.split('').sort().join('')

    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key).push(str)
  }

  return Array.from(groups.values())
}
// 核心概念: 字符串排序、Map分组、字谜识别

/*
### 50. 查找所有重复项
**描述**：在数组中找出所有重复项。
- 每个元素出现一次或两次。

**输入**：数字数组
**输出**：数字数组

**示例**：
```javascript
findDuplicates([4,3,2,7,8,2,3,1]) // 返回 [2, 3]
findDuplicates([1,1,2]) // 返回 [1]
```*/
function findDuplicates(arr) {
  arr.sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i + 1] - arr[i] === 0) {
      result.push(arr[i + 1])
    }
  }
  return result
}

// 评估点评: ⚠️ 基本正确但有改进空间
// 优点: 逻辑正确，通过排序简化重复检测
// 问题:
// 1. 修改了原数组(sort会改变原数组)
// 2. 可以使用更简洁的方法
//
// 改进解法:
function findDuplicatesImproved(arr) {
  const seen = new Set()
  const duplicates = new Set()

  for (const num of arr) {
    if (seen.has(num)) {
      duplicates.add(num)
    } else {
      seen.add(num)
    }
  }

  return Array.from(duplicates)
}
// 核心概念: Set去重、一次遍历、避免修改原数组

/*
=== 整体评估总结 ===

经过详细评估，发现以下主要问题：

❌ 严重错误的题目 (需要重写):
- 第2题 threeWords: 完全误解题意，应该检查连续三个单词
- 第9题 secretMessage: 正则表达式使用错误，join方法调用错误
- 第22题 maxDigit: 只返回第一位数字，应该返回最大数位
- 第26题 frequencySort: 没有按频率排序
- 第34题 longRepeat: 统计总频率而非连续长度
- 第44题 isValid: 括号匹配算法完全错误
- 第40题 commonWords: 使用不存在的intersection方法

⚠️ 需要改进的题目:
- 第3题 biggerPrice: 修改原数组，应该避免副作用
- 第4题 popularWords: 逻辑过于复杂，可以简化
- 第5题 secondIndex: 不必要的数组转换
- 第6题 betweenMarkers: 没有考虑边界情况
- 第8题 evenLast: 空数组返回值错误
- 第11题 sumNumbers: 无法处理复杂分隔符
- 第16题 removeAllBefore: 修改原数组问题
- 第18题 countDigits: 逻辑过于复杂

✅ 正确且优秀的解法:
- 第1题 firstWord: 正则表达式使用得当
- 第7题 fizzBuzz: 经典正确实现
- 第10题 findOccurrences: 高效的字符串查找
- 第12题 threeConsecutive: 简洁的循环实现
- 第14题 digitMultiplication: 函数式编程风格
- 第17题 allTheSame: 完美使用every方法

主要问题类型:
1. 算法理解错误 - 多个题目完全误解了题目要求
2. JavaScript API误用 - 使用不存在的方法或错误的方法调用
3. 副作用问题 - 修改原数组而不是返回新数组
4. 边界情况处理不当 - 没有考虑空值、特殊情况
5. 代码复杂度过高 - 可以用更简洁的方法实现

建议:
1. 仔细阅读题目要求，确保理解正确
2. 熟悉JavaScript内置方法和API
3. 遵循函数式编程原则，避免副作用
4. 使用现代JavaScript特性简化代码
5. 加强算法基础，特别是字符串和数组处理
*/
