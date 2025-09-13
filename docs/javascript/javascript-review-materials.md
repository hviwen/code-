# JavaScript 针对性复习资料

基于练习题评估结果，按优先级整理的JavaScript核心知识点复习材料。

## 🔴 严重错误知识点复习（优先级最高）

### 1. 字符串模式匹配与正则表达式

#### 概念解释
正则表达式是用于匹配字符串中字符组合的模式，JavaScript中通过RegExp对象或字面量语法使用。

#### 核心原理
- **字面量语法**: `/pattern/flags`
- **构造函数**: `new RegExp(pattern, flags)`
- **常用方法**: `test()`, `match()`, `replace()`, `split()`

#### 标准语法和基本用法
```javascript
// 基本匹配
const regex = /hello/i; // i表示忽略大小写
regex.test("Hello World"); // true

// 字符类
/[a-z]/g    // 匹配任意小写字母
/[^0-9]/    // 匹配非数字字符
/\w/        // 匹配单词字符 [a-zA-Z0-9_]
/\s/        // 匹配空白字符

// 量词
/a+/        // 一个或多个a
/a*/        // 零个或多个a
/a?/        // 零个或一个a
/a{2,4}/    // 2到4个a

// 边界
/^start/    // 行开始
/end$/      // 行结束
/\b/        // 单词边界
```

#### 最佳实践和常见陷阱
```javascript
// ✅ 正确：提取所有匹配项
const vowels = text.match(/[aeiou]/gi) || [];

// ❌ 错误：没有处理null情况
const vowels = text.match(/[aeiou]/gi).length; // 可能报错

// ✅ 正确：检查连续单词
function hasThreeConsecutiveWords(text) {
  const words = text.split(/\s+/).filter(word => /^[a-zA-Z]+$/.test(word));
  for (let i = 0; i <= words.length - 3; i++) {
    // 检查连续三个单词的逻辑
  }
}

// ❌ 错误：误解题意
function threeWords(text) {
  return text.split(' ').length === 3; // 检查总数而非连续
}
```

#### 相关练习题
1. 验证邮箱格式：`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
2. 提取URL中的域名
3. 检查密码强度（包含大小写、数字、特殊字符）
4. 替换文本中的敏感词
5. 解析CSV格式数据

#### 常见面试题
- 如何用正则表达式验证手机号码？
- 解释贪婪匹配和非贪婪匹配的区别
- 如何匹配HTML标签？
- 正则表达式的性能优化技巧

### 2. 数组方法与函数式编程

#### 概念解释
JavaScript数组提供了丰富的方法，分为变异方法（修改原数组）和非变异方法（返回新数组）。

#### 核心原理
- **变异方法**: `push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `sort()`, `reverse()`
- **非变异方法**: `map()`, `filter()`, `reduce()`, `slice()`, `concat()`, `join()`
- **查找方法**: `find()`, `findIndex()`, `indexOf()`, `includes()`

#### 标准语法和基本用法
```javascript
// 变异方法（修改原数组）
const arr = [1, 2, 3];
arr.push(4);        // [1, 2, 3, 4]
arr.splice(1, 1);   // [1, 3, 4]

// 非变异方法（返回新数组）
const newArr = arr.map(x => x * 2);     // [2, 6, 8]
const filtered = arr.filter(x => x > 2); // [3, 4]
const sum = arr.reduce((acc, x) => acc + x, 0); // 8
```

#### 最佳实践和常见陷阱
```javascript
// ✅ 正确：避免修改原数组
function sortByAbsolute(arr) {
  return [...arr].sort((a, b) => Math.abs(a) - Math.abs(b));
}

// ❌ 错误：修改原数组
function sortByAbsolute(arr) {
  return arr.sort((a, b) => Math.abs(a) - Math.abs(b));
}

// ✅ 正确：使用合适的数组方法
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return Array.from(duplicates);
}

// ❌ 错误：使用Map但逻辑错误
function findDuplicates(arr) {
  const map = new Map();
  // 复杂且容易出错的逻辑...
}
```

#### 相关练习题
1. 数组去重的多种方法实现
2. 数组扁平化（手动实现flat方法）
3. 实现数组的groupBy方法
4. 找出数组中的最大/最小值及其索引
5. 数组元素按频率排序

#### 常见面试题
- 解释map、filter、reduce的区别和使用场景
- 如何在不修改原数组的情况下添加元素？
- 实现一个深拷贝函数
- 数组去重的几种方法及其性能对比

### 3. 算法逻辑与问题理解

#### 概念解释
正确理解问题需求是解决算法问题的第一步，需要仔细分析题目描述、输入输出要求和示例。

#### 核心原理
- **问题分解**: 将复杂问题分解为简单子问题
- **边界条件**: 考虑空值、极值、特殊情况
- **算法选择**: 根据问题特点选择合适的算法和数据结构
- **时间复杂度**: 分析算法效率

#### 标准解题思路
```javascript
// 1. 理解题目要求
// 2. 分析输入输出
// 3. 考虑边界情况
// 4. 选择算法策略
// 5. 编写代码
// 6. 测试验证

// 示例：连续重复字符的最长长度
function longRepeat(str) {
  if (!str) return 0; // 边界处理
  
  let maxLength = 1;
  let currentLength = 1;
  
  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i - 1]) {
      currentLength++;
      maxLength = Math.max(maxLength, currentLength);
    } else {
      currentLength = 1;
    }
  }
  
  return maxLength;
}
```

#### 最佳实践和常见陷阱
```javascript
// ✅ 正确：理解"连续"的含义
function longRepeat(str) {
  // 检查连续相同字符的最长长度
}

// ❌ 错误：误解为字符总出现次数
function longRepeat(str) {
  const map = new Map();
  // 统计每个字符的总出现次数...
}

// ✅ 正确：括号匹配使用栈
function isValidParentheses(s) {
  const stack = [];
  const pairs = {'(': ')', '[': ']', '{': '}'};
  
  for (const char of s) {
    if (char in pairs) {
      stack.push(char);
    } else if (Object.values(pairs).includes(char)) {
      const last = stack.pop();
      if (!last || pairs[last] !== char) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}

// ❌ 错误：简单相加无法处理顺序
function isValidParentheses(s) {
  // 将括号转换为数字相加...
}
```

#### 相关练习题
1. 两数之和问题的多种解法
2. 字符串回文检测
3. 链表反转
4. 二叉树遍历
5. 动态规划入门题目

#### 常见面试题
- 如何分析算法的时间和空间复杂度？
- 什么时候使用递归，什么时候使用迭代？
- 如何优化算法性能？
- 常见的算法设计模式有哪些？

## ⚠️ 需要改进知识点复习（优先级中等）

### 1. 函数式编程原则

#### 避免副作用
```javascript
// ✅ 纯函数：不修改输入，返回新值
const addElement = (arr, element) => [...arr, element];

// ❌ 有副作用：修改原数组
const addElement = (arr, element) => {
  arr.push(element);
  return arr;
};
```

#### 不可变性
```javascript
// ✅ 创建新对象
const updateUser = (user, updates) => ({...user, ...updates});

// ❌ 修改原对象
const updateUser = (user, updates) => {
  Object.assign(user, updates);
  return user;
};
```

### 2. 现代JavaScript特性

#### ES6+解构和扩展运算符
```javascript
// 解构赋值
const [first, ...rest] = array;
const {name, age} = person;

// 扩展运算符
const newArray = [...oldArray, newItem];
const mergedObject = {...obj1, ...obj2};
```

#### 模板字符串和箭头函数
```javascript
// 模板字符串
const message = `Hello, ${name}!`;

// 箭头函数
const multiply = (a, b) => a * b;
const numbers = [1, 2, 3].map(n => n * 2);
```

### 3. 错误处理和边界情况

#### 输入验证
```javascript
function processArray(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }
  
  if (arr.length === 0) {
    return [];
  }
  
  // 处理逻辑...
}
```

#### 空值处理
```javascript
// 使用可选链和空值合并
const value = obj?.property?.subProperty ?? defaultValue;

// 数组方法的安全使用
const matches = text.match(/pattern/g) || [];
```

## 📚 基础巩固知识点

### 1. 数据结构应用

#### Map和Set的使用
```javascript
// Map用于键值对存储
const frequency = new Map();
for (const item of array) {
  frequency.set(item, (frequency.get(item) || 0) + 1);
}

// Set用于去重
const unique = [...new Set(array)];
```

#### 栈和队列的实现
```javascript
// 栈（LIFO）
const stack = [];
stack.push(item);    // 入栈
const top = stack.pop(); // 出栈

// 队列（FIFO）
const queue = [];
queue.push(item);        // 入队
const first = queue.shift(); // 出队
```

### 2. 性能优化技巧

#### 时间复杂度优化
```javascript
// O(n²) -> O(n)
// 使用Map代替嵌套循环查找
const map = new Map();
for (const item of array1) {
  map.set(item.id, item);
}
for (const item of array2) {
  const found = map.get(item.id); // O(1)查找
}
```

#### 空间复杂度优化
```javascript
// 原地算法减少空间使用
function reverseString(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}
```

## 📝 学习建议

1. **每日练习**: 每天至少解决1-2道算法题
2. **代码审查**: 定期回顾自己的代码，寻找改进空间
3. **最佳实践**: 学习和应用JavaScript编码规范
4. **性能意识**: 关注算法的时间和空间复杂度
5. **测试驱动**: 为代码编写测试用例，确保正确性

## 🎯 重点提醒

- 优先解决严重错误的知识点
- 养成函数式编程的思维习惯
- 重视边界情况的处理
- 持续练习和总结经验
