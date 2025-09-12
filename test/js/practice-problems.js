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
    .reduce((prev, current, i) => prev + current, 0)
}

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
    .reduce((prev, current, i) => prev * current, 1)
}

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
  map.forEach((value, key, map) => {
    result.push(Array.from({ length: value }).fill(key))
  })

  return result.flat(Infinity)
}

