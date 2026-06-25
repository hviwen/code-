# 003. [初级]** 如何判断一个变量是否为数组？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这道题考察数组类型检测的多种方法，面试官想了解你是否知道不同方法的优缺点和适用场景。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：数据类型与变量（15道），重点是 Array.isArray 与 instanceof 的差异、跨 iframe 边界问题、Object.prototype.toString.call 的通用性，以及类数组对象的识别与转换。

## 技术错误纠正

1. 原答案基本正确，但缺少其他方法和使用场景说明
2. 没有说明各方法的优缺点和兼容性问题

## 知识点系统梳理

- Array.isArray
- Object.prototype.toString.call(arr) === '[object Array]'


**数组检测的多种方法：**
1. **Array.isArray()** - 最推荐的方法（ES5+）
2. **Object.prototype.toString.call()** - 最可靠的方法
3. **instanceof Array** - 有局限性
4. **constructor属性** - 不可靠
5. **Array.prototype.isPrototypeOf()** - 较少使用

### 实战应用举例
```javascript
// 测试数据
const arr = [1, 2, 3]
const obj = { 0: 1, 1: 2, 2: 3, length: 3 } // 类数组对象
const str = 'hello'
const num = 123
const nodeList = document.querySelectorAll('div') // NodeList

// 1. Array.isArray() - 推荐方法
console.log(Array.isArray(arr)) // true
console.log(Array.isArray(obj)) // false
console.log(Array.isArray(str)) // false
console.log(Array.isArray(nodeList)) // false

// 2. Object.prototype.toString.call() - 最可靠
function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}

console.log(isArray(arr)) // true
console.log(isArray(obj)) // false
console.log(isArray(nodeList)) // false

// 3. instanceof Array - 有跨iframe问题
console.log(arr instanceof Array) // true
console.log(obj instanceof Array) // false

// 跨iframe问题演示
// 如果数组来自不同的iframe，instanceof会失败
// const iframeArray = iframe.contentWindow.Array([1, 2, 3])
// console.log(iframeArray instanceof Array) // false!
// console.log(Array.isArray(iframeArray)) // true

// 4. constructor属性 - 不可靠
console.log(arr.constructor === Array) // true
// 但constructor可以被修改
arr.constructor = Object
console.log(arr.constructor === Array) // false
console.log(Array.isArray(arr)) // true - 仍然正确

// 5. Array.prototype.isPrototypeOf()
console.log(Array.prototype.isPrototypeOf(arr)) // true
console.log(Array.prototype.isPrototypeOf(obj)) // false

// 实际项目中的应用场景

// 1. 参数标准化
function normalizeToArray(value) {
  if (Array.isArray(value)) {
    return value
  }
  if (value == null) {
    return []
  }
  return [value]
}

console.log(normalizeToArray('hello')) // ['hello']
console.log(normalizeToArray(['a', 'b'])) // ['a', 'b']
console.log(normalizeToArray(null)) // []

// 2. 类数组对象转换
function toArray(arrayLike) {
  if (Array.isArray(arrayLike)) {
    return arrayLike
  }

  // 检查是否是类数组对象
  if (arrayLike != null &&
      typeof arrayLike === 'object' &&
      typeof arrayLike.length === 'number' &&
      arrayLike.length >= 0) {
    return Array.from(arrayLike)
  }

  return [arrayLike]
}

// 使用示例
console.log(toArray(nodeList)) // 转换NodeList为数组
console.log(toArray(arguments)) // 转换arguments为数组
console.log(toArray('hello')) // ['hello']

// 3. 深度数组检测
function isNestedArray(value) {
  return Array.isArray(value) && value.some(item => Array.isArray(item))
}

console.log(isNestedArray([1, 2, 3])) // false
console.log(isNestedArray([1, [2, 3]])) // true

// 4. 类型安全的数组操作
function safeArrayOperation(arr, operation) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Expected an array')
  }

  return operation(arr)
}

// 使用示例
try {
  const result = safeArrayOperation([1, 2, 3], arr => arr.map(x => x * 2))
  console.log(result) // [2, 4, 6]
} catch (error) {
  console.error(error.message)
}

// 5. 通用类型检测工具
const TypeDetector = {
  isArray: Array.isArray,

  isArrayLike(value) {
    return value != null &&
           typeof value === 'object' &&
           typeof value.length === 'number' &&
           value.length >= 0 &&
           value.length <= Number.MAX_SAFE_INTEGER
  },

  isEmptyArray(value) {
    return Array.isArray(value) && value.length === 0
  },

  isSparseArray(value) {
    if (!Array.isArray(value)) return false
    for (let i = 0; i < value.length; i++) {
      if (!(i in value)) return true
    }
    return false
  }
}

// 使用示例
console.log(TypeDetector.isArrayLike([1, 2, 3])) // true
console.log(TypeDetector.isArrayLike(nodeList)) // true
console.log(TypeDetector.isArrayLike('hello')) // false
console.log(TypeDetector.isEmptyArray([])) // true
console.log(TypeDetector.isSparseArray([1, , 3])) // true
```

**使用场景对比：**

| 方法 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| Array.isArray() | 简洁、可靠、跨iframe | ES5+才支持 | 现代项目首选 |
| toString.call() | 最可靠、兼容性好 | 代码较长 | 需要兼容老浏览器 |
| instanceof | 简洁 | 跨iframe失败 | 简单场景 |
| constructor | 简洁 | 可被修改 | 不推荐 |

### 记忆要点总结
- **首选方法**：Array.isArray() - 简洁可靠
- **兼容方案**：Object.prototype.toString.call()
- **避免使用**：instanceof（跨iframe问题）、constructor（可修改）
- **实际应用**：参数标准化、类数组转换、类型安全检查
- **扩展检测**：类数组对象、空数组、稀疏数组的检测

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

**数组检测方法对比：**

| 方法 | 跨iframe | 可靠性 | 兼容性 | 推荐度 |
|------|---------|--------|--------|-------|
| `Array.isArray(x)` | ✅ | 高 | ES5+ | ⭐⭐⭐ 首选 |
| `Object.prototype.toString.call(x)` | ✅ | 最高 | 全兼容 | ⭐⭐⭐ 兼容方案 |
| `x instanceof Array` | ❌ | 中 | 全兼容 | ⭐ 简单场景 |
| `x.constructor === Array` | ❌ | 低（可被篡改） | 全兼容 | 不推荐 |

**业务场景：**

```javascript
// 场景1：API返回数据标准化（可能返回单个对象或数组）
function normalizeResponse(data) {
  return Array.isArray(data) ? data : [data]
}
// fetchUsers() 可能返回 {name:'Tom'} 或 [{name:'Tom'},{name:'Jerry'}]

// 场景2：跨iframe通信（如微前端、iframe嵌入）
// 子iframe传来的数组，instanceof会失败
window.addEventListener('message', (e) => {
  // ❌ e.data instanceof Array — 跨realm失败
  // ✅ Array.isArray(e.data)
  if (Array.isArray(e.data)) {
    e.data.forEach(process)
  }
})

// 场景3：区分数组和类数组（NodeList、arguments、HTMLCollection）
const divs = document.querySelectorAll('div')
Array.isArray(divs)     // false — NodeList不是数组
Array.from(divs)        // 转为真正的数组
[...divs]               // 同上，展开运算符

// 场景4：工具函数中的类型守卫
function flatten(input) {
  if (!Array.isArray(input)) return [input]
  return input.flat(Infinity)
}
```

## 易错点提示

**1. `typeof []` 返回 `'object'`，不能用typeof判断数组：**
```javascript
typeof []     // 'object' ← 数组也是对象
typeof {}     // 'object'
typeof null   // 'object'
// 三者typeof结果相同，必须用Array.isArray区分
```

**2. `instanceof Array` 在跨iframe/跨realm时失败：**
```javascript
// 主页面
const iframe = document.createElement('iframe')
document.body.appendChild(iframe)
const IframeArray = iframe.contentWindow.Array
const arr = new IframeArray(1, 2, 3)

arr instanceof Array       // false ← 不同realm的Array构造函数不同
Array.isArray(arr)          // true  ← 正确
```

**3. `arguments` 是类数组，不是真正的数组：**
```javascript
function test() {
  Array.isArray(arguments) // false
  arguments.map            // undefined — 没有数组方法
  Array.from(arguments)    // 转为真正的数组
  [...arguments]           // 同上
}
```

**4. `Array.isArray` 是ES5方法，极老浏览器需polyfill：**
```javascript
// IE8及以下需要polyfill（现代项目基本不用考虑）
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}
```

## 记忆要点总结

- **首选**：`Array.isArray()` — 简洁、跨iframe可靠、ES5+
- **兼容方案**：`Object.prototype.toString.call(x) === '[object Array]'`
- **避免用**：`instanceof`（跨iframe失败）、`constructor`（可被篡改）
- **typeof陷阱**：`typeof [] === 'object'`，不能区分数组和普通对象
- **类数组转换**：`Array.from(nodeList)` 或 `[...nodeList]`

## 延伸问题

类数组对象（如NodeList、arguments、HTMLCollection）和真正的数组有什么区别？如何将类数组转换为数组？

## 可能类似的问题及简要参考答案

**Q：`typeof []` 返回什么？为什么不能用typeof判断数组？**
A：返回 `'object'`。因为数组本质是特殊的对象，typeof无法区分数组、普通对象和null。应该用 `Array.isArray()` 判断。

**Q：`instanceof` 在什么情况下判断数组会失败？**
A：在跨iframe或跨window场景下会失败，因为不同执行环境有各自独立的 `Array` 构造函数，`instanceof` 比较的是原型链上的构造函数引用。

## 辅助记忆总结

判断数组首选 `Array.isArray()`，它跨iframe可靠；`typeof` 返回 `'object'` 无法区分，`instanceof` 跨执行环境会失败。
