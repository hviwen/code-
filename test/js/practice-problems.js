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
    if (!map.has(i)) {
      map.set(i, 1)
    } else {
      let count = map.get(i)
      map.set(i, ++count)
    }
  }

  map = Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  return map[0][1]
}

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
    if (!map.has(i)) {
      map.set(i, 1)
    } else {
      let count = map.get(i)
      map.set(i, ++count)
    }
  }

  map = Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  const result = []
  map.forEach(([key, value]) => {
    const child = Array.from({ length: value }).fill(key)
    result.push(...child)
  })

  return result
}

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
  sumMap.forEach(({ key, value }) => {
    result += value
  })
  return result
}

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
