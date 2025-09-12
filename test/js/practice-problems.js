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
    result.push(index++)
    index = str.indexOf(target)
  }
  return result
}
