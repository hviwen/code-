# JavaScript 第二阶段错题重练集

基于第二阶段练习题评估结果，针对性设计的重练题目集合。

## 🔴 严重错误题目重练（优先级最高）

### 1. 最长回文子串检测器

**难度**: ⭐⭐⭐⭐
**考察知识点**: 字符串算法、中心扩展法、动态规划、回文检测

**题目描述**：
给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

**输入**：字符串 s
**输出**：最长回文子串

**示例**：

```javascript
longestPalindromeDetector('babad') // 返回 "bab" 或 "aba"
longestPalindromeDetector('cbbd') // 返回 "bb"
longestPalindromeDetector('a') // 返回 "a"
longestPalindromeDetector('ac') // 返回 "a" 或 "c"
longestPalindromeDetector('') // 返回 ""
longestPalindromeDetector('racecar') // 返回 "racecar"
longestPalindromeDetector('abcdef') // 返回 "a" (任意单字符)
longestPalindromeDetector('noon high it is') // 返回 "noon"
```

**解题提示**：

- 考虑使用中心扩展法，从每个可能的中心点向外扩展
- 注意处理奇数长度和偶数长度的回文
- 也可以考虑动态规划方法
- 边界情况：空字符串、单字符

<details>
<summary>标准答案</summary>

```javascript
// 方法1：中心扩展法（推荐）
function longestPalindromeDetector(s) {
  if (!s || s.length < 2) return s

  let start = 0,
    maxLen = 1

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

// 方法2：动态规划
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

// 时间复杂度: 中心扩展O(n²)，动态规划O(n²)
// 空间复杂度: 中心扩展O(1)，动态规划O(n²)
```

</details>

---

### 2. 智能数字验证器

**难度**: ⭐⭐⭐⭐
**考察知识点**: 正则表达式、字符串验证、状态机、数字格式解析

**题目描述**：
验证一个字符串是否为有效的数字。有效数字可以是整数、小数或科学计数法表示的数字。

**输入**：字符串 s
**输出**：布尔值

**示例**：

```javascript
smartNumberValidator('0') // 返回 true
smartNumberValidator('0.1') // 返回 true
smartNumberValidator('.1') // 返回 true
smartNumberValidator('3.') // 返回 true
smartNumberValidator('2e10') // 返回 true
smartNumberValidator('-90E3') // 返回 true
smartNumberValidator('e') // 返回 false
smartNumberValidator('1a') // 返回 false
smartNumberValidator('1e') // 返回 false
smartNumberValidator('99e2.5') // 返回 false
smartNumberValidator('--6') // 返回 false
```

**解题提示**：

- 考虑使用正则表达式进行模式匹配
- 也可以使用状态机方法逐字符验证
- 注意处理符号、小数点、科学计数法的各种组合
- 边界情况：空字符串、只有符号、只有小数点

<details>
<summary>标准答案</summary>

```javascript
// 方法1：正则表达式（推荐）
function smartNumberValidator(s) {
  s = s.trim()
  if (s === '') return false

  // 有效数字的正则表达式
  // ^[+-]? : 可选的正负号
  // (\d+\.?\d*|\.\d+) : 整数部分.小数部分 或 .小数部分
  // ([eE][+-]?\d+)? : 可选的科学计数法部分
  const regex = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/

  return regex.test(s)
}

// 方法2：状态机
function smartNumberValidatorStateMachine(s) {
  s = s.trim()
  if (s === '') return false

  let hasNum = false // 是否见过数字
  let hasE = false // 是否见过e/E
  let hasDot = false // 是否见过小数点

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

// 时间复杂度: O(n)，空间复杂度: O(1)
```

</details>

---

### 3. Unix路径简化器

**难度**: ⭐⭐⭐⭐
**考察知识点**: 栈数据结构、路径解析、字符串处理、Unix文件系统

**题目描述**：
给定一个Unix风格的文件路径，请将其简化。路径规则：以斜杠'/'开头，'.'表示当前目录，'..'表示上级目录，多个连续斜杠视为单个斜杠。

**输入**：字符串路径 path
**输出**：简化后的路径字符串

**示例**：

```javascript
unixPathSimplifier('/home/') // 返回 "/home"
unixPathSimplifier('/../') // 返回 "/"
unixPathSimplifier('/home//foo/') // 返回 "/home/foo"
unixPathSimplifier('/a/./b/../../c/') // 返回 "/c"
unixPathSimplifier('/a/../../b/../c//.//') // 返回 "/c"
unixPathSimplifier('/a//b////c/d//././/..') // 返回 "/a/b/c"
```

**解题提示**：

- 使用栈来处理路径组件
- 将路径按'/'分割成组件
- 遇到'..'时弹出栈顶元素（如果栈不为空）
- 遇到'.'或空组件时跳过
- 最后将栈中元素用'/'连接

<details>
<summary>标准答案</summary>

```javascript
function unixPathSimplifier(path) {
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

// 一行解法
function unixPathSimplifierOneLine(path) {
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

// 时间复杂度: O(n)，空间复杂度: O(n)
```

</details>

---

### 4. 跳跃游戏进阶版

**难度**: ⭐⭐⭐⭐  
**考察知识点**: 贪心算法、动态规划思想、数组遍历

**题目描述**：
给定一个非负整数数组，你最初位于数组的第一个位置。数组中的每个元素代表你在该位置可以跳跃的最大长度。判断你是否能够到达最后一个位置。

**输入**：非负整数数组 nums  
**输出**：布尔值

**示例**：

```javascript
canJumpAdvanced([2, 3, 1, 1, 4]) // 返回 true
// 解释: 可以先跳1步，从位置0到达位置1，然后再从位置1跳3步到达最后一个位置

canJumpAdvanced([3, 2, 1, 0, 4]) // 返回 false
// 解释: 无论怎样，总会到达索引为3的位置。但该位置的最大跳跃长度是0，所以永远不可能到达最后一个位置

canJumpAdvanced([0]) // 返回 true
canJumpAdvanced([1, 0, 1, 0]) // 返回 false
```

**解题提示**：

- 关键是维护能够到达的最远位置
- 如果当前位置超过了最远可达位置，则无法继续
- 使用贪心思想，不需要记录具体路径

<details>
<summary>标准答案</summary>

```javascript
function canJumpAdvanced(nums) {
  let maxReach = 0

  for (let i = 0; i < nums.length; i++) {
    // 如果当前位置超过了最远可达位置，返回false
    if (i > maxReach) return false

    // 更新最远可达位置
    maxReach = Math.max(maxReach, i + nums[i])

    // 如果已经可以到达最后位置，提前返回true
    if (maxReach >= nums.length - 1) return true
  }

  return maxReach >= nums.length - 1
}

// 时间复杂度: O(n)，空间复杂度: O(1)
```

</details>

---

### 2. 高级二分查找

**难度**: ⭐⭐⭐⭐  
**考察知识点**: 二分查找、边界处理、有序数组

**题目描述**：
在一个有序数组中查找目标值的第一次和最后一次出现的位置。如果目标值不存在于数组中，返回 [-1, -1]。要求算法时间复杂度为 O(log n)。

**输入**：有序整数数组 nums，目标值 target  
**输出**：包含两个整数的数组 [firstPos, lastPos]

**示例**：

```javascript
searchFirstLast([5, 7, 7, 8, 8, 10], 8) // 返回 [3,4]
searchFirstLast([5, 7, 7, 8, 8, 10], 6) // 返回 [-1,-1]
searchFirstLast([], 0) // 返回 [-1,-1]
searchFirstLast([1], 1) // 返回 [0,0]
```

**解题提示**：

- 需要实现两个二分查找：查找左边界和右边界
- 查找左边界时，找到目标后继续向左搜索
- 查找右边界时，找到目标后继续向右搜索

<details>
<summary>标准答案</summary>

```javascript
function searchFirstLast(nums, target) {
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
```

</details>

---

### 3. 回溯算法：组合总和变体

**难度**: ⭐⭐⭐⭐⭐  
**考察知识点**: 回溯算法、递归、组合问题、剪枝优化

**题目描述**：
给定一个无重复元素的正整数数组 candidates 和一个正整数 target，找出 candidates 中所有可以使数字和为目标数 target 的唯一组合。candidates 中的数字可以无限制重复被选取。

**输入**：正整数数组 candidates，目标值 target  
**输出**：所有可能组合的数组

**示例**：

```javascript
combinationSumBacktrack([2, 3, 6, 7], 7)
// 返回 [[2,2,3],[7]]

combinationSumBacktrack([2, 3, 5], 8)
// 返回 [[2,2,2,2],[2,3,3],[3,5]]

combinationSumBacktrack([2], 1)
// 返回 []

combinationSumBacktrack([1], 1)
// 返回 [[1]]
```

**解题提示**：

- 使用回溯算法遍历所有可能的组合
- 通过start参数避免重复组合
- 及时剪枝提高效率
- 注意深拷贝保存结果

<details>
<summary>标准答案</summary>

```javascript
function combinationSumBacktrack(candidates, target) {
  const result = []

  function backtrack(start, currentCombination, remainingSum) {
    // 找到一个有效组合
    if (remainingSum === 0) {
      result.push([...currentCombination]) // 深拷贝
      return
    }

    // 剪枝：如果剩余和小于0，直接返回
    if (remainingSum < 0) {
      return
    }

    // 从start开始遍历，避免重复组合
    for (let i = start; i < candidates.length; i++) {
      const candidate = candidates[i]

      // 剪枝：如果当前候选数大于剩余和，跳过
      if (candidate > remainingSum) {
        continue
      }

      // 做选择
      currentCombination.push(candidate)

      // 递归：可以重复使用同一个数字，所以start还是i
      backtrack(i, currentCombination, remainingSum - candidate)

      // 撤销选择（回溯）
      currentCombination.pop()
    }
  }

  // 排序优化剪枝效果
  candidates.sort((a, b) => a - b)
  backtrack(0, [], target)
  return result
}
```

</details>

---

### 4. 双向映射验证器

**难度**: ⭐⭐⭐  
**考察知识点**: Map数据结构、双向映射、一对一关系

**题目描述**：
给定一个模式 pattern 和一个字符串 s，判断 s 是否遵循相同的模式。这里的遵循指完全匹配，例如，pattern 中的每个字母和字符串 s 中的每个非空单词之间存在着双向连接的对应模式。

**输入**：模式字符串 pattern，字符串 s  
**输出**：布尔值

**示例**：

```javascript
wordPatternBidirectional('abba', 'dog cat cat dog') // 返回 true
wordPatternBidirectional('abba', 'dog cat cat fish') // 返回 false
wordPatternBidirectional('aaaa', 'dog cat cat dog') // 返回 false
wordPatternBidirectional('abba', 'dog dog dog dog') // 返回 false
```

**解题提示**：

- 需要建立字符到单词和单词到字符的双向映射
- 确保一对一的映射关系
- 检查映射的一致性

<details>
<summary>标准答案</summary>

```javascript
function wordPatternBidirectional(pattern, s) {
  const words = s.split(' ')

  // 长度不匹配直接返回false
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
```

</details>

---

### 5. 字符串压缩增强版

**难度**: ⭐⭐⭐  
**考察知识点**: 字符串处理、双指针、边界处理

**题目描述**：
实现一个方法，进行基本的字符串压缩，利用重复字符的数量来表示压缩后的字符串。例如，字符串"aabcccccaaa"经压缩会变成"a2b1c5a3"。若压缩后的字符串没有变短，则返回原字符串。

**输入**：字符串 s  
**输出**：压缩后的字符串

**示例**：

```javascript
compressString('aabcccccaaa') // 返回 "a2b1c5a3"
compressString('abcdef') // 返回 "abcdef" (压缩后更长，返回原字符串)
compressString('') // 返回 ""
compressString('a') // 返回 "a"
compressString('aa') // 返回 "a2"
```

**解题提示**：

- 使用双指针或计数器统计连续字符
- 注意处理最后一组字符
- 比较压缩后长度决定返回值

<details>
<summary>标准答案</summary>

```javascript
function compressString(s) {
  if (!s || s.length <= 1) return s

  let compressed = ''
  let count = 1

  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) {
      count++
    } else {
      compressed += s[i - 1] + count
      count = 1
    }
  }

  // 添加最后一组字符
  compressed += s[s.length - 1] + count

  // 如果压缩后的字符串更长，返回原字符串
  return compressed.length < s.length ? compressed : s
}

// 更高效的版本（先计算长度）
function compressStringOptimal(s) {
  if (!s) return s

  // 先计算压缩后的长度
  let compressedLength = 0
  let count = 1

  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) {
      count++
    } else {
      compressedLength += 1 + String(count).length
      count = 1
    }
  }
  compressedLength += 1 + String(count).length

  // 如果压缩后不会变短，直接返回原字符串
  if (compressedLength >= s.length) return s

  // 执行压缩
  let compressed = ''
  count = 1

  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) {
      count++
    } else {
      compressed += s[i - 1] + count
      count = 1
    }
  }
  compressed += s[s.length - 1] + count

  return compressed
}
```

</details>

## ⚠️ 改进空间题目强化（优先级中等）

### 6. 高性能LRU缓存设计

**难度**: ⭐⭐⭐⭐⭐
**考察知识点**: 数据结构设计、时间复杂度优化、双向链表、Map应用

**题目描述**：
设计一个LRU（最近最少使用）缓存，支持get和put操作，要求所有操作的时间复杂度都是O(1)。

**输入**：容量capacity和一系列操作
**输出**：操作结果

**示例**：

```javascript
const lru = new HighPerformanceLRU(2)
lru.put(1, 1) // 缓存是 {1=1}
lru.put(2, 2) // 缓存是 {1=1, 2=2}
console.log(lru.get(1)) // 返回 1，缓存是 {2=2, 1=1}
lru.put(3, 3) // 淘汰键 2，缓存是 {1=1, 3=3}
console.log(lru.get(2)) // 返回 -1 (未找到)
console.log(lru.get(3)) // 返回 3
console.log(lru.get(1)) // 返回 1
```

**解题提示**：

- 需要O(1)时间复杂度的get和put操作
- 考虑使用双向链表 + Map的组合
- 也可以利用Map的插入顺序特性
- 避免使用数组的indexOf和splice操作

<details>
<summary>标准答案</summary>

```javascript
// 方法1：双向链表 + Map（最优解）
class HighPerformanceLRU {
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

// 方法2：利用Map插入顺序（简化版）
class SimpleLRU {
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

// 性能对比分析:
// 双向链表版本: get O(1), put O(1), 空间 O(capacity)
// Map顺序版本: get O(1), put O(1), 空间 O(capacity)
// 数组版本(错误): get O(n), put O(n), 空间 O(capacity)

// 为什么双向链表版本最优:
// 1. 真正的O(1)操作，不依赖于JavaScript引擎优化
// 2. 明确的数据结构设计，易于理解和维护
// 3. 在大容量缓存中性能更稳定

// Map顺序版本的优缺点:
// 优点: 代码简洁，利用ES6 Map的插入顺序特性
// 缺点: 依赖于JavaScript引擎的内部实现，在某些情况下可能不是真正的O(1)
```

</details>

---

### 7. 原地矩阵旋转

**难度**: ⭐⭐⭐⭐  
**考察知识点**: 矩阵操作、原地算法、空间复杂度优化

**题目描述**：
给定一个 n×n 的二维矩阵表示一个图像，将图像顺时针旋转 90 度。你必须在原地旋转图像，这意味着你需要直接修改输入的二维矩阵，不要使用另一个矩阵来旋转图像。

**输入**：n×n 二维矩阵 matrix  
**输出**：无（原地修改）

**示例**：

```javascript
const matrix1 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]
rotateInPlace(matrix1)
console.log(matrix1) // [[7,4,1],[8,5,2],[9,6,3]]

const matrix2 = [
  [5, 1, 9, 11],
  [2, 4, 8, 10],
  [13, 3, 6, 7],
  [15, 14, 12, 16],
]
rotateInPlace(matrix2)
console.log(matrix2) // [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
```

<details>
<summary>标准答案</summary>

```javascript
// 方法1：转置 + 水平翻转
function rotateInPlace(matrix) {
  const n = matrix.length

  // 第一步：转置矩阵
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      ;[matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
    }
  }

  // 第二步：水平翻转每一行
  for (let i = 0; i < n; i++) {
    matrix[i].reverse()
  }
}

// 方法2：直接旋转（四个位置一组）
function rotateInPlaceDirect(matrix) {
  const n = matrix.length

  for (let i = 0; i < Math.floor(n / 2); i++) {
    for (let j = i; j < n - i - 1; j++) {
      // 保存左上角的值
      const temp = matrix[i][j]

      // 左上 = 左下
      matrix[i][j] = matrix[n - 1 - j][i]

      // 左下 = 右下
      matrix[n - 1 - j][i] = matrix[n - 1 - i][n - 1 - j]

      // 右下 = 右上
      matrix[n - 1 - i][n - 1 - j] = matrix[j][n - 1 - i]

      // 右上 = 左上（temp）
      matrix[j][n - 1 - i] = temp
    }
  }
}
```

</details>

---

### 7. 最长公共前缀优化版

**难度**: ⭐⭐⭐  
**考察知识点**: 字符串处理、边界处理、算法优化

**题目描述**：
编写一个函数来查找字符串数组中的最长公共前缀。如果不存在公共前缀，返回空字符串 ""。

**输入**：字符串数组 strs  
**输出**：最长公共前缀字符串

**示例**：

```javascript
longestCommonPrefixOptimal(['flower', 'flow', 'flight']) // 返回 "fl"
longestCommonPrefixOptimal(['dog', 'racecar', 'car']) // 返回 ""
longestCommonPrefixOptimal([]) // 返回 ""
longestCommonPrefixOptimal(['a']) // 返回 "a"
longestCommonPrefixOptimal(['', 'b']) // 返回 ""
```

<details>
<summary>标准答案</summary>

```javascript
// 方法1：垂直扫描
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

// 方法2：水平扫描
function longestCommonPrefixHorizontal(strs) {
  if (!strs || strs.length === 0) return ''

  let prefix = strs[0]

  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1)
      if (prefix === '') return ''
    }
  }

  return prefix
}

// 方法3：分治法
function longestCommonPrefixDivide(strs) {
  if (!strs || strs.length === 0) return ''

  function commonPrefix(left, right) {
    let min = Math.min(left.length, right.length)
    for (let i = 0; i < min; i++) {
      if (left[i] !== right[i]) {
        return left.slice(0, i)
      }
    }
    return left.slice(0, min)
  }

  function divide(strs, start, end) {
    if (start === end) {
      return strs[start]
    }

    const mid = Math.floor((start + end) / 2)
    const leftPrefix = divide(strs, start, mid)
    const rightPrefix = divide(strs, mid + 1, end)

    return commonPrefix(leftPrefix, rightPrefix)
  }

  return divide(strs, 0, strs.length - 1)
}
```

</details>

## 🎯 综合应用题目

### 8. 智能数独验证器

**难度**: ⭐⭐⭐⭐⭐  
**考察知识点**: 二维数组、Set数据结构、数学计算、算法优化

**题目描述**：
判断一个 9×9 的数独是否有效。只需要根据以下规则，验证已经填入的数字是否有效即可。数字 1-9 在每一行只能出现一次，数字 1-9 在每一列只能出现一次，数字 1-9 在每一个以粗实线分隔的 3×3 宫内只能出现一次。

**输入**：9×9 二维字符数组 board  
**输出**：布尔值

**示例**：

```javascript
const validBoard = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
]

isValidSudokuAdvanced(validBoard) // 返回 true
```

<details>
<summary>标准答案</summary>

```javascript
function isValidSudokuAdvanced(board) {
  // 使用Set来检测重复
  const rows = Array.from({ length: 9 }, () => new Set())
  const cols = Array.from({ length: 9 }, () => new Set())
  const boxes = Array.from({ length: 9 }, () => new Set())

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const val = board[i][j]

      // 跳过空格
      if (val === '.') continue

      // 验证数字是否在1-9范围内
      if (!/^[1-9]$/.test(val)) return false

      // 计算3×3宫格的索引
      const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3)

      // 检查行、列、宫格是否有重复
      if (rows[i].has(val) || cols[j].has(val) || boxes[boxIndex].has(val)) {
        return false
      }

      // 添加到对应的Set中
      rows[i].add(val)
      cols[j].add(val)
      boxes[boxIndex].add(val)
    }
  }

  return true
}

// 优化版本：使用位运算
function isValidSudokuBitwise(board) {
  const rows = new Array(9).fill(0)
  const cols = new Array(9).fill(0)
  const boxes = new Array(9).fill(0)

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const val = board[i][j]

      if (val === '.') continue

      const num = parseInt(val)
      const bit = 1 << (num - 1)
      const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3)

      if (rows[i] & bit || cols[j] & bit || boxes[boxIndex] & bit) {
        return false
      }

      rows[i] |= bit
      cols[j] |= bit
      boxes[boxIndex] |= bit
    }
  }

  return true
}
```

</details>

---

### 9. 多维数组处理器

**难度**: ⭐⭐⭐⭐⭐  
**考察知识点**: 递归、数组处理、函数式编程、类型检查

**题目描述**：
实现一个多维数组处理器，支持以下功能：

1. 扁平化任意维度的数组
2. 计算数组的深度
3. 查找特定值在多维数组中的路径
4. 将扁平数组重构为指定维度的多维数组

**示例**：

```javascript
const processor = new MultiArrayProcessor()

// 扁平化
processor.flatten([1, [2, [3, 4]], 5]) // [1, 2, 3, 4, 5]

// 计算深度
processor.getDepth([1, [2, [3, 4]], 5]) // 3

// 查找路径
processor.findPath([1, [2, [3, 4]], 5], 3) // [1, 1, 0]

// 重构数组
processor.reshape([1, 2, 3, 4, 5, 6], [2, 3]) // [[1, 2, 3], [4, 5, 6]]
```

<details>
<summary>标准答案</summary>

```javascript
class MultiArrayProcessor {
  // 扁平化数组
  flatten(arr) {
    const result = []

    function flattenHelper(item) {
      if (Array.isArray(item)) {
        for (const element of item) {
          flattenHelper(element)
        }
      } else {
        result.push(item)
      }
    }

    flattenHelper(arr)
    return result
  }

  // 计算数组深度
  getDepth(arr) {
    if (!Array.isArray(arr)) return 0

    let maxDepth = 1
    for (const item of arr) {
      if (Array.isArray(item)) {
        maxDepth = Math.max(maxDepth, 1 + this.getDepth(item))
      }
    }

    return maxDepth
  }

  // 查找值的路径
  findPath(arr, target) {
    function search(current, path) {
      if (!Array.isArray(current)) {
        return current === target ? path : null
      }

      for (let i = 0; i < current.length; i++) {
        const result = search(current[i], [...path, i])
        if (result !== null) return result
      }

      return null
    }

    return search(arr, [])
  }

  // 重构数组
  reshape(flatArray, dimensions) {
    if (flatArray.length !== dimensions.reduce((a, b) => a * b, 1)) {
      throw new Error('Array length does not match dimensions')
    }

    function buildArray(dims, startIndex) {
      if (dims.length === 1) {
        return flatArray.slice(startIndex, startIndex + dims[0])
      }

      const result = []
      const subSize = dims.slice(1).reduce((a, b) => a * b, 1)

      for (let i = 0; i < dims[0]; i++) {
        result.push(buildArray(dims.slice(1), startIndex + i * subSize))
      }

      return result
    }

    return buildArray(dimensions, 0)
  }

  // 获取指定路径的值
  getValue(arr, path) {
    let current = arr
    for (const index of path) {
      if (!Array.isArray(current) || index >= current.length) {
        return undefined
      }
      current = current[index]
    }
    return current
  }

  // 设置指定路径的值
  setValue(arr, path, value) {
    let current = arr
    for (let i = 0; i < path.length - 1; i++) {
      if (!Array.isArray(current) || path[i] >= current.length) {
        return false
      }
      current = current[path[i]]
    }

    if (Array.isArray(current) && path[path.length - 1] < current.length) {
      current[path[path.length - 1]] = value
      return true
    }

    return false
  }
}
```

</details>

## 📚 练习建议

### 🎯 基于最新评估的练习策略

**题目分布统计**：

- 🔴 **严重错误重练**: 6道题 (字符串算法、路径处理、回溯算法)
- ⚠️ **改进空间强化**: 2道题 (性能优化、原地算法)
- 🎯 **综合应用**: 2道题 (系统设计、多维数组处理)

### 📈 分阶段练习计划

**第一阶段（1-2周）**：攻克严重错误

1. 完成最长回文子串检测器（中心扩展法）
2. 掌握智能数字验证器（正则表达式/状态机）
3. 练习Unix路径简化器（栈数据结构）
4. 重新实现组合总和（回溯算法）

**第二阶段（1周）**：性能优化

1. 设计高性能LRU缓存（双向链表+Map）
2. 实现原地矩阵旋转（空间复杂度优化）

**第三阶段（1周）**：综合应用

1. 挑战智能数独验证器（复杂验证逻辑）
2. 完成多维数组处理器（递归和类型检查）

### 💡 学习方法建议

1. **理解优先**: 先理解算法原理，再动手编码
2. **模板记忆**: 背诵并理解常用算法模板
3. **复杂度分析**: 每道题都要分析时间和空间复杂度
4. **边界测试**: 重点测试空输入、单元素、极值等边界情况
5. **性能对比**: 对比不同解法的性能差异
6. **实际应用**: 思考算法在实际项目中的应用场景

### 🔍 重点关注领域

**字符串算法**（40%重要性）：

- 回文检测的多种方法
- 正则表达式的高级应用
- 字符串验证和格式解析

**数据结构设计**（30%重要性）：

- 栈的应用场景
- 双向链表的实现
- Map和Set的高效使用

**算法优化**（20%重要性）：

- 时间复杂度分析
- 空间复杂度优化
- 原地算法的实现

**系统设计**（10%重要性）：

- 缓存系统设计
- 数据结构的选择
- 性能瓶颈识别

## 🎯 重点提醒

### 🚨 必须避免的错误模式

1. **算法理解错误**：仔细阅读题目，确保理解正确
2. **数据结构误用**：选择合适的数据结构解决问题
3. **性能忽视**：关注时间复杂度，避免低效操作
4. **边界遗漏**：考虑空值、极值等特殊情况
5. **逻辑颠倒**：注意函数返回值的逻辑正确性

### 📊 成功标准

- **严重错误题目**：能够独立完成，代码通过所有测试用例
- **改进题目**：理解性能优化点，能够实现O(1)复杂度
- **综合题目**：能够设计合理的数据结构和算法
- **整体提升**：算法思维从模糊到清晰，从错误到正确

### 🎖️ 进阶目标

- 掌握字符串算法的核心模式
- 熟练使用栈解决路径和括号问题
- 理解缓存系统的设计原理
- 培养对算法复杂度的敏感度
- 形成系统性的问题分析能力
