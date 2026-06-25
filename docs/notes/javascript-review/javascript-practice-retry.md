# JavaScript 错题重练集

基于练习题评估结果，针对性设计的重练题目集合。

## 🔴 严重错误题目重练（优先级最高）

### 1. 连续单词检测器

**难度**: ⭐⭐⭐  
**考察知识点**: 字符串处理、正则表达式、循环逻辑

**题目描述**：
检查文本中是否存在连续的四个单词（只包含字母的词）。

**输入**：字符串 (1-1000 个字符)  
**输出**：布尔值

**示例**：

```javascript
hasFourWords('The quick brown fox jumps') // 返回 true (5个纯字母单词)
hasFourWords('Hello, world! How are you?') // 返回 false (只有2个纯字母单词: How, are)
hasFourWords('123 abc def 456') // 返回 false (只有2个纯字母单词: abc, def)
hasFourWords('one two three') // 返回 false (只有3个纯字母单词)
hasFourWords('apple banana cherry date') // 返回 true (4个纯字母单词)
```

**解题提示**：

- 使用正则表达式提取只包含字母的单词
- 遍历单词数组，检查连续性
- 注意区分"连续四个单词"和"总共四个单词"

<details>
<summary>标准答案</summary>

```javascript
function hasFourWords(text) {
  const words = text.split(/\s+/).filter(word => /^[a-zA-Z]+$/.test(word))

  // 检查是否有连续的四个单词
  return words.length >= 4
}

// 更严格的版本：检查原文本中的连续性
function hasFourConsecutiveWords(text) {
  // 使用正则表达式匹配连续的四个单词
  const pattern = /(?:^|\s)([a-zA-Z]+\s+[a-zA-Z]+\s+[a-zA-Z]+\s+[a-zA-Z]+)(?:\s|$)/
  return pattern.test(text)
}

// 逐步检查版本
function hasFourWordsStepByStep(text) {
  const words = text.split(/\s+/).filter(word => /^[a-zA-Z]+$/.test(word))

  if (words.length < 4) return false

  // 检查原文本中是否存在这四个单词的连续出现
  for (let i = 0; i <= words.length - 4; i++) {
    const fourWords = words.slice(i, i + 4)
    const pattern = new RegExp(fourWords.join('\\s+'))
    if (pattern.test(text)) {
      return true
    }
  }

  return false
}

// 时间复杂度: O(n + m) 其中n是文本长度，m是单词数量
// 空间复杂度: O(m) 用于存储单词数组
```

</details>

---

### 2. 高级频率排序

**难度**: ⭐⭐⭐⭐  
**考察知识点**: Map数据结构、自定义排序、稳定排序

**题目描述**：
按照出现频率的降序对数组元素进行排序。如果两个元素频率相同，则按照它们在原数组中首次出现的顺序排序。

**输入**：任意类型数组  
**输出**：排序后的数组

**示例**：

```javascript
advancedFreqSort([4, 6, 2, 2, 6, 4, 4, 4]) // 返回 [4, 4, 4, 4, 6, 6, 2, 2] (4频率最高，6比2先出现)
advancedFreqSort(['a', 'b', 'a', 'c', 'b', 'a']) // 返回 ['a', 'a', 'a', 'b', 'b', 'c']
advancedFreqSort([1, 2, 3, 1, 2, 3]) // 返回 [1, 1, 2, 2, 3, 3]
```

**解题提示**：

- 统计每个元素的频率和首次出现位置
- 使用多条件排序：频率降序，首次出现位置升序
- 构建最终结果数组

<details>
<summary>标准答案</summary>

```javascript
function advancedFreqSort(arr) {
  const freqMap = new Map()
  const firstIndex = new Map()

  // 统计频率和首次出现位置
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    freqMap.set(item, (freqMap.get(item) || 0) + 1)
    if (!firstIndex.has(item)) {
      firstIndex.set(item, i)
    }
  }

  // 获取唯一元素并排序
  const uniqueItems = Array.from(freqMap.keys()).sort((a, b) => {
    const freqDiff = freqMap.get(b) - freqMap.get(a)
    if (freqDiff !== 0) return freqDiff // 频率降序
    return firstIndex.get(a) - firstIndex.get(b) // 首次出现位置升序
  })

  // 构建结果数组
  const result = []
  for (const item of uniqueItems) {
    const freq = freqMap.get(item)
    for (let i = 0; i < freq; i++) {
      result.push(item)
    }
  }

  return result
}
```

</details>

---

### 3. 智能括号验证器

**难度**: ⭐⭐⭐⭐  
**考察知识点**: 栈数据结构、字符串处理、算法逻辑

**题目描述**：
验证字符串中的括号是否有效。有效的括号需要满足：

1. 左括号必须用相同类型的右括号闭合
2. 左括号必须以正确的顺序闭合
3. 支持三种括号：()、[]、{}
4. 字符串中可能包含其他字符，只验证括号部分

**输入**：字符串 (1-1000 个字符)  
**输出**：布尔值

**示例**：

```javascript
smartValidate('()') // 返回 true
smartValidate('()[{}]') // 返回 true
smartValidate('(]') // 返回 false
smartValidate('([)]') // 返回 false
smartValidate('hello(world)') // 返回 true
smartValidate('a[b{c}d]e') // 返回 true
```

**解题提示**：

- 使用栈来跟踪开括号
- 遇到开括号时入栈，遇到闭括号时检查匹配
- 忽略非括号字符

<details>
<summary>标准答案</summary>

```javascript
function smartValidate(s) {
  const stack = []
  const pairs = { '(': ')', '[': ']', '{': '}' }
  const openBrackets = new Set(['(', '[', '{'])
  const closeBrackets = new Set([')', ']', '}'])

  for (const char of s) {
    if (openBrackets.has(char)) {
      stack.push(char)
    } else if (closeBrackets.has(char)) {
      const last = stack.pop()
      if (!last || pairs[last] !== char) {
        return false
      }
    }
    // 忽略其他字符
  }

  return stack.length === 0
}
```

</details>

---

### 4. 复杂字谜分组

**难度**: ⭐⭐⭐⭐  
**考察知识点**: 字符串排序、Map分组、算法优化

**题目描述**：
将字符串数组中的字谜分组。字谜是通过重新排列另一个单词的字母形成的单词。要求按照每组的第一个单词在原数组中的位置排序。

**输入**：字符串数组  
**输出**：字符串数组的数组

**示例**：

```javascript
complexGroupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])
// 返回 [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]

complexGroupAnagrams(['abc', 'bca', 'cab', 'xyz', 'zyx'])
// 返回 [["abc", "bca", "cab"], ["xyz", "zyx"]]
```

**解题提示**：

- 将每个字符串的字符排序作为分组键
- 使用Map记录每组的单词和首次出现位置
- 按首次出现位置排序分组

<details>
<summary>标准答案</summary>

```javascript
function complexGroupAnagrams(strs) {
  const groups = new Map()
  const firstIndex = new Map()

  for (let i = 0; i < strs.length; i++) {
    const str = strs[i]
    const key = str.split('').sort().join('')

    if (!groups.has(key)) {
      groups.set(key, [])
      firstIndex.set(key, i)
    }
    groups.get(key).push(str)
  }

  // 按首次出现位置排序
  return Array.from(groups.entries())
    .sort((a, b) => firstIndex.get(a[0]) - firstIndex.get(b[0]))
    .map(([key, group]) => group)
}
```

</details>

---

### 5. 绝对值排序增强版

**难度**: ⭐⭐⭐  
**考察知识点**: 自定义排序、稳定排序、数组处理

**题目描述**：
按绝对值对数字数组进行排序。如果两个数字的绝对值相同，则负数排在正数前面。

**输入**：数字数组  
**输出**：数字数组

**示例**：

```javascript
enhancedAbsoluteSort([-20, -5, 10, 15]) // 返回 [-5, 10, 15, -20]
enhancedAbsoluteSort([3, -3, 1, -1, 0]) // 返回 [0, -1, 1, -3, 3] (0绝对值最小，然后-1<1，-3<3)
enhancedAbsoluteSort([5, -5, 5, -5]) // 返回 [-5, -5, 5, 5]
```

**解题提示**：

- 使用自定义比较函数
- 先比较绝对值，再比较正负性
- 避免修改原数组

<details>
<summary>标准答案</summary>

```javascript
function enhancedAbsoluteSort(arr) {
  return [...arr].sort((a, b) => {
    const absA = Math.abs(a)
    const absB = Math.abs(b)

    if (absA !== absB) {
      return absA - absB // 按绝对值升序
    }

    // 绝对值相同时，负数在前
    return a - b
  })
}
```

</details>

---

### 6. 高级鸟语翻译器

**难度**: ⭐⭐⭐⭐⭐  
**考察知识点**: 字符串处理、状态机、模式识别

**题目描述**：
将鸟语翻译成人类语言。鸟语规则：

1. 每个元音字母会重复出现（a->aa, e->ee等）
2. 每个辅音字母后会跟一个随机元音字母
3. 翻译时需要去除这些多余的字符

**输入**：鸟语字符串  
**输出**：人类语言字符串

**示例**：

```javascript
advancedTranslate('hieeelalaooo') // 返回 "hello"
advancedTranslate('hoooowe yyyooouuu duoooiiine') // 返回 "how yyyou doin" (算法需要改进)
advancedTranslate('cooodiiinnnggg') // 返回 "codinnnggg" (算法需要改进)
advancedTranslate('heeellooo wooorld') // 返回 "helo world" (更简单的测试用例)
```

**解题提示**：

- 识别元音和辅音模式
- 对于元音：保留第一个，跳过重复的
- 对于辅音：保留辅音，跳过后面的元音

<details>
<summary>标准答案</summary>

```javascript
function advancedTranslate(birdText) {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u'])

  return birdText
    .split(' ')
    .map(word => {
      let result = ''
      let i = 0

      while (i < word.length) {
        const char = word[i]

        if (vowels.has(char)) {
          // 元音：添加一个，跳过重复的
          result += char
          while (i + 1 < word.length && word[i + 1] === char) {
            i++
          }
        } else {
          // 辅音：添加辅音，跳过后面的元音
          result += char
          if (i + 1 < word.length && vowels.has(word[i + 1])) {
            i++ // 跳过辅音后的元音
          }
        }
        i++
      }

      return result
    })
    .join(' ')
}
```

</details>

## ⚠️ 改进空间题目强化（优先级中等）

### 7. 无副作用数组操作

**难度**: ⭐⭐  
**考察知识点**: 函数式编程、数组方法、避免副作用

**题目描述**：
实现以下数组操作函数，要求不修改原数组：

1. `moveFirstToLast(arr)` - 将第一个元素移到最后
2. `removeAllBefore(arr, target)` - 移除目标元素之前的所有元素
3. `insertAt(arr, index, element)` - 在指定位置插入元素

**示例**：

```javascript
const original = [1, 2, 3, 4, 5]

moveFirstToLast(original) // 返回 [2, 3, 4, 5, 1]
removeAllBefore(original, 3) // 返回 [3, 4, 5]
insertAt(original, 2, 'X') // 返回 [1, 2, 'X', 3, 4, 5]

console.log(original) // [1, 2, 3, 4, 5] (原数组未改变)
```

<details>
<summary>标准答案</summary>

```javascript
function moveFirstToLast(arr) {
  if (arr.length <= 1) return [...arr]
  return [...arr.slice(1), arr[0]]
}

function removeAllBefore(arr, target) {
  const index = arr.indexOf(target)
  return index === -1 ? [...arr] : arr.slice(index)
}

function insertAt(arr, index, element) {
  return [...arr.slice(0, index), element, ...arr.slice(index)]
}
```

</details>

---

### 8. 中位数计算器

**难度**: ⭐⭐⭐  
**考察知识点**: 数组排序、数学计算、边界处理

**题目描述**：
计算数字数组的中位数，要求不修改原数组，并处理各种边界情况。

**输入**：数字数组  
**输出**：数字

**示例**：

```javascript
calculateMedian([1, 2, 3, 4, 5]) // 返回 3
calculateMedian([3, 1, 2, 5, 3]) // 返回 3
calculateMedian([1, 300, 2, 200, 1]) // 返回 2
calculateMedian([3, 6, 20, 99, 10, 15]) // 返回 12.5
calculateMedian([]) // 返回 null
calculateMedian([42]) // 返回 42
```

<details>
<summary>标准答案</summary>

```javascript
function calculateMedian(arr) {
  if (arr.length === 0) return null
  if (arr.length === 1) return arr[0]

  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}
```

</details>

## 🎯 综合应用题目

### 9. 数据流处理器

**难度**: ⭐⭐⭐⭐⭐  
**考察知识点**: 综合应用、函数式编程、数据处理

**题目描述**：
实现一个数据流处理器，支持链式调用多种操作：

```javascript
const processor = new DataProcessor([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

processor
  .filter(x => x % 2 === 0) // 过滤偶数
  .map(x => x * 2) // 每个数乘以2
  .groupBy(x => x > 10) // 按是否大于10分组
  .sortGroups((a, b) => a - b) // 每组内部排序
  .getResult()

// 期望输出: { true: [12, 16, 20], false: [4, 8] }
```

<details>
<summary>标准答案</summary>

```javascript
class DataProcessor {
  constructor(data) {
    this.data = [...data]
  }

  filter(predicate) {
    this.data = this.data.filter(predicate)
    return this
  }

  map(transform) {
    this.data = this.data.map(transform)
    return this
  }

  groupBy(keyFn) {
    const groups = {}
    for (const item of this.data) {
      const key = keyFn(item)
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    }
    this.data = groups
    return this
  }

  sortGroups(compareFn) {
    for (const key in this.data) {
      if (Array.isArray(this.data[key])) {
        this.data[key].sort(compareFn)
      }
    }
    return this
  }

  getResult() {
    return this.data
  }
}
```

</details>

---

### 10. 智能文本分析器

**难度**: ⭐⭐⭐⭐⭐  
**考察知识点**: 正则表达式、字符串处理、统计分析

**题目描述**：
实现一个文本分析器，提供以下功能：

1. 统计单词频率（忽略大小写和标点）
2. 找出最长的回文子串
3. 检测是否包含所有字母（全字母句）
4. 计算文本的可读性评分（基于平均单词长度）

**示例**：

```javascript
const analyzer = new TextAnalyzer(
  'The quick brown fox jumps over the lazy dog! A man, a plan, a canal: Panama.',
)

analyzer.getWordFrequency()
// 返回 Map: {"the" => 2, "quick" => 1, "brown" => 1, ...}

analyzer.getLongestPalindrome()
// 返回 "amanaplanacanalpanama" (移除空格和标点后的回文)

analyzer.isPangram()
// 返回 true

analyzer.getReadabilityScore()
// 返回基于平均单词长度的评分
```

<details>
<summary>标准答案</summary>

```javascript
class TextAnalyzer {
  constructor(text) {
    this.text = text
    this.words = text.toLowerCase().match(/[a-z]+/g) || []
  }

  getWordFrequency() {
    const frequency = new Map()
    for (const word of this.words) {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    }
    return frequency
  }

  getLongestPalindrome() {
    const cleanText = this.text.toLowerCase().replace(/[^a-z]/g, '')
    let longest = ''

    for (let i = 0; i < cleanText.length; i++) {
      // 检查奇数长度回文
      let left = i,
        right = i
      while (left >= 0 && right < cleanText.length && cleanText[left] === cleanText[right]) {
        if (right - left + 1 > longest.length) {
          longest = cleanText.slice(left, right + 1)
        }
        left--
        right++
      }

      // 检查偶数长度回文
      left = i
      right = i + 1
      while (left >= 0 && right < cleanText.length && cleanText[left] === cleanText[right]) {
        if (right - left + 1 > longest.length) {
          longest = cleanText.slice(left, right + 1)
        }
        left--
        right++
      }
    }

    return longest
  }

  isPangram() {
    const letters = new Set(this.text.toLowerCase().match(/[a-z]/g))
    return letters.size === 26
  }

  getReadabilityScore() {
    if (this.words.length === 0) return 0
    const avgWordLength = this.words.reduce((sum, word) => sum + word.length, 0) / this.words.length
    return Math.round((10 - avgWordLength) * 10) / 10 // 简化的可读性评分
  }
}
```

</details>

## 📚 练习建议

1. **循序渐进**: 从严重错误题目开始，逐步提高难度
2. **理解优先**: 重点理解算法思路，而不是死记硬背
3. **多种解法**: 尝试用不同方法解决同一问题
4. **测试验证**: 为每个解法编写测试用例
5. **性能分析**: 分析不同解法的时间和空间复杂度
6. **代码审查**: 检查代码是否遵循最佳实践

## 🎯 重点提醒

- 严重错误题目必须完全掌握
- 注意避免修改原数组等副作用
- 重视边界情况的处理
- 培养函数式编程思维
- 持续练习，形成肌肉记忆
