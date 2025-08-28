## JavaScript基础语法和概念

### 数据类型与变量（15道）

**001. [初级]** 请解释JavaScript中的原始数据类型有哪些？

string number boolean null undefined Symbol bigInt

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript基础类型系统的理解，面试官想了解你是否掌握ES6+新增的原始类型以及各类型的特点和使用场景。

**技术错误纠正：**
1. 格式不规范，应该用标准的类型名称
2. 缺少ES2020新增的原始类型说明
3. 没有说明各类型的特点和用途

**知识点系统梳理：**

JavaScript共有7种原始数据类型（Primitive Types）：

1. **string** - 字符串类型
2. **number** - 数值类型（包括整数和浮点数）
3. **boolean** - 布尔类型
4. **null** - 空值类型
5. **undefined** - 未定义类型
6. **symbol** - 符号类型（ES6新增）
7. **bigint** - 大整数类型（ES2020新增）

**实战应用举例：**
```javascript
// 1. string - 字符串类型
const name = 'JavaScript'
const template = `Hello, ${name}!` // 模板字符串
const unicode = '\u{1F600}' // Unicode字符

// 2. number - 数值类型
const integer = 42
const float = 3.14159
const scientific = 1.23e-4
const infinity = Infinity
const notANumber = NaN

// 3. boolean - 布尔类型
const isTrue = true
const isFalse = false
const computed = 5 > 3 // true

// 4. null - 表示"无值"或"空值"
const empty = null
const reset = null // 常用于重置变量

// 5. undefined - 表示"未定义"
let uninitialized // undefined
const obj = {}
console.log(obj.nonExistent) // undefined

// 6. symbol - 唯一标识符（ES6）
const sym1 = Symbol('description')
const sym2 = Symbol('description')
console.log(sym1 === sym2) // false，每个Symbol都是唯一的

// Symbol的实际应用
const PRIVATE_KEY = Symbol('private')
const obj = {
  publicProp: 'visible',
  [PRIVATE_KEY]: 'hidden'
}

// 7. bigint - 大整数（ES2020）
const bigNumber = 123456789012345678901234567890n
const anotherBig = BigInt('123456789012345678901234567890')
const maxSafeInt = Number.MAX_SAFE_INTEGER // 9007199254740991
const beyondSafe = 9007199254740992n // 需要使用BigInt

// 类型检测
console.log(typeof 'hello') // 'string'
console.log(typeof 42) // 'number'
console.log(typeof true) // 'boolean'
console.log(typeof null) // 'object' (历史遗留问题)
console.log(typeof undefined) // 'undefined'
console.log(typeof Symbol()) // 'symbol'
console.log(typeof 123n) // 'bigint'

// 原始类型的特点演示
let a = 'hello'
let b = a
b = 'world'
console.log(a) // 'hello' - 原始类型是按值传递的

// 自动装箱示例
const str = 'hello'
console.log(str.length) // 5 - 临时转换为String对象
console.log(str.toUpperCase()) // 'HELLO'
```

**使用场景对比：**

| 类型 | 使用场景 | 注意事项 |
|------|----------|----------|
| string | 文本数据、模板、标识符 | 不可变，支持Unicode |
| number | 数值计算、索引、计数 | IEEE 754双精度，有精度限制 |
| boolean | 条件判断、开关状态 | 只有true/false两个值 |
| null | 明确表示"无值" | 用于重置或初始化 |
| undefined | 表示"未定义" | 默认值，避免主动赋值 |
| symbol | 对象属性键、常量 | 唯一性，不可枚举 |
| bigint | 大整数运算 | 不能与number混合运算 |

**记忆要点总结：**
- **7种原始类型**：string, number, boolean, null, undefined, symbol, bigint
- **存储特点**：按值存储，不可变，栈内存
- **ES6+新增**：symbol（ES6）、bigint（ES2020）
- **类型检测**：typeof操作符（注意null返回'object'）
- **自动装箱**：原始类型可以调用对应包装对象的方法



**002. [初级]** `typeof null` 返回什么值？为什么？

object; javaScript 创建之初把null归到了object中，是历史遗留问题

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript中一个著名的历史bug，面试官想了解你是否知道这个特殊情况以及如何正确检测null值。

**技术错误纠正：**
1. "javaScript"应为"JavaScript"
2. 解释过于简单，缺少技术细节和解决方案

**知识点系统梳理：**

**typeof null返回'object'的原因：**
- 这是JavaScript语言设计初期的一个bug
- 在JavaScript的最初实现中，值是由类型标签和值组成的
- null的类型标签是0，而对象的类型标签也是0
- 因此typeof null被错误地识别为'object'

**历史背景：**
- 这个bug存在于JavaScript 1.0中
- 虽然后来被发现，但为了向后兼容性，一直保留至今
- 这被认为是JavaScript语言中最著名的bug之一

**实战应用举例：**
```javascript
// typeof null的问题演示
console.log(typeof null) // 'object' - 这是一个bug！
console.log(typeof undefined) // 'undefined'
console.log(typeof {}) // 'object'
console.log(typeof []) // 'object'

// 正确检测null的方法
function isNull(value) {
  return value === null
}

// 更完整的类型检测
function getType(value) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  return typeof value
}

// 使用Object.prototype.toString进行精确类型检测
function preciseType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

console.log(preciseType(null)) // 'null'
console.log(preciseType(undefined)) // 'undefined'
console.log(preciseType({})) // 'object'
console.log(preciseType([])) // 'array'
console.log(preciseType('hello')) // 'string'

// 实际项目中的null检测
function safeAccess(obj, path) {
  if (obj === null || obj === undefined) {
    return undefined
  }

  return path.split('.').reduce((current, key) => {
    return (current !== null && current !== undefined) ? current[key] : undefined
  }, obj)
}

// 使用示例
const user = {
  profile: {
    name: 'John',
    address: null
  }
}

console.log(safeAccess(user, 'profile.name')) // 'John'
console.log(safeAccess(user, 'profile.address.street')) // undefined
console.log(safeAccess(null, 'anything')) // undefined

// 现代JavaScript的解决方案
// 可选链操作符（ES2020）
console.log(user?.profile?.address?.street) // undefined

// 空值合并操作符（ES2020）
const defaultName = user?.profile?.name ?? 'Anonymous'

// 类型守卫函数
function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

// 实用的类型检测工具函数
const TypeChecker = {
  isNull: (value) => value === null,
  isUndefined: (value) => value === undefined,
  isNullish: (value) => value == null, // null或undefined
  isObject: (value) => value !== null && typeof value === 'object' && !Array.isArray(value),
  isArray: (value) => Array.isArray(value),
  isPrimitive: (value) => {
    const type = typeof value
    return type !== 'object' && type !== 'function'
  }
}

// 使用示例
console.log(TypeChecker.isNull(null)) // true
console.log(TypeChecker.isNull(undefined)) // false
console.log(TypeChecker.isNullish(null)) // true
console.log(TypeChecker.isNullish(undefined)) // true
console.log(TypeChecker.isObject({})) // true
console.log(TypeChecker.isObject(null)) // false
```

**常见陷阱和解决方案：**
```javascript
// 陷阱1：使用typeof检测null
if (typeof value === 'object') {
  // 这里可能包含null！
}

// 解决方案：
if (value !== null && typeof value === 'object') {
  // 现在确保是真正的对象
}

// 陷阱2：混淆null和undefined
function processValue(value) {
  if (!value) { // null、undefined、0、''、false都会进入
    return 'empty'
  }
  return value
}

// 解决方案：明确检测
function processValue(value) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (value === '') return 'empty string'
  if (value === 0) return 'zero'
  return value
}
```

**记忆要点总结：**
- **typeof null返回'object'**：这是JavaScript的历史bug
- **正确检测null**：使用 `value === null`
- **精确类型检测**：使用 `Object.prototype.toString.call()`
- **现代解决方案**：可选链(?.)和空值合并(??)操作符
- **最佳实践**：明确区分null、undefined和其他falsy值



**003. [初级]** 如何判断一个变量是否为数组？

- Array.isArray
- Object.prototype.toString.call(arr) === '[object Array]'

## 深度分析与补充

**问题本质解读：** 这道题考察数组类型检测的多种方法，面试官想了解你是否知道不同方法的优缺点和适用场景。

**技术错误纠正：**
1. 原答案基本正确，但缺少其他方法和使用场景说明
2. 没有说明各方法的优缺点和兼容性问题

**知识点系统梳理：**

**数组检测的多种方法：**
1. **Array.isArray()** - 最推荐的方法（ES5+）
2. **Object.prototype.toString.call()** - 最可靠的方法
3. **instanceof Array** - 有局限性
4. **constructor属性** - 不可靠
5. **Array.prototype.isPrototypeOf()** - 较少使用

**实战应用举例：**
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

**记忆要点总结：**
- **首选方法**：Array.isArray() - 简洁可靠
- **兼容方案**：Object.prototype.toString.call()
- **避免使用**：instanceof（跨iframe问题）、constructor（可修改）
- **实际应用**：参数标准化、类数组转换、类型安全检查
- **扩展检测**：类数组对象、空数组、稀疏数组的检测



**004. [中级]** 解释`==`和`===`的区别，并举例说明

== 是判断值相等，即不同类型的数据在通过比较后，最终通过类型转化后的值相等

=== 是全等，即不仅要类型相等而且还要满足值相等才相等

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript中相等性比较的核心概念，面试官想了解你是否理解类型转换规则和最佳实践。

**技术错误纠正：**
1. 原答案基本正确，但缺少具体的类型转换规则
2. 没有提供足够的示例来说明复杂情况
3. 缺少实际开发中的最佳实践建议

**知识点系统梳理：**

**== (抽象相等) vs === (严格相等)：**

**=== 严格相等：**
- 不进行类型转换
- 类型和值都必须相同
- 推荐在大多数情况下使用

**== 抽象相等：**
- 会进行类型转换（ToPrimitive算法）
- 按照ECMAScript规范的复杂规则进行转换
- 容易产生意外结果

**实战应用举例：**
```javascript
// === 严格相等示例
console.log(5 === 5) // true - 相同类型，相同值
console.log(5 === '5') // false - 不同类型
console.log(true === 1) // false - 不同类型
console.log(null === undefined) // false - 不同类型
console.log(NaN === NaN) // false - NaN不等于任何值，包括自己

// == 抽象相等示例
console.log(5 == '5') // true - 字符串'5'转换为数字5
console.log(true == 1) // true - true转换为1
console.log(false == 0) // true - false转换为0
console.log(null == undefined) // true - 特殊规则
console.log('' == 0) // true - 空字符串转换为0

// 复杂的类型转换示例
console.log([] == false) // true
// 转换过程：
// [] -> ToPrimitive([]) -> '' -> ToNumber('') -> 0
// false -> ToNumber(false) -> 0
// 0 == 0 -> true

console.log([] == ![]) // true
// 转换过程：
// ![] -> false (空数组是truthy，取反为false)
// [] == false -> 上面的例子 -> true

console.log('0' == false) // true
// 转换过程：
// false -> 0
// '0' -> 0
// 0 == 0 -> true

console.log(false == 'false') // false
// 转换过程：
// false -> 0
// 'false' -> NaN
// 0 == NaN -> false

// 对象比较
const obj1 = { a: 1 }
const obj2 = { a: 1 }
const obj3 = obj1

console.log(obj1 === obj2) // false - 不同的对象引用
console.log(obj1 === obj3) // true - 相同的对象引用
console.log(obj1 == obj2) // false - 对象比较引用，不比较内容

// 特殊值的比较
console.log(+0 === -0) // true - 正零等于负零
console.log(Object.is(+0, -0)) // false - Object.is更严格
console.log(NaN === NaN) // false
console.log(Object.is(NaN, NaN)) // true - Object.is可以正确比较NaN

// 实际项目中的应用场景

// 1. 安全的相等性检查
function safeEquals(a, b) {
  // 使用严格相等
  if (a === b) return true

  // 特殊处理NaN
  if (Number.isNaN(a) && Number.isNaN(b)) return true

  return false
}

// 2. 深度相等比较
function deepEqual(a, b) {
  if (a === b) return true

  if (a == null || b == null) return false

  if (typeof a !== typeof b) return false

  if (typeof a === 'object') {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    return keysA.every(key => deepEqual(a[key], b[key]))
  }

  return false
}

// 使用示例
console.log(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })) // true
console.log(deepEqual([1, 2, 3], [1, 2, 3])) // true

// 3. 类型转换的实际应用
function parseUserInput(input) {
  // 明确的类型转换，而不是依赖==
  if (input === null || input === undefined || input === '') {
    return null
  }

  // 尝试转换为数字
  const num = Number(input)
  if (!Number.isNaN(num)) {
    return num
  }

  // 布尔值转换
  if (input === 'true') return true
  if (input === 'false') return false

  // 返回字符串
  return String(input)
}

// 4. 条件判断的最佳实践
function processValue(value) {
  // ❌ 避免使用 == 进行条件判断
  // if (value == null) { ... }

  // ✅ 明确的条件判断
  if (value === null || value === undefined) {
    return 'empty'
  }

  if (value === '') {
    return 'empty string'
  }

  if (value === 0) {
    return 'zero'
  }

  return value
}

// 5. 数组和对象的比较工具
const ComparisonUtils = {
  // 数组浅比较
  arrayShallowEqual(arr1, arr2) {
    if (arr1 === arr2) return true
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false
    if (arr1.length !== arr2.length) return false

    return arr1.every((item, index) => item === arr2[index])
  },

  // 对象浅比较
  objectShallowEqual(obj1, obj2) {
    if (obj1 === obj2) return true
    if (obj1 == null || obj2 == null) return false

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) return false

    return keys1.every(key => obj1[key] === obj2[key])
  },

  // 使用Object.is进行比较
  strictEqual(a, b) {
    return Object.is(a, b)
  }
}

// 类型转换规则表
const conversionExamples = [
  // [left, right, == result, === result]
  [1, '1', true, false],
  [true, 1, true, false],
  [false, 0, true, false],
  [null, undefined, true, false],
  ['', 0, true, false],
  [[], '', true, false],
  [[], 0, true, false],
  [{}, '[object Object]', true, false]
]

console.table(conversionExamples.map(([a, b, loose, strict]) => ({
  left: a,
  right: b,
  '== result': loose,
  '=== result': strict
})))
```

**类型转换规则总结：**

1. **如果类型相同**：直接比较值
2. **null和undefined**：互相相等，但不等于其他值
3. **数字和字符串**：字符串转换为数字
4. **布尔值**：转换为数字（true→1, false→0）
5. **对象和原始值**：对象调用ToPrimitive转换

**记忆要点总结：**
- **=== 严格相等**：类型和值都必须相同，推荐使用
- **== 抽象相等**：会进行类型转换，容易产生意外结果
- **最佳实践**：优先使用===，明确的类型转换
- **特殊情况**：NaN不等于任何值，使用Object.is处理特殊比较
- **对象比较**：比较引用而非内容，需要自定义深度比较函数



**005. [初级]** JavaScript中`undefined`和`null`的区别是什么？

都是原始数据类型

undefined 是指未定义/缺少值; 系统自动赋予的值

null 表示为空/无对象; 程序员主动赋予的值

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript中两个特殊值的语义差异，面试官想了解你是否理解它们的产生场景和正确使用方式。

**技术错误纠正：**
1. "通过作用域查找找不到该值的定义的位置"表述不准确，undefined不是作用域查找的结果
2. "null表示为空，没有任何意义"过于简单，缺少具体的语义说明
3. 没有说明两者的产生场景和使用建议

**知识点系统梳理：**

**undefined的含义：**
- 表示"未定义"或"缺少值"
- 是变量的默认值
- 系统自动赋予的值

**null的含义：**
- 表示"空值"或"无对象"
- 是程序员主动赋予的值
- 表示"这里应该有一个对象，但现在没有"

**实战应用举例：**
```javascript
// undefined的产生场景
let uninitialized; // 声明但未赋值
console.log(uninitialized); // undefined

function noReturn() {
  // 没有return语句
}
console.log(noReturn()); // undefined

function withReturn() {
  return; // 空return
}
console.log(withReturn()); // undefined

const obj = {};
console.log(obj.nonExistent); // undefined - 访问不存在的属性

function func(a, b) {
  console.log(b); // undefined - 未传递的参数
}
func(1);

// 数组的稀疏元素
const arr = [1, , 3]; // 中间元素是undefined
console.log(arr[1]); // undefined

// null的使用场景
let user = null; // 明确表示"暂时没有用户"

function findUser(id) {
  // 找不到用户时返回null，而不是undefined
  return users.find(u => u.id === id) || null;
}

// DOM API中的null
const element = document.getElementById('nonexistent'); // null

// 重置对象引用
let data = { name: 'John' };
data = null; // 明确清空引用，帮助垃圾回收

// 类型检测和比较
console.log(typeof undefined); // 'undefined'
console.log(typeof null); // 'object' (历史bug)

console.log(undefined == null); // true - 抽象相等
console.log(undefined === null); // false - 严格相等

console.log(undefined == 0); // false
console.log(null == 0); // false
console.log(undefined == false); // false
console.log(null == false); // false

// 转换为布尔值
console.log(Boolean(undefined)); // false
console.log(Boolean(null)); // false
console.log(!undefined); // true
console.log(!null); // true

// 转换为数字
console.log(Number(undefined)); // NaN
console.log(Number(null)); // 0
console.log(+undefined); // NaN
console.log(+null); // 0

// 转换为字符串
console.log(String(undefined)); // 'undefined'
console.log(String(null)); // 'null'
console.log(undefined + ''); // 'undefined'
console.log(null + ''); // 'null'

// 实际项目中的应用

// 1. 参数默认值处理
function greet(name) {
  // ES5方式
  if (name === undefined) {
    name = 'Guest';
  }

  // 或者使用 || 操作符（注意会把所有falsy值都替换）
  name = name || 'Guest';

  return `Hello, ${name}!`;
}

// ES6默认参数（只处理undefined）
function greetES6(name = 'Guest') {
  return `Hello, ${name}!`;
}

console.log(greet()); // 'Hello, Guest!'
console.log(greet(null)); // 'Hello, null!' - 注意差异
console.log(greetES6()); // 'Hello, Guest!'
console.log(greetES6(null)); // 'Hello, null!'

// 2. 安全的属性访问
function safeGet(obj, path, defaultValue = undefined) {
  if (obj === null || obj === undefined) {
    return defaultValue;
  }

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
}

// 使用示例
const user = {
  profile: {
    name: 'John',
    address: null
  }
};

console.log(safeGet(user, 'profile.name')); // 'John'
console.log(safeGet(user, 'profile.age')); // undefined
console.log(safeGet(user, 'profile.address.street')); // undefined
console.log(safeGet(user, 'profile.age', 0)); // 0

// 3. 空值检查工具函数
const NullishUtils = {
  // 检查是否为null或undefined
  isNullish(value) {
    return value === null || value === undefined;
  },

  // 检查是否为undefined
  isUndefined(value) {
    return value === undefined;
  },

  // 检查是否为null
  isNull(value) {
    return value === null;
  },

  // 提供默认值（只处理null和undefined）
  defaultValue(value, defaultVal) {
    return this.isNullish(value) ? defaultVal : value;
  },

  // 空值合并（类似ES2020的??操作符）
  coalesce(...values) {
    return values.find(val => !this.isNullish(val));
  }
};

// 使用示例
console.log(NullishUtils.isNullish(null)); // true
console.log(NullishUtils.isNullish(undefined)); // true
console.log(NullishUtils.isNullish(0)); // false
console.log(NullishUtils.isNullish('')); // false

console.log(NullishUtils.defaultValue(null, 'default')); // 'default'
console.log(NullishUtils.defaultValue(0, 'default')); // 0

console.log(NullishUtils.coalesce(null, undefined, 0, 'first')); // 0

// 4. 现代JavaScript的解决方案（ES2020+）
// 可选链操作符
console.log(user?.profile?.address?.street); // undefined

// 空值合并操作符
const userName = user?.profile?.name ?? 'Anonymous';
console.log(userName); // 'John'

const userAge = user?.profile?.age ?? 18;
console.log(userAge); // 18

// 5. JSON序列化中的差异
const data = {
  a: undefined,
  b: null,
  c: 'value'
};

console.log(JSON.stringify(data)); // '{"b":null,"c":"value"}'
// 注意：undefined属性会被忽略，null会被保留

// 6. 函数参数的最佳实践
function processData(data, options = {}) {
  // 明确区分未传递和传递null
  if (data === undefined) {
    throw new Error('Data is required');
  }

  if (data === null) {
    console.log('Data is explicitly null, using empty dataset');
    data = [];
  }

  // 处理options
  const config = {
    format: 'json',
    validate: true,
    ...options
  };

  return { data, config };
}
```

**使用建议对比：**

| 场景 | 使用undefined | 使用null |
|------|---------------|----------|
| 变量初始化 | let x; | let x = null; |
| 函数返回值 | 表示没有返回值 | 表示明确的空结果 |
| 对象属性 | 属性不存在 | 属性存在但值为空 |
| 函数参数 | 参数未传递 | 明确传递空值 |
| API设计 | 可选字段 | 可空字段 |

**记忆要点总结：**
- **undefined**：系统默认值，表示"未定义"或"缺少值"
- **null**：程序员主动赋值，表示"空值"或"无对象"
- **类型检测**：typeof undefined为'undefined'，typeof null为'object'
- **相等比较**：undefined == null为true，undefined === null为false
- **现代解决方案**：可选链(?.)和空值合并(??)操作符
- **最佳实践**：明确区分两者的语义，合理选择使用场景



**006. [中级]** 什么是类型转换？隐式转换和显式转换有什么区别？

是指不同类型的值在计算或者比较时需要统一到同一个数据类型的做法

显式转化：~~使用包装对象将其强制转化为对应类型~~

隐式转化：在进行计算或者比较操作时，调用包装对象的内部包含 toString()和~~toValue()~~ valueOf() 方法，自动将其转化为对应的类型

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript类型系统的核心机制，面试官想了解你是否理解类型转换的内部算法和实际应用。

**技术错误纠正：**
1. "toValue()"方法不存在，应该是"valueOf()"
2. 缺少ToPrimitive、ToNumber、ToString等核心转换算法的说明
3. "使用包装对象将其强制转化"表述不准确

**知识点系统梳理：**

**类型转换的分类：**
- **显式转换**：程序员主动调用转换函数
- **隐式转换**：JavaScript引擎自动进行的转换

**核心转换算法：**
1. **ToPrimitive**：对象转原始值
2. **ToNumber**：转换为数字
3. **ToString**：转换为字符串
4. **ToBoolean**：转换为布尔值

**实战应用举例：**
```javascript
// 1. 显式类型转换的实际应用
function safeParseNumber(input) {
  const num = Number(input);
  if (isNaN(num)) {
    throw new Error(`Cannot convert "${input}" to number`);
  }
  return num;
}

// 使用示例
console.log(safeParseNumber('123'));    // 123
console.log(safeParseNumber('123.45')); // 123.45
// safeParseNumber('abc'); // Error: Cannot convert "abc" to number
```

```javascript
// 2. ToPrimitive转换机制演示
const customObject = {
  value: 42,
  valueOf() {
    console.log('valueOf called');
    return this.value;
  },
  toString() {
    console.log('toString called');
    return `Value: ${this.value}`;
  }
};

// 不同上下文的转换
console.log(+customObject);        // valueOf called, 42
console.log(String(customObject)); // toString called, "Value: 42"
console.log(customObject + '');    // valueOf called, "42"
```

**记忆要点总结：**
- **显式转换**：Number()、String()、Boolean()、parseInt()、parseFloat()
- **隐式转换**：通过ToPrimitive、ToNumber、ToString算法
- **转换优先级**：valueOf() vs toString()取决于上下文
- **最佳实践**：优先使用显式转换，避免隐式转换的意外结果



**007. [初级]** `Number('123abc')`和`parseInt('123abc')`的结果分别是什么？

- `Number('123abc')` NaN
- `parseInt('123abc')` 123

## 深度分析与补充

**问题本质解读：** 这道题考察不同数值解析函数的行为差异，面试官想了解你是否理解它们的解析规则和适用场景。

**知识点系统梳理：**

**Number() vs parseInt() 的区别：**
- **Number()**：严格解析，整个字符串必须是有效数字
- **parseInt()**：宽松解析，从左到右解析直到遇到非数字字符

**解析函数对比：**
- **Number()**：全字符串转换
- **parseInt()**：整数解析，支持进制
- **parseFloat()**：浮点数解析
- **+操作符**：等同于Number()

**实战应用举例：**
```javascript
// 1. 用户输入验证
function validateNumberInput(input) {
  const trimmed = input.trim();

  // 严格验证：必须是完整的数字
  if (Number(trimmed).toString() === trimmed) {
    return { valid: true, value: Number(trimmed), type: 'strict' };
  }

  // 宽松验证：提取数字部分
  const parsed = parseInt(trimmed);
  if (!isNaN(parsed)) {
    return { valid: true, value: parsed, type: 'partial', original: trimmed };
  }

  return { valid: false, error: 'Invalid number' };
}

// 使用示例
console.log(validateNumberInput('123'));     // { valid: true, value: 123, type: 'strict' }
console.log(validateNumberInput('123px'));   // { valid: true, value: 123, type: 'partial', original: '123px' }
console.log(validateNumberInput('abc'));     // { valid: false, error: 'Invalid number' }
```

```javascript
// 2. 不同进制的解析
function parseWithBase(str, base = 10) {
  const result = parseInt(str, base);

  if (isNaN(result)) {
    throw new Error(`Cannot parse "${str}" as base ${base} number`);
  }

  return {
    decimal: result,
    binary: result.toString(2),
    hex: result.toString(16),
    original: str,
    base: base
  };
}

// 使用示例
console.log(parseWithBase('1010', 2));  // 解析二进制
console.log(parseWithBase('FF', 16));   // 解析十六进制
console.log(parseWithBase('123', 10));  // 解析十进制
```

**记忆要点总结：**
- **Number()**：严格解析，整个字符串必须有效
- **parseInt()**：宽松解析，提取开头的整数部分
- **parseFloat()**：解析浮点数，支持科学计数法
- **最佳实践**：根据需求选择合适的解析函数



**008. [中级]** 解释JavaScript中的"假值"（falsy values）有哪些？

- false
- 0
- ''
- null
- undefined
- NaN
- -0
- 0n

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript中布尔转换的规则，面试官想了解你是否掌握条件判断的核心机制。

**技术错误纠正：**
1. 原答案基本正确，但缺少-0和0n（BigInt零值）
2. 没有说明假值的实际应用和注意事项

**知识点系统梳理：**

**完整的假值列表（8个）：**
1. **false** - 布尔假值
2. **0** - 数字零
3. **-0** - 负零
4. **0n** - BigInt零值
5. **''** - 空字符串
6. **null** - 空值
7. **undefined** - 未定义
8. **NaN** - 非数字

**实战应用举例：**
```javascript
// 1. 安全的条件判断
function processValue(value) {
  // 使用显式检查而不是依赖假值判断
  if (value === null || value === undefined) {
    return 'No value provided';
  }

  if (value === '') {
    return 'Empty string provided';
  }

  if (value === 0) {
    return 'Zero value provided';
  }

  return `Processing: ${value}`;
}

// 对比隐式判断的问题
function unsafeProcess(value) {
  if (!value) {  // 这会把0、''、false都当作无效值
    return 'Invalid value';
  }
  return `Processing: ${value}`;
}

console.log(processValue(0));        // 'Zero value provided'
console.log(unsafeProcess(0));       // 'Invalid value' - 可能不是期望的结果
```

```javascript
// 2. 空值合并的实际应用
function getConfigValue(userConfig, defaultConfig) {
  // 使用空值合并操作符，只处理null和undefined
  return userConfig ?? defaultConfig;
}

function getConfigValueOld(userConfig, defaultConfig) {
  // 传统方式，会把所有假值都替换
  return userConfig || defaultConfig;
}

// 测试差异
console.log(getConfigValue(0, 100));        // 0 - 保留用户设置的0
console.log(getConfigValueOld(0, 100));     // 100 - 错误地使用了默认值

console.log(getConfigValue('', 'default')); // '' - 保留用户设置的空字符串
console.log(getConfigValueOld('', 'default')); // 'default' - 错误地使用了默认值
```

**记忆要点总结：**
- **8个假值**：false, 0, -0, 0n, '', null, undefined, NaN
- **布尔转换**：假值转换为false，其他所有值转换为true
- **最佳实践**：使用显式比较而不是依赖隐式布尔转换
- **现代解决方案**：使用??操作符区分null/undefined和其他假值



**009. [初级]** 如何检测一个变量的数据类型？

- Object.prototype.toString.call(xxx) 返回的 '[object XXX]' 其中XXX就是xxx的数据类型

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript中精确类型检测的方法，面试官想了解你是否掌握不同检测方法的优缺点。

**知识点系统梳理：**

**类型检测的方法对比：**
1. **typeof** - 基础类型检测，有局限性
2. **instanceof** - 原型链检测，有跨iframe问题
3. **Object.prototype.toString.call()** - 最精确的检测方法
4. **Array.isArray()** - 专门的数组检测

**实战应用举例：**
```javascript
// 1. 通用类型检测工具
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

// 使用示例
console.log(getType([]));           // 'array'
console.log(getType({}));           // 'object'
console.log(getType(null));         // 'null'
console.log(getType(new Date()));   // 'date'
console.log(getType(/test/));       // 'regexp'
console.log(getType(function(){})); // 'function'
```

```javascript
// 2. 类型验证器
const TypeValidator = {
  isString: (val) => typeof val === 'string',
  isNumber: (val) => typeof val === 'number' && !isNaN(val),
  isArray: (val) => Array.isArray(val),
  isObject: (val) => getType(val) === 'object',
  isFunction: (val) => typeof val === 'function',
  isDate: (val) => getType(val) === 'date',

  // 组合验证
  validate(value, expectedType) {
    const actualType = getType(value);
    return actualType === expectedType.toLowerCase();
  }
};

// 使用示例
console.log(TypeValidator.isArray([]));        // true
console.log(TypeValidator.validate(new Date(), 'Date')); // true
```

**记忆要点总结：**
- **最精确方法**：Object.prototype.toString.call()
- **常用方法**：typeof（基础类型）、Array.isArray()（数组）
- **返回格式**：'[object Type]'，需要slice(8, -1)提取类型名
- **实际应用**：参数验证、类型守卫、通用工具函数



**010. [中级]** `Object.prototype.toString.call()`方法的作用是什么？

调用对象的toString方法，返回数据对应的数据类型

## 深度分析与补充

**问题本质解读：** 这道题考察Object.prototype.toString方法的内部机制，面试官想了解你是否理解为什么这个方法能够精确检测类型。

**技术错误纠正：**
1. 原答案过于简单，没有说明为什么要用call方法
2. 缺少内部机制的解释和实际应用场景

**知识点系统梳理：**

**方法的工作原理：**
- Object.prototype.toString会返回"[object Type]"格式的字符串
- 使用call方法改变this指向，让任何值都能调用这个方法
- 内部通过[[Class]]属性确定对象的类型标签

**为什么使用call：**
- 直接调用toString可能被子类重写
- call确保调用的是Object.prototype上的原始toString方法

**实战应用举例：**
```javascript
// 1. 精确类型检测的实现
function preciseType(value) {
  const tag = Object.prototype.toString.call(value);
  return tag.slice(8, -1).toLowerCase();
}

// 对比不同方法的结果
const testValues = [
  null, undefined, true, 42, 'hello', [], {},
  new Date(), /regex/, function(){}, new Map(), new Set()
];

testValues.forEach(val => {
  console.log({
    value: val,
    typeof: typeof val,
    toString: Object.prototype.toString.call(val),
    preciseType: preciseType(val)
  });
});
```

```javascript
// 2. 类型检测库的实现
const TypeChecker = {
  getTag(value) {
    return Object.prototype.toString.call(value);
  },

  is(value, type) {
    const tag = this.getTag(value);
    const expectedTag = `[object ${type}]`;
    return tag === expectedTag;
  },

  // 便捷方法
  isPlainObject(value) {
    return this.is(value, 'Object') &&
           value.constructor === Object;
  },

  isNativeFunction(value) {
    return this.is(value, 'Function') &&
           /\[native code\]/.test(value.toString());
  }
};

// 使用示例
console.log(TypeChecker.is([], 'Array'));        // true
console.log(TypeChecker.isPlainObject({}));      // true
console.log(TypeChecker.isNativeFunction(Array.isArray)); // true
```

**记忆要点总结：**
- **核心作用**：返回对象的内部[[Class]]属性，格式为"[object Type]"
- **使用call的原因**：避免子类重写的toString方法干扰
- **精确性**：能区分所有JavaScript内置类型
- **实际应用**：类型检测库、参数验证、调试工具



**011. [中级]** JavaScript中的包装对象是什么？

是指原始数据类型对应的对象形式，~~包含了可以内置属性和方法~~提供了内置属性和方法的访问

- String
- Number
- Boolean
- Symbol
- BigInt

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript中原始类型和对象类型的转换机制，面试官想了解你是否理解自动装箱的过程。

**技术错误纠正：**
1. "包含了可以内置属性和方法"表述不清楚，应该是"提供了内置属性和方法的访问"
2. 缺少自动装箱机制的详细说明

**知识点系统梳理：**

**包装对象的作用：**
- 为原始类型提供对象的属性和方法访问
- 实现原始类型和对象类型之间的桥梁
- 支持链式调用和复杂操作

**自动装箱过程：**
1. 访问原始值的属性或方法
2. JavaScript创建临时包装对象
3. 在包装对象上执行操作
4. 销毁临时包装对象，返回结果

**实战应用举例：**
```javascript
// 1. 自动装箱演示
const str = 'hello';
console.log(str.length);        // 5 - 临时创建String对象
console.log(str.toUpperCase()); // 'HELLO' - 临时创建String对象

// 验证临时性
str.customProperty = 'test';
console.log(str.customProperty); // undefined - 临时对象已销毁
```

```javascript
// 2. 包装对象与原始值的区别
const primitive = 'hello';
const wrapper = new String('hello');

console.log(primitive === 'hello');        // true
console.log(wrapper === 'hello');          // false
console.log(wrapper.valueOf() === 'hello'); // true

console.log(typeof primitive);  // 'string'
console.log(typeof wrapper);    // 'object'

// 布尔转换的差异
console.log(Boolean(new Boolean(false))); // true - 注意陷阱！
```

**记忆要点总结：**
- **定义**：原始类型的对象形式，提供方法和属性访问
- **自动装箱**：访问原始值属性时自动创建临时包装对象
- **临时性**：包装对象在操作完成后立即销毁
- **注意事项**：避免显式创建包装对象，会导致类型混淆



**012. [高级]** 解释JavaScript中的装箱和拆箱操作

- 装箱是指将基本数据类型转化为包装对象的过程
- 拆箱是指将包装对象转化为基本数据类型的过程

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript类型转换的底层机制，面试官想了解你是否理解装箱拆箱的具体过程和性能影响。

**知识点系统梳理：**

**装箱（Boxing）：**
- 自动装箱：访问原始值属性时自动发生
- 显式装箱：使用new操作符创建包装对象

**拆箱（Unboxing）：**
- 自动拆箱：在需要原始值的上下文中自动发生
- 显式拆箱：调用valueOf()或toString()方法

**实战应用举例：**
```javascript
// 1. 装箱和拆箱的完整过程
const num = 42;

// 自动装箱：访问属性时
console.log(num.toString()); // '42' - 临时创建Number对象

// 显式装箱
const boxed = new Number(42);
console.log(typeof boxed); // 'object'

// 自动拆箱：算术运算时
console.log(boxed + 8); // 50 - 自动调用valueOf()

// 显式拆箱
console.log(boxed.valueOf()); // 42
console.log(boxed.toString()); // '42'
```

```javascript
// 2. 性能对比和最佳实践
function performanceTest() {
  const iterations = 1000000;

  // 测试原始值操作
  console.time('primitive');
  for (let i = 0; i < iterations; i++) {
    const str = 'hello';
    str.length; // 自动装箱
  }
  console.timeEnd('primitive');

  // 测试包装对象操作
  console.time('wrapper');
  for (let i = 0; i < iterations; i++) {
    const str = new String('hello');
    str.length; // 直接访问
  }
  console.timeEnd('wrapper');
}

// 最佳实践：避免显式创建包装对象
function safeParse(value) {
  // ✅ 推荐：使用原始值
  return String(value).trim();

  // ❌ 避免：创建包装对象
  // return new String(value).trim();
}
```

**记忆要点总结：**
- **装箱**：原始值 → 包装对象，提供属性和方法访问
- **拆箱**：包装对象 → 原始值，通过valueOf()或toString()
- **自动化**：JavaScript自动处理装箱拆箱过程
- **性能考虑**：避免显式创建包装对象，影响性能



**013. [初级]** 什么是NaN？如何检测一个值是否为NaN？

NaN是number类型的数据，表示计算错误的值，NaN不等于任何值

可以通过内置函数 isNaN来判断是否是NaN，也可以通过Number.isNaN 来判断

区别是：内置函数的将值进行一步类型转化，只要不是number类型的都是NaN，Number.isNaN 只判断是否是NaN这个值

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript中特殊数值NaN的性质，面试官想了解你是否理解NaN的特殊性和正确的检测方法。

**技术错误纠正：**
1. "内置函数的将值进行一步类型转化"表述不清楚，应该说明isNaN会先转换为数字
2. 缺少NaN === NaN返回false的原因说明

**知识点系统梳理：**

**NaN的特殊性质：**
- NaN !== NaN（唯一不等于自身的值）
- typeof NaN === 'number'
- NaN参与的任何数学运算都返回NaN
- 表示"Not a Number"，但类型仍是number

**检测方法对比：**
- **isNaN()** - 会进行类型转换，不够精确
- **Number.isNaN()** - 严格检测，推荐使用
- **Object.is()** - 可以正确比较NaN

**实战应用举例：**
```javascript
// 1. NaN检测方法对比
console.log(isNaN('hello'));        // true - 先转换为NaN
console.log(Number.isNaN('hello')); // false - 严格检测
console.log(Number.isNaN(NaN));     // true - 只有真正的NaN

console.log(NaN === NaN);           // false - 特殊性质
console.log(Object.is(NaN, NaN));   // true - 正确比较
```

```javascript
// 2. 安全的数值处理
function safeParseFloat(value) {
  const result = parseFloat(value);

  if (Number.isNaN(result)) {
    throw new Error(`Cannot parse "${value}" as number`);
  }

  return result;
}

// 使用示例
try {
  console.log(safeParseFloat('123.45')); // 123.45
  console.log(safeParseFloat('abc'));    // Error
} catch (error) {
  console.error(error.message);
}
```

**记忆要点总结：**
- **NaN特性**：不等于任何值（包括自己），typeof为'number'
- **检测方法**：Number.isNaN()（推荐）、Object.is(val, NaN)
- **产生场景**：无效数学运算、类型转换失败
- **最佳实践**：使用Number.isNaN()进行严格检测



**014. [中级]** `0.1 + 0.2 === 0.3`的结果是什么？为什么？

false

~~是因为精度不够，~~数字的表示方法为双精度浮点数标准，在某些小数表示时会丢失精度，0.1 在二进制中是无限循环小数

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript数值系统的底层实现，面试官想了解你是否理解浮点数精度问题的原因和解决方案。

**技术错误纠正：**
1. "精度不够"表述不准确，应该是"二进制表示的精度限制"
2. 缺少具体的解决方案和实际应用

**知识点系统梳理：**

**精度问题的根本原因：**
- JavaScript使用IEEE 754双精度浮点数
- 二进制无法精确表示某些十进制小数
- 0.1在二进制中是无限循环小数

**实战应用举例：**
```javascript
// 1. 精度问题演示和解决
console.log(0.1 + 0.2);                    // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);            // false

// 解决方案：使用Number.EPSILON
function floatEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}

console.log(floatEqual(0.1 + 0.2, 0.3));   // true
```

```javascript
// 2. 金融计算的安全方法
function safeAdd(a, b) {
  // 转换为整数计算
  const factor = Math.pow(10, Math.max(
    (a.toString().split('.')[1] || '').length,
    (b.toString().split('.')[1] || '').length
  ));

  return (Math.round(a * factor) + Math.round(b * factor)) / factor;
}

console.log(safeAdd(0.1, 0.2));            // 0.3
console.log(safeAdd(0.1, 0.2) === 0.3);    // true
```

**记忆要点总结：**
- **问题原因**：IEEE 754标准，二进制无法精确表示十进制小数
- **典型例子**：0.1 + 0.2 !== 0.3
- **解决方案**：Number.EPSILON比较、整数计算、第三方库
- **实际应用**：金融计算中需要特别注意精度问题


**015. [中级]** 如何准确地比较两个浮点数是否相等？

- 使用Math.EPSILON 通过绝对值计算后和EPSLION比较

## 深度分析与补充

**问题本质解读：** 这道题考察浮点数比较的正确方法，面试官想了解你是否掌握精度安全的比较技巧。

**技术错误纠正：**
1. "Math.EPSILON"应为"Number.EPSILON"
2. 缺少具体的实现方法和使用场景

**知识点系统梳理：**

**浮点数比较的方法：**
1. **Number.EPSILON** - 最小精度单位
2. **自定义精度** - 根据业务需求设定
3. **相对误差** - 适用于大数值比较
4. **整数转换** - 避免浮点数运算

**实战应用举例：**
```javascript
// 1. 使用Number.EPSILON的精确比较
function isEqual(a, b, epsilon = Number.EPSILON) {
  return Math.abs(a - b) < epsilon;
}

console.log(isEqual(0.1 + 0.2, 0.3));        // true
console.log(isEqual(0.1 + 0.2, 0.3, 1e-10)); // true，自定义精度
```

```javascript
// 2. 相对误差比较（适用于大数值）
function isEqualRelative(a, b, relativeEpsilon = 1e-9) {
  const absoluteEpsilon = relativeEpsilon * Math.max(Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= absoluteEpsilon;
}

// 大数值比较
console.log(isEqualRelative(1000000.1, 1000000.2, 1e-6)); // false
console.log(isEqualRelative(1000000.1, 1000000.1, 1e-6)); // true
```

**记忆要点总结：**
- **推荐方法**：Math.abs(a - b) < Number.EPSILON
- **自定义精度**：根据业务需求调整epsilon值
- **相对误差**：大数值比较使用相对误差更合适
- **避免直接比较**：永远不要直接使用===比较浮点数
- 先转位整数计算，然后再转为小数
- 使用第三方库



### 函数与作用域（15道）

**016. [初级]** 函数声明和函数表达式有什么区别？

函数声明:
```javascript
function fun(){ return ‘fun’ };
```
- 函数提升；
- 块级作用域；

函数表达式：
```javascript
const fun = function(name){ return name};
```
- 变量提升；
- 命名函数表达式；
- 适合作为参数传递；

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript中两种函数定义方式的差异，面试官想了解你是否理解提升机制和作用域的区别。

**技术错误纠正：**
1. "块级作用域"表述错误，函数声明在ES6之前是函数作用域，ES6后在块级作用域中有特殊行为
2. 缺少具体的提升行为说明和使用场景

**知识点系统梳理：**

**函数声明特点：**
- 完整提升（包括函数体）
- 可以在声明前调用
- 在块级作用域中有特殊提升行为

**函数表达式特点：**
- 变量提升，但值为undefined
- 不能在赋值前调用
- 支持匿名函数和命名函数表达式

**实战应用举例：**
```javascript
// 1. 提升行为对比
console.log(declared());    // "I'm declared" - 可以调用
// console.log(expressed()); // TypeError: expressed is not a function

function declared() {
  return "I'm declared";
}

var expressed = function() {
  return "I'm expressed";
};

console.log(expressed());   // "I'm expressed" - 现在可以调用
```

```javascript
// 2. 条件性函数定义的最佳实践
// ❌ 避免：条件性函数声明（行为不一致）
if (true) {
  function conditionalFunc() {
    return 'declared';
  }
}

// ✅ 推荐：使用函数表达式
let conditionalFunc;
if (true) {
  conditionalFunc = function() {
    return 'expressed';
  };
}
```

**记忆要点总结：**
- **函数声明**：完整提升，可在声明前调用，有函数名
- **函数表达式**：变量提升但值为undefined，不能提前调用
- **使用场景**：函数声明用于主要功能，函数表达式用于条件性定义
- **最佳实践**：避免条件性函数声明，优先使用函数表达式


**017. [中级]** 什么是函数提升（hoisting）？

使用函数声明的函数，函数会被提升到作用域的顶部，任意位置都可以调用

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript的提升机制，面试官想了解你是否理解不同声明方式的提升行为。

**知识点系统梳理：**

**提升的类型：**
- **函数声明提升**：整个函数定义被提升
- **变量提升**：只有声明被提升，赋值留在原位置
- **let/const提升**：提升但存在暂时性死区

**提升的执行顺序：**
1. 函数声明
2. 变量声明
3. 函数表达式赋值

**实战应用举例：**
```javascript
// 1. 提升机制演示
console.log(hoistedFunc());  // "I'm hoisted!"
console.log(typeof varFunc); // "undefined"
// console.log(letFunc());   // ReferenceError: Cannot access before initialization

function hoistedFunc() {
  return "I'm hoisted!";
}

var varFunc = function() {
  return "I'm a var function";
};

let letFunc = function() {
  return "I'm a let function";
};
```

```javascript
// 2. 复杂提升场景
var a = 1;
function test() {
  console.log(a);        // undefined (不是1!)
  var a = 2;
  console.log(a);        // 2
}

// 等价于：
function test() {
  var a;               // 提升的声明
  console.log(a);      // undefined
  a = 2;               // 原位置的赋值
  console.log(a);      // 2
}
```

**记忆要点总结：**
- **函数声明**：完整提升，可在任意位置调用
- **变量声明**：只提升声明，不提升赋值
- **let/const**：提升但有暂时性死区，不能提前访问
- **实际影响**：理解提升有助于避免意外的undefined错误



**018. [中级]** 解释JavaScript中的作用域链

～～访问某个方法或者属性时，首先会访问其本身是否含有，如果没有则继续访问其包装对象原型是否含有，一直向上访问直到Object～～
变量查找的路径，从内向外逐层查找; 当前作用域 → 外层作用域 → 全局作用域

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript的作用域机制，面试官想了解你是否理解变量查找的过程。

**技术错误纠正：**
1. 原答案混淆了作用域链和原型链的概念
2. 作用域链是关于变量查找，不是方法或属性查找
3. 作用域链的终点是全局作用域，不是Object

**知识点系统梳理：**

**作用域链的定义：**
- 变量查找的路径链条
- 从当前作用域向外层作用域查找
- 直到全局作用域或找到变量为止

**作用域的类型：**
- **全局作用域**：最外层作用域
- **函数作用域**：函数内部的作用域
- **块级作用域**：let/const创建的作用域

**实战应用举例：**
```javascript
// 1. 作用域链查找演示
var globalVar = 'global';

function outerFunction() {
  var outerVar = 'outer';

  function innerFunction() {
    var innerVar = 'inner';

    console.log(innerVar);  // 'inner' - 当前作用域
    console.log(outerVar);  // 'outer' - 外层作用域
    console.log(globalVar); // 'global' - 全局作用域
  }

  innerFunction();
}

outerFunction();
```

```javascript
// 2. 词法作用域演示
function createCounter() {
  let count = 0;

  return function() {
    count++; // 访问外层函数的变量
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2

// 作用域链：内部函数 -> createCounter函数 -> 全局作用域
```

**记忆要点总结：**
- **定义**：变量查找的路径，从内向外逐层查找
- **查找顺序**：当前作用域 → 外层作用域 → 全局作用域
- **词法作用域**：作用域在代码编写时确定，不是运行时
- **与原型链区别**：作用域链查找变量，原型链查找属性



**019. [初级]** 什么是闭包？请举一个简单的例子

闭包是一个函数指~~可以访问函数外部的数据，并持有该数据~~能够访问其词法作用域外的变量


```javascript
function fun(){
  let count = 0
  return function(){
    return ++count
  }
}
const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript最重要的概念之一，面试官想了解你是否真正理解闭包的形成机制、作用和实际应用。

**技术错误纠正：**
1. "函数指可以访问函数外部的数据"表述不准确，应该是"函数能够访问其词法作用域外的变量"
2. 代码示例有问题：`a++`是后置递增，返回的是递增前的值，且每次都重新声明`a`
3. 缺少闭包形成的核心条件说明

**知识点系统梳理：**

**闭包的定义：**
- 闭包是函数和其词法环境的组合
- 内部函数可以访问外部函数的变量
- 即使外部函数已经执行完毕，内部函数仍能访问这些变量

**闭包形成的条件：**
1. 函数嵌套（内部函数引用外部函数的变量）
2. 内部函数被外部引用（通常是返回或赋值给外部变量）
3. 外部函数执行完毕后，内部函数仍然存在

**实战应用举例：**
```javascript
// 1. 基础闭包示例
function createCounter() {
  let count = 0;

  return function() {
    return ++count; // 正确的递增方式
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// 每次调用createCounter都会创建新的闭包
const counter2 = createCounter();
console.log(counter2()); // 1 - 独立的计数器

// 2. 闭包的词法作用域演示
function outerFunction(x) {
  // 外部函数的变量
  const outerVariable = x;

  function innerFunction(y) {
    // 内部函数可以访问外部函数的变量
    console.log(`Outer: ${outerVariable}, Inner: ${y}`);
    return outerVariable + y;
  }

  return innerFunction;
}

const closure = outerFunction(10);
console.log(closure(5)); // "Outer: 10, Inner: 5" 然后返回 15

// 3. 多个闭包共享同一个环境
function createMultipleCounters() {
  let count = 0;

  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getCount() {
      return count;
    }
  };
}

const counters = createMultipleCounters();
console.log(counters.increment()); // 1
console.log(counters.increment()); // 2
console.log(counters.decrement()); // 1
console.log(counters.getCount()); // 1

// 4. 闭包在循环中的经典问题
// ❌ 错误示例
function createFunctionsWrong() {
  const functions = [];

  for (var i = 0; i < 3; i++) {
    functions.push(function() {
      console.log(i); // 所有函数都会打印3
    });
  }

  return functions;
}

const wrongFunctions = createFunctionsWrong();
wrongFunctions[0](); // 3
wrongFunctions[1](); // 3
wrongFunctions[2](); // 3

// ✅ 正确示例1：使用IIFE
function createFunctionsCorrect1() {
  const functions = [];

  for (var i = 0; i < 3; i++) {
    functions.push((function(index) {
      return function() {
        console.log(index);
      };
    })(i));
  }

  return functions;
}

// ✅ 正确示例2：使用let
function createFunctionsCorrect2() {
  const functions = [];

  for (let i = 0; i < 3; i++) {
    functions.push(function() {
      console.log(i);
    });
  }

  return functions;
}

// 5. 实际应用：模块模式
const Calculator = (function() {
  // 私有变量
  let result = 0;
  let history = [];

  // 私有方法
  function addToHistory(operation, value) {
    history.push(`${operation}: ${value}`);
  }

  // 公共接口
  return {
    add(value) {
      result += value;
      addToHistory('add', value);
      return this;
    },

    subtract(value) {
      result -= value;
      addToHistory('subtract', value);
      return this;
    },

    multiply(value) {
      result *= value;
      addToHistory('multiply', value);
      return this;
    },

    getResult() {
      return result;
    },

    getHistory() {
      return [...history]; // 返回副本，保护内部数据
    },

    reset() {
      result = 0;
      history = [];
      return this;
    }
  };
})();

// 使用模块
Calculator.add(10).multiply(2).subtract(5);
console.log(Calculator.getResult()); // 15
console.log(Calculator.getHistory()); // ['add: 10', 'multiply: 2', 'subtract: 5']

// 6. 函数工厂模式
function createValidator(rules) {
  return function(value) {
    for (const rule of rules) {
      if (!rule.test(value)) {
        return {
          valid: false,
          message: rule.message
        };
      }
    }
    return { valid: true };
  };
}

const emailValidator = createValidator([
  {
    test: (value) => value && value.length > 0,
    message: 'Email is required'
  },
  {
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Invalid email format'
  }
]);

console.log(emailValidator('test@example.com')); // { valid: true }
console.log(emailValidator('invalid')); // { valid: false, message: 'Invalid email format' }

// 7. 防抖和节流函数
function debounce(func, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function throttle(func, limit) {
  let inThrottle;

  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 使用示例
const debouncedSearch = debounce((query) => {
  console.log(`Searching for: ${query}`);
}, 300);

const throttledScroll = throttle(() => {
  console.log('Scroll event handled');
}, 100);

// 8. 缓存函数（记忆化）
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('Cache hit');
      return cache.get(key);
    }

    console.log('Computing result');
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveFunction = memoize((n) => {
  // 模拟耗时计算
  let result = 0;
  for (let i = 0; i < n * 1000000; i++) {
    result += i;
  }
  return result;
});

console.log(expensiveFunction(100)); // Computing result
console.log(expensiveFunction(100)); // Cache hit
```

**闭包的优缺点：**

**优点：**
- 数据封装和私有性
- 创建专用函数和模块
- 保持状态
- 函数式编程支持

**缺点：**
- 内存占用（变量不会被垃圾回收）
- 可能导致内存泄漏
- 性能开销

**记忆要点总结：**
- **定义**：函数 + 词法环境的组合，内部函数访问外部变量
- **形成条件**：函数嵌套 + 内部函数被外部引用 + 外部函数执行完毕
- **实际应用**：模块模式、工厂函数、防抖节流、缓存函数
- **注意事项**：避免内存泄漏，注意循环中的闭包陷阱
- **最佳实践**：合理使用，及时清理不需要的引用



**020. [中级]** 闭包的实际应用场景有哪些？

- 防抖 节流函数
- 高阶函数

## 深度分析与补充

**问题本质解读：** 这道题考察闭包的实际应用价值，面试官想了解你是否能将闭包概念运用到实际开发中。

**知识点系统梳理：**

**闭包的主要应用场景：**
1. **模块化封装** - 创建私有变量和方法
2. **函数工厂** - 生成特定功能的函数
3. **防抖节流** - 控制函数执行频率
4. **缓存机制** - 记忆化函数
5. **事件处理** - 保持状态和上下文

**实战应用举例：**
```javascript
// 1. 防抖函数实现
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// 使用场景：搜索输入框
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
  // 实际的搜索逻辑
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

```javascript
// 2. 模块化封装
const Calculator = (function() {
  // 私有变量
  let result = 0;
  let history = [];

  // 私有方法
  function addToHistory(operation, value) {
    history.push(`${operation}: ${value}`);
  }

  // 公共接口
  return {
    add(value) {
      result += value;
      addToHistory('add', value);
      return this;
    },
    getResult() {
      return result;
    },
    getHistory() {
      return [...history]; // 返回副本
    },
    reset() {
      result = 0;
      history = [];
      return this;
    }
  };
})();

// 使用示例
Calculator.add(10).add(5);
console.log(Calculator.getResult()); // 15
```

**记忆要点总结：**
- **模块化**：创建私有作用域，封装内部实现
- **函数工厂**：根据参数生成定制化函数
- **状态保持**：在函数调用间保持数据状态
- **性能优化**：防抖节流、缓存等优化技术
- **实际价值**：提高代码的封装性、复用性和性能



**021. [高级]** 解释闭包可能导致的内存泄漏问题

由于函数中一直持有函数外部的数据，导致外部数据不能被系统垃圾回收，所以会导致内存泄露
- 未清理的事件监听器
- 定时器引用闭包
- DOM元素循环引用
- 大对象被闭包持有

## 深度分析与补充

**问题本质解读：** 这道题考察闭包的潜在问题，面试官想了解你是否理解内存管理和如何避免内存泄漏。

**知识点系统梳理：**

**内存泄漏的原因：**
- 闭包持有外部变量的引用
- 外部变量无法被垃圾回收
- 大量闭包累积导致内存占用过高

**常见的内存泄漏场景：**
1. **事件监听器未清理**
2. **定时器引用闭包**
3. **DOM元素循环引用**
4. **大对象被闭包持有**

**实战应用举例：**
```javascript
// 1. 内存泄漏示例和解决方案
function createLeakyHandler() {
  const largeData = new Array(1000000).fill('data'); // 大型数据

  // ❌ 可能导致内存泄漏
  return function(event) {
    console.log('Event handled, data size:', largeData.length);
  };
}

// ✅ 改进版本
function createSafeHandler() {
  const dataSize = 1000000; // 只保留必要信息

  return function(event) {
    console.log('Event handled, data size:', dataSize);
  };
}

// 使用示例
const button = document.getElementById('myButton');
const handler = createSafeHandler();
button.addEventListener('click', handler);

// 重要：清理事件监听器
// button.removeEventListener('click', handler);
```

```javascript
// 2. 定时器内存泄漏防护
function createTimer() {
  const data = { count: 0 };

  const timerId = setInterval(() => {
    data.count++;
    console.log('Count:', data.count);

    // 设置清理条件
    if (data.count >= 10) {
      clearInterval(timerId); // 清理定时器
      console.log('Timer cleaned up');
    }
  }, 1000);

  // 返回清理函数
  return function cleanup() {
    clearInterval(timerId);
    console.log('Manual cleanup');
  };
}

// 使用示例
const cleanup = createTimer();
// 在适当时机调用清理函数
// cleanup();
```

**记忆要点总结：**
- **泄漏原因**：闭包持有外部变量引用，阻止垃圾回收
- **常见场景**：事件监听器、定时器、DOM引用、大对象持有
- **预防措施**：及时清理引用、避免持有大对象、使用WeakMap
- **最佳实践**：提供清理函数、设置清理条件、监控内存使用



**022. [中级]** `this`关键字在不同情况下指向什么？

- new绑定：this指向创建对象
- 显式绑定：apply call bind调用时，this指向绑定对象
- 隐式绑定：对象中方法的this，this指向对象
- 默认绑定：独立函数或者全局调用，this指向全局对象或者undefined
- 箭头函数：箭头函数没有this，箭头函数的this继承自外部作用域

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript中this绑定的核心机制，面试官想了解你是否理解this的动态绑定规则和优先级。

**知识点系统梳理：**

**this绑定的四种规则（按优先级排序）：**
1. **new绑定** - 最高优先级
2. **显式绑定** - call/apply/bind
3. **隐式绑定** - 对象方法调用
4. **默认绑定** - 独立函数调用

**特殊情况：**
- **箭头函数** - 词法绑定，继承外层作用域
- **严格模式** - 默认绑定为undefined而非全局对象

**实战应用举例：**
```javascript
// 1. this绑定规则演示
const obj = {
  name: 'Object',
  regularMethod() {
    console.log('Regular:', this.name);
  },
  arrowMethod: () => {
    console.log('Arrow:', this.name); // 继承外层作用域的this
  }
};

obj.regularMethod(); // 'Regular: Object' - 隐式绑定
obj.arrowMethod();   // 'Arrow: undefined' - 词法绑定

// 显式绑定
const anotherObj = { name: 'Another' };
obj.regularMethod.call(anotherObj); // 'Regular: Another'
```

```javascript
// 2. this绑定优先级测试
function testThis() {
  console.log(this.value);
}

const obj1 = { value: 1, test: testThis };
const obj2 = { value: 2 };

// 隐式绑定
obj1.test(); // 1

// 显式绑定优先级更高
obj1.test.call(obj2); // 2

// new绑定优先级最高
function Constructor() {
  this.value = 3;
  console.log(this.value);
}

const boundConstructor = Constructor.bind(obj2);
new boundConstructor(); // 3 - new绑定优先于显式绑定
```

**记忆要点总结：**
- **优先级**：new > 显式绑定 > 隐式绑定 > 默认绑定
- **箭头函数**：词法绑定，不受调用方式影响
- **严格模式**：默认绑定为undefined，非严格模式为全局对象
- **实际应用**：事件处理、回调函数、方法借用中需要注意this指向



**023. [中级]** `call`、`apply`、`bind`方法的区别和用法

- 都是调用和引用其他函数的方法
- call和apply 返回调用后的结果，bind返回一个绑定后的函数；都接收两个参数：第一个为上下文对象this，输入null为全局对象，第二个参数是传入要执行的参数
- call和apply 的作用相同，第二个参数方式不同；call接收的是以逗号分隔的多个参数；apply接收一个数组的参数

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript中改变函数this指向的三种方法，面试官想了解你是否掌握它们的使用场景和实现原理。

**技术错误纠正：**
1. "第一个参数是传入要执行的参数"表述错误，第一个参数是this绑定，后续才是函数参数
2. 缺少具体的使用场景和实现细节

**知识点系统梳理：**

**三种方法的对比：**
- **call(thisArg, arg1, arg2, ...)** - 立即调用，参数逐个传递
- **apply(thisArg, [argsArray])** - 立即调用，参数数组传递
- **bind(thisArg, arg1, arg2, ...)** - 返回新函数，支持参数预设

**实战应用举例：**
```javascript
// 1. 基础用法对比
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: 'John' };

// call - 参数逐个传递
console.log(greet.call(person, 'Hello', '!')); // "Hello, John!"

// apply - 参数数组传递
console.log(greet.apply(person, ['Hi', '.'])); // "Hi, John."

// bind - 返回新函数
const boundGreet = greet.bind(person, 'Hey');
console.log(boundGreet('?')); // "Hey, John?"
```

```javascript
// 2. 实际应用场景
// 数组方法借用
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
const realArray = Array.prototype.slice.call(arrayLike);
console.log(realArray); // ['a', 'b', 'c']

// 事件处理中的this绑定
class EventHandler {
  constructor(name) {
    this.name = name;
  }

  handleClick(event) {
    console.log(`${this.name} clicked`);
  }

  bindEvents() {
    // 使用bind确保this指向正确
    document.addEventListener('click', this.handleClick.bind(this));
  }
}
```

**记忆要点总结：**
- **call**：立即调用，参数逐个传递 - call(this, arg1, arg2)
- **apply**：立即调用，参数数组传递 - apply(this, [args])
- **bind**：返回新函数，支持参数预设 - bind(this, presetArgs)
- **使用场景**：方法借用、this绑定、事件处理、函数式编程



**024. [初级]** 什么是立即执行函数表达式（IIFE）？

使用括号将函数包装并立即调用的函数

```javascript
(function func(...args){
  console.log('arg >',args)
  return 'IIFE'
})(1,2,3)
```

- 避免全局污染
- 模块化封装
- 一次性初始化

## 深度分析与补充

**问题本质解读：** 这道题考察IIFE的概念和应用，面试官想了解你是否理解IIFE的作用和使用场景。

**知识点系统梳理：**

**IIFE的特点：**
- 立即执行，不污染全局作用域
- 创建独立的作用域
- 常用于模块化和初始化

**IIFE的语法形式：**
- `(function() {})()`
- `(function() {}())`
- `!function() {}()`
- `+function() {}()`

**实战应用举例：**
```javascript
// 1. 模块化封装
const MyModule = (function() {
  // 私有变量
  let privateVar = 0;

  // 私有方法
  function privateMethod() {
    return privateVar++;
  }

  // 返回公共接口
  return {
    increment() {
      return privateMethod();
    },
    getCount() {
      return privateVar;
    }
  };
})();

console.log(MyModule.increment()); // 0
console.log(MyModule.getCount());  // 1
```

```javascript
// 2. 避免变量污染
// ❌ 全局变量污染
var config = { debug: true };
var utils = { log: function(msg) { console.log(msg); } };

// ✅ 使用IIFE避免污染
(function() {
  var config = { debug: true };
  var utils = { log: function(msg) { console.log(msg); } };

  // 初始化逻辑
  if (config.debug) {
    utils.log('Debug mode enabled');
  }
})();
```

**记忆要点总结：**
- **定义**：立即执行的函数表达式，创建独立作用域
- **语法**：(function() {})() 或 (function() {}())
- **作用**：避免全局污染、模块化封装、一次性初始化
- **应用场景**：库的封装、插件开发、初始化脚本



**025. [中级]** 如何实现函数的柯里化（currying）？

```javascript
function curry(fn,arity=fn.length){
  return function curried(...args){
    if(args.length >= arity){
      return fn.apply(this,args)
    }
    return function(...nextArgs){
      return curried(...args,...nextArgs)
    }
  }
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察函数式编程的重要概念，面试官想了解你是否理解柯里化的原理和实际应用。

**技术错误纠正：**
1. "airty"应为"arity"（参数数量）
2. 递归调用方式有误，应该直接调用currying函数而不是apply

**知识点系统梳理：**

**柯里化的定义：**
- 将多参数函数转换为一系列单参数函数
- 支持参数的部分应用
- 提高函数的复用性和组合性

**实战应用举例：**
```javascript
// 1. 正确的柯里化实现
function curry(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    return function(...nextArgs) {
      return curried(...args, ...nextArgs);
    };
  };
}

// 使用示例
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

```javascript
// 2. 实际应用场景
// 配置函数的柯里化
const createValidator = curry((rules, data) => {
  return rules.every(rule => rule(data));
});

// 预设验证规则
const validateUser = createValidator([
  user => user.name && user.name.length > 0,
  user => user.email && user.email.includes('@'),
  user => user.age && user.age >= 18
]);

// 使用
const user1 = { name: 'John', email: 'john@example.com', age: 25 };
const user2 = { name: '', email: 'invalid', age: 16 };

console.log(validateUser(user1)); // true
console.log(validateUser(user2)); // false
```

**记忆要点总结：**
- **定义**：将多参数函数转换为一系列单参数函数的技术
- **核心思想**：参数收集，达到预期数量时执行原函数
- **实际应用**：配置函数、验证器、事件处理器的预设
- **优势**：提高函数复用性、支持函数组合、延迟执行



**026. [高级]** 什么是尾调用优化？JavaScript支持吗？

- 函数的最后一个操作是调用一个函数，可以重用当前函数栈而不是创建新的栈

## 深度分析与补充

**问题本质解读：** 这道题考察函数调用优化的高级概念，面试官想了解你是否理解尾调用优化的原理和JavaScript的支持情况。

**知识点系统梳理：**

**尾调用优化（TCO）的定义：**
- 函数的最后一个操作是调用另一个函数
- 可以复用当前栈帧，避免栈溢出
- 主要用于优化递归函数

**JavaScript的支持情况：**
- ES6规范中定义了尾调用优化
- 只在严格模式下生效
- 浏览器支持有限，主要是Safari

**实战应用举例：**
```javascript
// 1. 尾调用优化示例
// ❌ 非尾调用（会栈溢出）
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // 不是尾调用，还要执行乘法
}

// ✅ 尾调用优化版本
function factorialTCO(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTCO(n - 1, n * acc); // 尾调用
}

console.log(factorialTCO(5)); // 120
```

```javascript
// 2. 实际应用：深度遍历优化
function traverseDeep(node, callback, depth = 0) {
  if (!node) return;

  callback(node, depth);

  if (node.children && node.children.length > 0) {
    // 使用循环代替递归，避免栈溢出
    for (const child of node.children) {
      traverseDeep(child, callback, depth + 1);
    }
  }
}

// 使用蹦床函数模拟尾调用优化
function trampoline(fn) {
  while (typeof fn === 'function') {
    fn = fn();
  }
  return fn;
}

function factorialTrampoline(n, acc = 1) {
  if (n <= 1) return acc;
  return () => factorialTrampoline(n - 1, n * acc);
}

console.log(trampoline(() => factorialTrampoline(5))); // 120
```

**记忆要点总结：**
- **定义**：函数最后操作是调用函数，可复用栈帧
- **JavaScript支持**：ES6规范定义，严格模式下，浏览器支持有限
- **替代方案**：使用循环、蹦床函数、迭代器模拟优化
- **实际价值**：防止深度递归导致的栈溢出问题



**027. [中级]** 函数的`length`属性表示什么？

函数的length ~~表示参数的个数~~ 表示函数期望接收的参数个数
只计算第一个默认参数之前的参数个数
不包含剩余参数（...rest）

## 深度分析与补充

**问题本质解读：** 这道题考察函数对象的属性，面试官想了解你是否理解函数length属性的具体含义和特殊情况。

**技术错误纠正：**
1. 原答案过于简单，缺少具体的定义
2. 没有说明默认参数和剩余参数的影响

**知识点系统梳理：**

**length属性的定义：**
- 表示函数期望接收的参数个数
- 只计算第一个默认参数之前的参数
- 不包括剩余参数

**实战应用举例：**
```javascript
// 1. 基础length属性
function basic(a, b, c) {}
console.log(basic.length); // 3

function withDefault(a, b = 2, c) {}
console.log(withDefault.length); // 1 - 只计算到第一个默认参数

function withRest(a, b, ...rest) {}
console.log(withRest.length); // 2 - 不包括剩余参数

// 箭头函数
const arrow = (x, y) => x + y;
console.log(arrow.length); // 2
```

```javascript
// 2. 实际应用：函数重载检测
function createOverloadedFunction() {
  const implementations = new Map();

  function overloaded(...args) {
    const impl = implementations.get(args.length);
    if (impl) {
      return impl.apply(this, args);
    }
    throw new Error(`No implementation for ${args.length} arguments`);
  }

  overloaded.addImplementation = function(fn) {
    implementations.set(fn.length, fn);
    return this;
  };

  return overloaded;
}

// 使用示例
const mathOp = createOverloadedFunction()
  .addImplementation((x) => x * x)           // length = 1
  .addImplementation((x, y) => x + y);       // length = 2

console.log(mathOp(5));    // 25 (平方)
console.log(mathOp(3, 4)); // 7 (相加)
```

**记忆要点总结：**
- **定义**：函数期望接收的参数个数，不是实际传入的参数个数
- **计算规则**：第一个默认参数之前的参数，不包括剩余参数
- **实际应用**：函数重载、参数验证、动态调用
- **注意事项**：与arguments.length不同，length是静态属性



**028. [初级]** 什么是回调函数？

回调函数是指将函数通过参数传递，在执行完上一个函数时执行传入的函数

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript异步编程的基础概念，面试官想了解你是否理解回调函数的作用和使用场景。

**知识点系统梳理：**

**回调函数的定义：**
- 作为参数传递给其他函数的函数
- 在特定时机被调用执行
- 实现异步操作和事件处理的基础

**回调函数的类型：**
- **同步回调** - 立即执行
- **异步回调** - 延迟执行
- **事件回调** - 事件触发时执行

**实战应用举例：**
```javascript
// 1. 基础回调函数应用
function processData(data, callback) {
  console.log('Processing data:', data);
  const result = data.toUpperCase();
  callback(result);
}

function handleResult(result) {
  console.log('Result:', result);
}

processData('hello', handleResult); // Processing data: hello, Result: HELLO
```

```javascript
// 2. 异步回调的实际应用
function fetchUserData(userId, onSuccess, onError) {
  // 模拟异步请求
  setTimeout(() => {
    if (userId > 0) {
      const userData = { id: userId, name: `User${userId}` };
      onSuccess(userData);
    } else {
      onError(new Error('Invalid user ID'));
    }
  }, 1000);
}

// 使用示例
fetchUserData(1,
  (user) => console.log('Success:', user),
  (error) => console.error('Error:', error.message)
);
```

**记忆要点总结：**
- **定义**：作为参数传递的函数，在特定时机被调用
- **用途**：异步操作、事件处理、高阶函数、控制流程
- **类型**：同步回调（立即执行）、异步回调（延迟执行）
- **现代替代**：Promise、async/await提供更好的异步处理方式



**029. [中级]** 如何避免回调地狱（callback hell）？

- 可以使用promise 通过.then ~~串型执行函数~~ 链式调用
- 可以使用async/await

## 深度分析与补充

**问题本质解读：** 这道题考察异步编程的最佳实践，面试官想了解你是否掌握现代JavaScript异步处理方案。

**知识点系统梳理：**

**回调地狱的问题：**
- 代码嵌套层次过深
- 难以阅读和维护
- 错误处理复杂
- 调试困难

**解决方案对比：**
1. **Promise链式调用**
2. **async/await语法**
3. **函数模块化**
4. **使用工具库**

**实战应用举例：**
```javascript
// 1. 回调地狱示例和Promise解决方案
// ❌ 回调地狱
function fetchUserProfile(userId, callback) {
  fetchUser(userId, (user) => {
    fetchPosts(user.id, (posts) => {
      fetchComments(posts[0].id, (comments) => {
        callback({ user, posts, comments });
      });
    });
  });
}

// ✅ Promise链式调用
function fetchUserProfilePromise(userId) {
  return fetchUser(userId)
    .then(user => fetchPosts(user.id).then(posts => ({ user, posts })))
    .then(({ user, posts }) =>
      fetchComments(posts[0].id).then(comments => ({ user, posts, comments }))
    );
}
```

```javascript
// 2. async/await最佳实践
async function fetchUserProfileAsync(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);

    return { user, posts, comments };
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
}

// 并行处理优化
async function fetchUserDataParallel(userId) {
  try {
    const user = await fetchUser(userId);

    // 并行获取posts和其他数据
    const [posts, settings] = await Promise.all([
      fetchPosts(user.id),
      fetchUserSettings(user.id)
    ]);

    return { user, posts, settings };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

**记忆要点总结：**
- **问题本质**：多层嵌套回调导致代码难以维护
- **Promise方案**：链式调用，更好的错误处理
- **async/await**：同步风格的异步代码，最推荐
- **最佳实践**：函数拆分、错误处理、并行优化



**030. [高级]** 解释函数式编程中的纯函数概念

- 纯函数是指那些不产生任何副作用的函数，~~修改其他变量值~~ 不修改外部状态，任何情况下固定的输入都对应固定的输出

## 深度分析与补充

**问题本质解读：** 这道题考察函数式编程的核心概念，面试官想了解你是否理解纯函数的特性和实际应用价值。

**技术错误纠正：**
1. "修改其他变量值"表述不清楚，应该是"不修改外部状态"
2. 缺少纯函数的具体特征说明

**知识点系统梳理：**

**纯函数的特征：**
1. **相同输入总是产生相同输出**
2. **没有副作用** - 不修改外部状态
3. **不依赖外部状态** - 只依赖输入参数
4. **可预测性强** - 便于测试和调试

**副作用的定义：**
- 修改全局变量
- 修改输入参数
- 进行I/O操作
- 调用其他有副作用的函数

**实战应用举例：**
```javascript
// 1. 纯函数 vs 非纯函数对比
// ❌ 非纯函数
let count = 0;
function impureIncrement(value) {
  count++; // 修改外部变量
  return value + count;
}

// ✅ 纯函数
function pureAdd(a, b) {
  return a + b; // 只依赖输入参数，无副作用
}

console.log(pureAdd(2, 3)); // 总是返回5
console.log(pureAdd(2, 3)); // 总是返回5
```

```javascript
// 2. 实际应用：数据处理管道
const users = [
  { id: 1, name: 'John', age: 25, active: true },
  { id: 2, name: 'Jane', age: 30, active: false },
  { id: 3, name: 'Bob', age: 35, active: true }
];

// 纯函数组合
const isActive = user => user.active;
const isAdult = user => user.age >= 18;
const getName = user => user.name;
const toUpperCase = str => str.toUpperCase();

// 函数组合处理数据
const getActiveAdultNames = (users) =>
  users
    .filter(isActive)
    .filter(isAdult)
    .map(getName)
    .map(toUpperCase);

console.log(getActiveAdultNames(users)); // ['JOHN', 'BOB']
```

**记忆要点总结：**
- **定义**：相同输入产生相同输出，无副作用的函数
- **特征**：可预测、可测试、可缓存、可并行
- **优势**：易于理解、调试、测试和维护
- **实际应用**：数据处理、状态管理、函数组合



### 对象与原型（15道）

**031. [初级]** 如何创建一个对象？有几种方式？

- new一个对象(构造函数)
- Object.create() 指定原型创建
- ~~变量声明~~ 对象字面量
- 工厂函数
- ES6类语法 class

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript对象创建的多种方式，面试官想了解你是否掌握不同创建方式的特点和使用场景。

**技术错误纠正：**
1. "变量声明"表述不准确，应该是"对象字面量"
2. 缺少其他重要的对象创建方式
3. 没有说明各种方式的特点和适用场景

**知识点系统梳理：**

**对象创建的方式：**
1. **对象字面量** - 最常用的方式
2. **构造函数** - 使用new操作符
3. **Object.create()** - 指定原型创建
4. **工厂函数** - 返回对象的函数
5. **ES6类语法** - 现代化的创建方式

**实战应用举例：**
```javascript
// 1. 对象字面量（最常用）
const user1 = {
  name: 'John',
  age: 25,
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

// 动态属性名
const propName = 'email';
const user2 = {
  name: 'Jane',
  [propName]: 'jane@example.com',
  [`get${propName.charAt(0).toUpperCase() + propName.slice(1)}`]() {
    return this[propName];
  }
};
```

```javascript
// 2. 构造函数和ES6类
// 构造函数方式
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

const person1 = new Person('Bob', 30);

// ES6类语法（推荐）
class ModernPerson {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  static createAnonymous() {
    return new ModernPerson('Anonymous', 0);
  }
}

const person2 = new ModernPerson('Alice', 28);
const anonymous = ModernPerson.createAnonymous();
```

**记忆要点总结：**
- **对象字面量**：简单直接，适合单个对象创建
- **构造函数/类**：适合创建多个相似对象，支持继承
- **Object.create()**：精确控制原型链，适合继承场景
- **工厂函数**：灵活的对象创建，支持复杂初始化逻辑
- **最佳实践**：根据需求选择合适的创建方式



**032. [中级]** 什么是原型链？

原型链是javascript内部的继承机制，每个对象都有一个内部链接指向另一个对象，~~这个对象就要原型~~这个对象就是原型。当访问对象的属性时，会先查找对象本身，如果没有找到会沿着原型链依次向上查找，直到找到属性或者到达原型链的顶端。

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript继承机制的核心概念，面试官想了解你是否理解原型链的工作原理和实际应用。

**技术错误纠正：**
1. "这个对象就要原型"应为"这个对象就是原型"
2. 原答案基本正确，但缺少具体的查找机制和实现细节
3. 没有说明原型链的终点和特殊情况

**知识点系统梳理：**

**原型链的核心概念：**
- 每个对象都有一个内部属性[[Prototype]]（通过__proto__访问）
- 原型链是对象之间的链式连接关系
- 属性查找沿着原型链向上进行，直到找到属性或到达null
- Object.prototype是大多数对象的原型链顶端

**原型链的查找机制：**
1. 在对象自身查找属性
2. 如果没找到，在对象的原型中查找
3. 继续在原型的原型中查找
4. 直到找到属性或到达原型链顶端（null）

**实战应用举例：**
```javascript
// 1. 基础原型链演示
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  return `Hello, I'm ${this.name}`;
};

Person.prototype.species = 'Homo sapiens';

const john = new Person('John');

// 原型链查找过程演示
console.log(john.name); // 'John' - 在对象自身找到
console.log(john.sayHello()); // 'Hello, I'm John' - 在Person.prototype找到
console.log(john.species); // 'Homo sapiens' - 在Person.prototype找到
console.log(john.toString()); // '[object Object]' - 在Object.prototype找到

// 2. 原型链的结构
console.log(john.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true

// 完整的原型链：john -> Person.prototype -> Object.prototype -> null

// 3. 原型链查找的详细过程
function demonstratePrototypeChain() {
  // 创建原型链：child -> parent -> grandparent -> Object.prototype -> null
  const grandparent = {
    familyName: 'Smith',
    greet() {
      return 'Hello from grandparent';
    }
  };

  const parent = Object.create(grandparent);
  parent.occupation = 'Engineer';
  parent.greet = function() {
    return 'Hello from parent';
  };

  const child = Object.create(parent);
  child.age = 10;

  // 属性查找演示
  console.log(child.age); // 10 - 在child自身找到
  console.log(child.occupation); // 'Engineer' - 在parent找到
  console.log(child.familyName); // 'Smith' - 在grandparent找到
  console.log(child.greet()); // 'Hello from parent' - 在parent找到（覆盖了grandparent的方法）
  console.log(child.toString()); // '[object Object]' - 在Object.prototype找到

  return { grandparent, parent, child };
}

const family = demonstratePrototypeChain();

// 4. 原型链的动态性
function Animal(name) {
  this.name = name;
}

const dog = new Animal('Buddy');

// 动态添加方法到原型
Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

console.log(dog.speak()); // 'Buddy makes a sound' - 动态添加的方法立即可用

// 5. 原型链的继承实现
function Vehicle(brand) {
  this.brand = brand;
}

Vehicle.prototype.start = function() {
  return `${this.brand} vehicle started`;
};

function Car(brand, model) {
  Vehicle.call(this, brand); // 调用父构造函数
  this.model = model;
}

// 设置原型链继承
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

Car.prototype.drive = function() {
  return `Driving ${this.brand} ${this.model}`;
};

const myCar = new Car('Toyota', 'Camry');
console.log(myCar.start()); // 'Toyota vehicle started' - 继承的方法
console.log(myCar.drive()); // 'Driving Toyota Camry' - 自己的方法

// 6. ES6 Class的原型链
class ModernVehicle {
  constructor(brand) {
    this.brand = brand;
  }

  start() {
    return `${this.brand} started`;
  }
}

class ModernCar extends ModernVehicle {
  constructor(brand, model) {
    super(brand);
    this.model = model;
  }

  drive() {
    return `Driving ${this.brand} ${this.model}`;
  }
}

const modernCar = new ModernCar('Honda', 'Civic');
console.log(modernCar.start()); // 'Honda started'
console.log(modernCar.drive()); // 'Driving Honda Civic'

// ES6 class的原型链结构与传统方式相同
console.log(modernCar.__proto__ === ModernCar.prototype); // true
console.log(ModernCar.prototype.__proto__ === ModernVehicle.prototype); // true

// 7. 原型链的实用工具函数
const PrototypeUtils = {
  // 获取完整的原型链
  getPrototypeChain(obj) {
    const chain = [];
    let current = obj;

    while (current !== null) {
      chain.push(current);
      current = Object.getPrototypeOf(current);
    }

    return chain;
  },

  // 检查对象是否在原型链中
  isInPrototypeChain(obj, prototype) {
    return prototype.isPrototypeOf(obj);
  },

  // 查找属性的来源
  findPropertySource(obj, prop) {
    let current = obj;

    while (current !== null) {
      if (current.hasOwnProperty(prop)) {
        return current;
      }
      current = Object.getPrototypeOf(current);
    }

    return null;
  },

  // 获取所有可枚举属性（包括原型链）
  getAllEnumerableProps(obj) {
    const props = [];
    for (const prop in obj) {
      props.push(prop);
    }
    return props;
  },

  // 获取自有属性
  getOwnProps(obj) {
    return Object.getOwnPropertyNames(obj);
  }
};

// 使用工具函数
const chain = PrototypeUtils.getPrototypeChain(myCar);
console.log('Prototype chain length:', chain.length);

const propertySource = PrototypeUtils.findPropertySource(myCar, 'start');
console.log('Property "start" found in:', propertySource === Vehicle.prototype);

// 8. 原型链的性能考虑
function performanceDemo() {
  // 创建深层原型链
  let obj = {};
  for (let i = 0; i < 100; i++) {
    const newObj = Object.create(obj);
    newObj[`prop${i}`] = i;
    obj = newObj;
  }

  // 访问深层属性的性能测试
  const start = performance.now();
  for (let i = 0; i < 10000; i++) {
    obj.prop0; // 访问原型链底部的属性
  }
  const end = performance.now();

  console.log(`Deep prototype chain access took ${end - start} ms`);
}

// 9. 原型污染防护
function createSafeObject() {
  // 创建没有原型的对象
  const safeObj = Object.create(null);
  safeObj.name = 'Safe Object';

  console.log(safeObj.toString); // undefined - 没有继承Object.prototype
  console.log(Object.getPrototypeOf(safeObj)); // null

  return safeObj;
}

const safeObj = createSafeObject();

// 10. 原型链的调试技巧
function debugPrototypeChain(obj, objName = 'object') {
  console.group(`Prototype chain for ${objName}:`);

  let current = obj;
  let level = 0;

  while (current !== null) {
    const constructor = current.constructor;
    const constructorName = constructor ? constructor.name : 'Unknown';

    console.log(`Level ${level}:`, {
      object: current,
      constructor: constructorName,
      ownProperties: Object.getOwnPropertyNames(current)
    });

    current = Object.getPrototypeOf(current);
    level++;
  }

  console.groupEnd();
}

// 调试示例
debugPrototypeChain(myCar, 'myCar');
```

**原型链的特殊情况：**
```javascript
// 1. 函数的原型链
function myFunction() {}
console.log(myFunction.__proto__ === Function.prototype); // true
console.log(Function.prototype.__proto__ === Object.prototype); // true

// 2. 数组的原型链
const arr = [1, 2, 3];
console.log(arr.__proto__ === Array.prototype); // true
console.log(Array.prototype.__proto__ === Object.prototype); // true

// 3. 原始值的原型链（装箱）
const str = 'hello';
console.log(str.__proto__ === String.prototype); // true（临时装箱）

// 4. null和undefined没有原型
console.log(Object.getPrototypeOf(null)); // TypeError
console.log(Object.getPrototypeOf(undefined)); // TypeError
```

**记忆要点总结：**
- **定义**：对象间的链式连接，用于属性查找和继承
- **查找机制**：自身 → 原型 → 原型的原型 → ... → null
- **访问方式**：__proto__（非标准）、Object.getPrototypeOf()（标准）
- **终点**：Object.prototype.__proto__ === null
- **性能考虑**：避免过深的原型链，影响属性查找性能
- **实际应用**：继承实现、方法共享、动态扩展功能



**033. [中级]** `__proto__`和`prototype`的区别是什么？

`__proto__`和`prototype`都可以访问对象的原型

`__proto__` : 对象的原型链 访问对象的原型 对象属性
`prototype` : 函数的原型属性 定义构造函数的原型方法和属性 函数属性

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript原型系统的两个重要概念，面试官想了解你是否理解它们的不同作用和使用场景。

**技术错误纠正：**
1. 原答案不完整，缺少具体的区别说明
2. "__proto__"和"prototype"的作用和使用场景不同
3. 缺少现代JavaScript的标准替代方案

**知识点系统梳理：**

**__proto__ vs prototype：**
- **__proto__** - 对象的原型链接，指向对象的原型
- **prototype** - 函数的原型属性，用于构造函数创建对象时设置原型

**使用场景：**
- **__proto__** - 访问对象的原型（非标准，不推荐）
- **prototype** - 定义构造函数的原型方法和属性

**实战应用举例：**
```javascript
// 1. __proto__ vs prototype 基础对比
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

const john = new Person('John');

// prototype - 函数的属性，用于设置新对象的原型
console.log(Person.prototype); // { greet: function, constructor: Person }

// __proto__ - 对象的原型链接
console.log(john.__proto__ === Person.prototype); // true
console.log(john.__proto__.greet === Person.prototype.greet); // true
```

```javascript
// 2. 标准方法的使用（推荐）
// ❌ 避免使用 __proto__（非标准）
// john.__proto__.newMethod = function() { return 'new'; };

// ✅ 使用标准方法
// 获取原型
const prototype = Object.getPrototypeOf(john);
console.log(prototype === Person.prototype); // true

// 设置原型
const newObj = {};
Object.setPrototypeOf(newObj, Person.prototype);
console.log(Object.getPrototypeOf(newObj) === Person.prototype); // true

// 创建时指定原型
const anotherObj = Object.create(Person.prototype);
anotherObj.name = 'Jane';
console.log(anotherObj.greet()); // "Hello, I'm Jane"
```

**记忆要点总结：**
- **prototype**：函数属性，用于构造函数设置新对象的原型
- **__proto__**：对象属性，指向对象的原型（非标准，不推荐）
- **标准替代**：Object.getPrototypeOf()、Object.setPrototypeOf()
- **使用建议**：使用标准方法操作原型，避免直接使用__proto__

`__proto__`是访问原型的非标准方式，已经废弃。



**034. [初级]** 如何检查对象是否具有某个属性？

- Object.prototype.hasOwnProperty
- in
- Object.hasOwn()
- propertyIsEnumerable()

## 深度分析与补充

**问题本质解读：** 这道题考察对象属性检测的方法，面试官想了解你是否掌握不同检测方法的区别和使用场景。

**知识点系统梳理：**

**属性检测方法对比：**
1. **hasOwnProperty()** - 检测自有属性
2. **in操作符** - 检测自有属性和继承属性
3. **Object.hasOwn()** - ES2022新方法，推荐使用
4. **propertyIsEnumerable()** - 检测可枚举的自有属性

**实战应用举例：**
```javascript
// 1. 不同检测方法的对比
const parent = { inherited: 'value' };
const child = Object.create(parent);
child.own = 'own value';

console.log(child.hasOwnProperty('own'));        // true
console.log(child.hasOwnProperty('inherited'));  // false
console.log('own' in child);                     // true
console.log('inherited' in child);               // true

// ES2022新方法（推荐）
console.log(Object.hasOwn(child, 'own'));        // true
console.log(Object.hasOwn(child, 'inherited'));  // false
```

```javascript
// 2. 安全的属性检测工具
function safeHasProperty(obj, prop) {
  // 避免对象没有hasOwnProperty方法的情况
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// 或使用现代方法
function modernHasProperty(obj, prop) {
  return Object.hasOwn(obj, prop);
}

// 检测所有类型的属性
function hasAnyProperty(obj, prop) {
  return prop in obj;
}

// 使用示例
const testObj = Object.create(null); // 没有原型的对象
testObj.test = 'value';

console.log(safeHasProperty(testObj, 'test'));    // true
console.log(modernHasProperty(testObj, 'test'));  // true
```

**记忆要点总结：**
- **hasOwnProperty()**：检测自有属性，不包括继承属性
- **in操作符**：检测所有属性，包括继承属性
- **Object.hasOwn()**：ES2022新方法，替代hasOwnProperty
- **最佳实践**：使用Object.hasOwn()或Object.prototype.hasOwnProperty.call()



**035. [中级]** `hasOwnProperty`和`in`操作符的区别

都是判断对象是否含有某个属性

- hasOwnProperty 判断对象自身是否含有
- in 判断自身以及原型链上是否含有

## 深度分析与补充

**问题本质解读：** 这道题考察属性检测方法的具体差异，面试官想了解你是否理解原型链在属性检测中的作用。

**知识点系统梳理：**

**检测范围对比：**
- **hasOwnProperty** - 仅检测对象自身的属性
- **in操作符** - 检测对象自身和原型链上的属性
- **区别关键** - 是否包含继承属性

**实战应用举例：**
```javascript
// 1. 继承属性检测对比
function Parent() {
  this.parentProp = 'parent';
}
Parent.prototype.inheritedMethod = function() {
  return 'inherited';
};

function Child() {
  Parent.call(this);
  this.childProp = 'child';
}
Child.prototype = Object.create(Parent.prototype);

const instance = new Child();

// hasOwnProperty - 只检测自有属性
console.log(instance.hasOwnProperty('childProp'));      // true
console.log(instance.hasOwnProperty('parentProp'));     // true
console.log(instance.hasOwnProperty('inheritedMethod')); // false

// in操作符 - 检测所有可访问属性
console.log('childProp' in instance);      // true
console.log('parentProp' in instance);     // true
console.log('inheritedMethod' in instance); // true
```

```javascript
// 2. 实际应用：对象属性遍历
function analyzeObject(obj) {
  const ownProps = [];
  const inheritedProps = [];

  // 遍历所有可枚举属性
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      ownProps.push(prop);
    } else {
      inheritedProps.push(prop);
    }
  }

  return {
    own: ownProps,
    inherited: inheritedProps,
    total: ownProps.length + inheritedProps.length
  };
}

// 使用示例
const testObj = new Child();
const analysis = analyzeObject(testObj);
console.log(analysis);
// { own: ['parentProp', 'childProp'], inherited: ['inheritedMethod'], total: 3 }
```

**记忆要点总结：**
- **hasOwnProperty**：只检测自有属性，不包括继承属性
- **in操作符**：检测所有属性，包括原型链上的属性
- **使用场景**：遍历自有属性用hasOwnProperty，检测属性存在用in
- **注意事项**：hasOwnProperty可能被重写，建议使用Object.hasOwn()



**036. [中级]** 如何实现对象的深拷贝？

- 使用lodash 库
- weakMap + 递归

## 深度分析与补充

**问题本质解读：** 这道题考察对象拷贝的深层理解，面试官想了解你是否掌握深拷贝的实现原理和各种边界情况的处理。

**技术错误纠正：**
1. 原答案过于简单，缺少具体的实现方案
2. 没有说明深拷贝与浅拷贝的区别
3. 缺少对各种数据类型和边界情况的处理

**知识点系统梳理：**

**深拷贝 vs 浅拷贝：**
- **浅拷贝**：只复制对象的第一层属性，嵌套对象仍然共享引用
- **深拷贝**：递归复制对象的所有层级，创建完全独立的副本

**深拷贝的实现方法：**
1. JSON.parse(JSON.stringify()) - 简单但有限制
2. 递归实现 - 灵活但需要处理循环引用
3. 第三方库 - 功能完整但增加依赖
4. 结构化克隆算法 - 现代浏览器支持

**实战应用举例：**
```javascript
// 1. 浅拷贝 vs 深拷贝演示
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA'
  },
  hobbies: ['reading', 'coding']
};

// 浅拷贝
const shallowCopy = { ...original };
shallowCopy.address.city = 'Los Angeles';
console.log(original.address.city); // 'Los Angeles' - 原对象被修改！

// 2. JSON方法的深拷贝（有限制）
function jsonDeepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const jsonCopy = jsonDeepClone(original);
jsonCopy.address.city = 'Chicago';
console.log(original.address.city); // 'Los Angeles' - 原对象未被修改

// JSON方法的限制演示
const complexObj = {
  date: new Date(),
  regex: /test/g,
  func: function() { return 'hello'; },
  undefined: undefined,
  symbol: Symbol('test'),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3])
};

const jsonCloned = jsonDeepClone(complexObj);
console.log(jsonCloned);
// 结果：{ date: "2023-...", regex: {}, func: undefined, map: {}, set: {} }
// 丢失了函数、undefined、Symbol、Map、Set等

// 3. 基础递归深拷贝实现
function basicDeepClone(obj) {
  // 处理原始类型和null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理日期
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => basicDeepClone(item));
  }

  // 处理普通对象
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = basicDeepClone(obj[key]);
    }
  }

  return cloned;
}

// 4. 完整的深拷贝实现（处理循环引用）
function advancedDeepClone(obj, hash = new WeakMap()) {
  // 处理null和非对象类型
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  let cloned;

  // 处理各种对象类型
  if (obj instanceof Date) {
    cloned = new Date(obj.getTime());
  } else if (obj instanceof RegExp) {
    cloned = new RegExp(obj.source, obj.flags);
  } else if (obj instanceof Map) {
    cloned = new Map();
    hash.set(obj, cloned);
    for (const [key, value] of obj) {
      cloned.set(advancedDeepClone(key, hash), advancedDeepClone(value, hash));
    }
    return cloned;
  } else if (obj instanceof Set) {
    cloned = new Set();
    hash.set(obj, cloned);
    for (const value of obj) {
      cloned.add(advancedDeepClone(value, hash));
    }
    return cloned;
  } else if (Array.isArray(obj)) {
    cloned = [];
  } else if (obj.constructor === Object) {
    cloned = {};
  } else {
    // 处理其他类型的对象（如自定义类实例）
    cloned = Object.create(Object.getPrototypeOf(obj));
  }

  // 设置循环引用映射
  hash.set(obj, cloned);

  // 复制属性
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = advancedDeepClone(obj[key], hash);
    }
  }

  return cloned;
}

// 5. 测试循环引用
const circularObj = { name: 'test' };
circularObj.self = circularObj;

const clonedCircular = advancedDeepClone(circularObj);
console.log(clonedCircular.self === clonedCircular); // true
console.log(clonedCircular !== circularObj); // true

// 6. 现代浏览器的结构化克隆
function structuredClone(obj) {
  // 使用MessageChannel进行结构化克隆
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port2.onmessage = (e) => resolve(e.data);
    channel.port1.postMessage(obj);
  });
}

// 使用示例（异步）
// structuredClone(complexObj).then(cloned => console.log(cloned));

// 7. 性能优化的深拷贝
class DeepCloner {
  constructor() {
    this.cache = new WeakMap();
  }

  clone(obj) {
    // 重置缓存
    this.cache = new WeakMap();
    return this._clone(obj);
  }

  _clone(obj) {
    // 原始类型直接返回
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // 检查缓存
    if (this.cache.has(obj)) {
      return this.cache.get(obj);
    }

    let result;

    // 根据类型进行克隆
    const type = Object.prototype.toString.call(obj);

    switch (type) {
      case '[object Date]':
        result = new Date(obj.getTime());
        break;
      case '[object RegExp]':
        result = new RegExp(obj.source, obj.flags);
        break;
      case '[object Array]':
        result = [];
        this.cache.set(obj, result);
        obj.forEach((item, index) => {
          result[index] = this._clone(item);
        });
        break;
      case '[object Object]':
        result = {};
        this.cache.set(obj, result);
        Object.keys(obj).forEach(key => {
          result[key] = this._clone(obj[key]);
        });
        break;
      case '[object Map]':
        result = new Map();
        this.cache.set(obj, result);
        obj.forEach((value, key) => {
          result.set(this._clone(key), this._clone(value));
        });
        break;
      case '[object Set]':
        result = new Set();
        this.cache.set(obj, result);
        obj.forEach(value => {
          result.add(this._clone(value));
        });
        break;
      default:
        // 其他类型，尝试创建相同原型的对象
        result = Object.create(Object.getPrototypeOf(obj));
        this.cache.set(obj, result);
        Object.keys(obj).forEach(key => {
          result[key] = this._clone(obj[key]);
        });
    }

    return result;
  }
}

const cloner = new DeepCloner();

// 8. 实际项目中的应用场景
class StateManager {
  constructor(initialState = {}) {
    this.state = initialState;
    this.history = [this.deepClone(initialState)];
    this.cloner = new DeepCloner();
  }

  setState(newState) {
    // 深拷贝当前状态，避免意外修改
    this.state = { ...this.state, ...newState };
    this.history.push(this.deepClone(this.state));
  }

  getState() {
    // 返回状态的深拷贝，防止外部修改
    return this.deepClone(this.state);
  }

  undo() {
    if (this.history.length > 1) {
      this.history.pop();
      this.state = this.deepClone(this.history[this.history.length - 1]);
    }
  }

  deepClone(obj) {
    return this.cloner.clone(obj);
  }
}

// 使用示例
const stateManager = new StateManager({ count: 0, user: { name: 'John' } });
stateManager.setState({ count: 1 });
stateManager.setState({ user: { name: 'Jane', age: 25 } });

const currentState = stateManager.getState();
currentState.user.name = 'Modified'; // 不会影响内部状态

console.log(stateManager.getState().user.name); // 'Jane'

// 9. 性能测试工具
function performanceTest() {
  const testObj = {
    numbers: Array.from({ length: 1000 }, (_, i) => i),
    nested: {
      deep: {
        deeper: {
          data: 'test'.repeat(100)
        }
      }
    },
    date: new Date(),
    regex: /test/g
  };

  const methods = {
    'JSON方法': () => JSON.parse(JSON.stringify(testObj)),
    '基础递归': () => basicDeepClone(testObj),
    '高级递归': () => advancedDeepClone(testObj),
    '类实现': () => cloner.clone(testObj)
  };

  Object.entries(methods).forEach(([name, method]) => {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      method();
    }
    const end = performance.now();
    console.log(`${name}: ${(end - start).toFixed(2)}ms`);
  });
}

// 10. 工具函数集合
const CloneUtils = {
  // 检查是否需要深拷贝
  needsDeepClone(obj) {
    if (obj === null || typeof obj !== 'object') return false;

    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
        return true;
      }
    }
    return false;
  },

  // 智能拷贝（根据需要选择浅拷贝或深拷贝）
  smartClone(obj) {
    return this.needsDeepClone(obj) ? advancedDeepClone(obj) : { ...obj };
  },

  // 部分深拷贝（只拷贝指定属性）
  partialDeepClone(obj, keys) {
    const result = {};
    keys.forEach(key => {
      if (key in obj) {
        result[key] = advancedDeepClone(obj[key]);
      }
    });
    return result;
  }
};
```

**各种方法的对比：**

| 方法 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| JSON方法 | 简单快速 | 类型限制多 | 简单对象 |
| 递归实现 | 灵活可控 | 需要处理边界情况 | 复杂对象 |
| 第三方库 | 功能完整 | 增加依赖 | 生产环境 |
| 结构化克隆 | 原生支持 | 浏览器兼容性 | 现代浏览器 |

**记忆要点总结：**
- **核心概念**：深拷贝创建完全独立的副本，浅拷贝只复制第一层
- **实现方法**：JSON方法（简单）、递归实现（灵活）、第三方库（完整）
- **关键问题**：循环引用、特殊对象类型、性能优化
- **实际应用**：状态管理、数据备份、防止意外修改
- **最佳实践**：根据需求选择合适的方法，注意性能和功能平衡



**037. [高级]** `Object.create()`方法的作用和用法

~~创造一个没有原型的对象~~ 创建具有指定原型的对象

## 深度分析与补充

**问题本质解读：** 这道题考察Object.create()的核心功能，面试官想了解你是否理解原型继承的精确控制方法。

**技术错误纠正：**
1. 原答案理解错误：Object.create()不是"创造没有原型的对象"，而是"创建具有指定原型的对象"
2. Object.create(null)才是创建没有原型的对象
3. 缺少Object.create()的完整用法和参数说明

**知识点系统梳理：**

**Object.create()的作用：**
- 创建一个新对象，使用指定的对象作为新对象的原型
- 可选的第二个参数用于定义新对象的属性描述符
- 提供了精确控制原型链的能力

**语法格式：**
```javascript
Object.create(proto[, propertiesObject])
```

**实战应用举例：**
```javascript
// 1. 基础原型继承
const personPrototype = {
  greet() {
    return `Hello, I'm ${this.name}`;
  },
  setName(name) {
    this.name = name;
    return this;
  }
};

// 创建具有指定原型的对象
const john = Object.create(personPrototype);
john.name = 'John';
console.log(john.greet()); // "Hello, I'm John"

// 创建没有原型的对象
const pureObject = Object.create(null);
pureObject.data = 'some data';
console.log(pureObject.toString); // undefined - 没有继承Object.prototype
```

```javascript
// 2. 带属性描述符的对象创建
const animal = {
  type: 'animal',
  speak() {
    return `${this.name} makes a sound`;
  }
};

const dog = Object.create(animal, {
  name: {
    value: 'Buddy',
    writable: true,
    enumerable: true,
    configurable: true
  },
  breed: {
    value: 'Golden Retriever',
    writable: false,  // 只读属性
    enumerable: true,
    configurable: false
  },
  age: {
    get() {
      return this._age || 0;
    },
    set(value) {
      if (value >= 0) this._age = value;
    },
    enumerable: true,
    configurable: true
  }
});

console.log(dog.speak()); // "Buddy makes a sound"
dog.age = 3;
console.log(dog.age); // 3
```

**记忆要点总结：**
- **核心作用**：创建具有指定原型的新对象
- **特殊用法**：Object.create(null)创建无原型对象
- **第二参数**：可选的属性描述符对象
- **应用场景**：原型继承、创建纯数据对象、精确控制对象结构



**038. [中级]** 什么是属性描述符？如何使用？

- Object.defineProperty()

```javascript
// 数据描述符包含四个特性
const obj = {};

Object.defineProperty(obj, 'name', {
    value: 'Alice',           // 属性的值
    writable: true,           // 是否可写
    enumerable: true,         // 是否可枚举
    configurable: true        // 是否可配置
});

```

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript对象属性的精确控制机制，面试官想了解你是否理解属性的内部特性和高级用法。

**知识点系统梳理：**

**属性描述符的类型：**
1. **数据描述符** - value、writable、enumerable、configurable
2. **访问器描述符** - get、set、enumerable、configurable

**属性特性说明：**
- **value** - 属性的值
- **writable** - 是否可修改
- **enumerable** - 是否可枚举（for...in、Object.keys等）
- **configurable** - 是否可重新配置或删除
- **get/set** - 访问器函数

**实战应用举例：**
```javascript
// 1. 数据描述符的完整应用
const user = {};

Object.defineProperty(user, 'id', {
  value: 1001,
  writable: false,    // 只读属性
  enumerable: true,
  configurable: false // 不可删除或重新配置
});

Object.defineProperty(user, 'name', {
  value: 'John',
  writable: true,
  enumerable: true,
  configurable: true
});

console.log(user.id);   // 1001
user.id = 2002;         // 静默失败（严格模式下会报错）
console.log(user.id);   // 1001 - 未改变
```

```javascript
// 2. 访问器描述符的实际应用
const temperature = {
  _celsius: 0
};

Object.defineProperty(temperature, 'fahrenheit', {
  get() {
    return this._celsius * 9/5 + 32;
  },
  set(value) {
    this._celsius = (value - 32) * 5/9;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(temperature, 'celsius', {
  get() {
    return this._celsius;
  },
  set(value) {
    this._celsius = value;
  },
  enumerable: true,
  configurable: true
});

temperature.celsius = 25;
console.log(temperature.fahrenheit); // 77
temperature.fahrenheit = 86;
console.log(temperature.celsius);    // 30
```

**记忆要点总结：**
- **两种类型**：数据描述符（value/writable）和访问器描述符（get/set）
- **共同特性**：enumerable（可枚举）、configurable（可配置）
- **使用方法**：Object.defineProperty()、Object.defineProperties()
- **实际应用**：创建只读属性、计算属性、属性验证、API设计



**039. [初级]** 如何遍历对象的属性？

- Object.keys()
- Object.values()
- Object.entries()
- for...in 
- Object.getOwnPropertyNames()

## 深度分析与补充

**问题本质解读：** 这道题考察对象属性遍历的多种方法，面试官想了解你是否掌握不同遍历方式的特点和使用场景。

**知识点系统梳理：**

**对象遍历方法对比：**
1. **for...in** - 遍历可枚举属性（包括继承）
2. **Object.keys()** - 返回自有可枚举属性名数组
3. **Object.values()** - 返回自有可枚举属性值数组
4. **Object.entries()** - 返回自有可枚举属性[key, value]数组
5. **Object.getOwnPropertyNames()** - 返回所有自有属性名

**实战应用举例：**
```javascript
// 1. 不同遍历方法的对比
const parent = { inherited: 'parent value' };
const child = Object.create(parent);
child.own1 = 'value1';
child.own2 = 'value2';

// 定义不可枚举属性
Object.defineProperty(child, 'hidden', {
  value: 'hidden value',
  enumerable: false
});

console.log('for...in:');
for (const key in child) {
  console.log(key); // own1, own2, inherited
}

console.log('Object.keys():', Object.keys(child)); // ['own1', 'own2']
console.log('Object.values():', Object.values(child)); // ['value1', 'value2']
console.log('Object.entries():', Object.entries(child)); // [['own1', 'value1'], ['own2', 'value2']]
console.log('Object.getOwnPropertyNames():', Object.getOwnPropertyNames(child)); // ['own1', 'own2', 'hidden']
```

```javascript
// 2. 实际应用：对象数据处理
const userData = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  age: 25,
  active: true
};

// 过滤和转换对象数据
function processUserData(user) {
  // 使用Object.entries进行数据转换
  const processed = Object.entries(user)
    .filter(([key, value]) => value !== null && value !== undefined)
    .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  return processed;
}

// 创建对象的副本，只包含指定属性
function pickProperties(obj, keys) {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

console.log(processUserData(userData));
console.log(pickProperties(userData, ['name', 'email'])); // { name: 'John', email: 'john@example.com' }
```

**记忆要点总结：**
- **Object.keys()**：返回自有可枚举属性名数组
- **Object.values()**：返回自有可枚举属性值数组
- **Object.entries()**：返回[key, value]对数组，适合转换操作
- **for...in**：遍历所有可枚举属性（包括继承），需要hasOwnProperty检查
- **使用场景**：数据转换用entries，属性检查用keys，值处理用values



**040. [中级]** `Object.keys()`、`Object.values()`、`Object.entries()`的区别

- Object.keys() 遍历对象的键 返回自有可枚举属性名数组
- Object.values() 遍历对象的值 返回自有可枚举属性值数组
- Object.entries() 遍历对象的键值对 返回[key, value]对数组，适合转换操作

## 深度分析与补充

**问题本质解读：** 这道题考察三个相关方法的具体差异，面试官想了解你是否理解它们的返回值类型和使用场景。

**知识点系统梳理：**

**三个方法的对比：**
- **Object.keys()** - 返回字符串数组，包含对象的属性名
- **Object.values()** - 返回数组，包含对象的属性值
- **Object.entries()** - 返回二维数组，每个子数组包含[key, value]

**共同特点：**
- 只处理对象自有的可枚举属性
- 不包括继承的属性
- 不包括Symbol属性

**实战应用举例：**
```javascript
// 1. 基础用法对比
const user = {
  name: 'John',
  age: 25,
  email: 'john@example.com'
};

console.log(Object.keys(user));    // ['name', 'age', 'email']
console.log(Object.values(user));  // ['John', 25, 'john@example.com']
console.log(Object.entries(user)); // [['name', 'John'], ['age', 25], ['email', 'john@example.com']]

// 配合数组方法使用
const hasEmail = Object.keys(user).includes('email');
const allValuesValid = Object.values(user).every(value => value != null);
const userMap = new Map(Object.entries(user));
```

```javascript
// 2. 实际应用：对象转换和验证
// 对象属性验证
function validateObject(obj, requiredKeys) {
  const objKeys = Object.keys(obj);
  const missingKeys = requiredKeys.filter(key => !objKeys.includes(key));
  const hasAllRequired = missingKeys.length === 0;

  return {
    valid: hasAllRequired,
    missing: missingKeys,
    provided: objKeys
  };
}

// 对象值的统计分析
function analyzeValues(obj) {
  const values = Object.values(obj);

  return {
    total: values.length,
    types: [...new Set(values.map(v => typeof v))],
    nullish: values.filter(v => v == null).length,
    truthy: values.filter(Boolean).length
  };
}

// 使用示例
const testObj = { a: 1, b: 'hello', c: null, d: true, e: undefined };
console.log(validateObject(testObj, ['a', 'b', 'f']));
// { valid: false, missing: ['f'], provided: ['a', 'b', 'c', 'd', 'e'] }

console.log(analyzeValues(testObj));
// { total: 5, types: ['number', 'string', 'object', 'boolean', 'undefined'], nullish: 2, truthy: 3 }
```

**记忆要点总结：**
- **Object.keys()**：返回属性名数组，用于属性检查和遍历
- **Object.values()**：返回属性值数组，用于值的处理和分析
- **Object.entries()**：返回[key, value]数组，用于对象转换和重构
- **使用场景**：keys用于属性操作，values用于值分析，entries用于对象转换



**041. [中级]** 如何冻结一个对象？

~~Object.frezz()~~ Object.freeze() 冻结对象，完全不可变
Object.seal() 密封对象，不能添加/删除属性
Object.preventExtensions() 防止添加新属性

## 深度分析与补充

**问题本质解读：** 这道题考察对象不可变性的控制方法，面试官想了解你是否掌握对象保护的不同级别。

**技术错误纠正：**
1. "Object.frezz()"拼写错误，应为"Object.freeze()"
2. 缺少其他对象保护方法的说明
3. 没有解释冻结的具体效果和限制

**知识点系统梳理：**

**对象保护的三个级别：**
1. **Object.preventExtensions()** - 防止添加新属性
2. **Object.seal()** - 密封对象，不能添加/删除属性
3. **Object.freeze()** - 冻结对象，完全不可变

**检测方法：**
- Object.isExtensible()
- Object.isSealed()
- Object.isFrozen()

**实战应用举例：**
```javascript
// 1. 三种保护级别的对比
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 1, b: 2 };
const obj3 = { a: 1, b: 2 };

// 防止扩展
Object.preventExtensions(obj1);
obj1.c = 3;        // 无效
obj1.a = 10;       // 有效
delete obj1.b;     // 有效
console.log(obj1); // { a: 10 }

// 密封对象
Object.seal(obj2);
obj2.c = 3;        // 无效
obj2.a = 10;       // 有效
delete obj2.b;     // 无效
console.log(obj2); // { a: 10, b: 2 }

// 冻结对象
Object.freeze(obj3);
obj3.c = 3;        // 无效
obj3.a = 10;       // 无效
delete obj3.b;     // 无效
console.log(obj3); // { a: 1, b: 2 }
```

```javascript
// 2. 深度冻结的实现
function deepFreeze(obj) {
  // 获取对象的所有属性名
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = obj[prop];

    // 如果属性值是对象，递归冻结
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  });

  return Object.freeze(obj);
}

// 使用示例
const nestedObj = {
  user: {
    name: 'John',
    address: {
      city: 'New York',
      country: 'USA'
    }
  },
  settings: {
    theme: 'dark'
  }
};

deepFreeze(nestedObj);
nestedObj.user.name = 'Jane';           // 无效
nestedObj.user.address.city = 'Boston'; // 无效
console.log(nestedObj.user.name);       // 'John'
```

**记忆要点总结：**
- **Object.freeze()**：完全冻结对象，不能修改、添加、删除属性
- **浅冻结**：只冻结第一层属性，嵌套对象仍可修改
- **深冻结**：需要递归冻结所有嵌套对象
- **检测方法**：Object.isFrozen()检查对象是否被冻结
- **使用场景**：配置对象、常量定义、防止意外修改



**042. [高级]** 解释JavaScript中的继承机制

~~构造函数会将自身的属性和方法继承给实现函数的实例调用~~
- 原型链继承 基于prototype的继承
- 构造函数继承 基于call/apply的继承
- 组合继承 原型链+构造函数
- ES6类继承 extends

## 深度分析与补充

**问题本质解读：** 这道题考察JavaScript继承的核心机制，面试官想了解你是否理解原型继承和现代继承方式。

**技术错误纠正：**
1. 原答案表述不准确，JavaScript使用原型继承，不是构造函数直接继承
2. "实现函数的实例调用"表述混乱，应该是"构造函数创建的实例"
3. 缺少现代ES6类继承的说明

**知识点系统梳理：**

**JavaScript继承的方式：**
1. **原型链继承** - 基于prototype的继承
2. **构造函数继承** - 使用call/apply
3. **组合继承** - 原型链+构造函数
4. **ES6类继承** - 现代语法糖

**继承的核心原理：**
- 通过原型链实现方法继承
- 通过构造函数实现属性继承

**实战应用举例：**
```javascript
// 1. 传统原型继承
function Animal(name) {
  this.name = name;
  this.energy = 100;
}

Animal.prototype.eat = function() {
  this.energy += 10;
  return `${this.name} is eating`;
};

Animal.prototype.sleep = function() {
  this.energy += 20;
  return `${this.name} is sleeping`;
};

function Dog(name, breed) {
  Animal.call(this, name); // 继承属性
  this.breed = breed;
}

// 继承方法
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} is barking`;
};

const dog = new Dog('Buddy', 'Golden Retriever');
console.log(dog.eat());   // "Buddy is eating"
console.log(dog.bark());  // "Buddy is barking"
```

```javascript
// 2. ES6类继承（推荐）
class ModernAnimal {
  constructor(name) {
    this.name = name;
    this.energy = 100;
  }

  eat() {
    this.energy += 10;
    return `${this.name} is eating`;
  }

  sleep() {
    this.energy += 20;
    return `${this.name} is sleeping`;
  }
}

class ModernDog extends ModernAnimal {
  constructor(name, breed) {
    super(name); // 调用父类构造函数
    this.breed = breed;
  }

  bark() {
    return `${this.name} is barking`;
  }

  // 方法重写
  eat() {
    const result = super.eat(); // 调用父类方法
    return `${result} (${this.breed} style)`;
  }
}

const modernDog = new ModernDog('Max', 'Labrador');
console.log(modernDog.eat());  // "Max is eating (Labrador style)"
console.log(modernDog.bark()); // "Max is barking"
```

**记忆要点总结：**
- **原型继承**：通过原型链共享方法，通过构造函数继承属性
- **ES6类继承**：使用extends和super关键字，语法更清晰
- **继承原理**：子类原型指向父类原型，实现方法共享
- **最佳实践**：优先使用ES6类语法，更易理解和维护



**043. [中级]** 构造函数和普通函数的区别

构造函数通常首个字母大写，可以使用new构造

- 调用方式不同
- this指向不同

## 深度分析与补充

**问题本质解读：** 这道题考察构造函数的特殊性，面试官想了解你是否理解构造函数的工作机制和与普通函数的区别。

**知识点系统梳理：**

**构造函数 vs 普通函数：**
1. **调用方式** - 构造函数用new调用，普通函数直接调用
2. **this指向** - 构造函数this指向新对象，普通函数this指向调用者
3. **返回值** - 构造函数默认返回新对象，普通函数返回undefined或指定值
4. **命名约定** - 构造函数首字母大写（约定）

**构造函数的特殊行为：**
- 自动创建新对象
- 设置原型链
- 绑定this到新对象
- 自动返回新对象（除非显式返回对象）

**实战应用举例：**
```javascript
// 1. 构造函数 vs 普通函数对比
function Person(name) {
  this.name = name;
  this.greet = function() {
    return `Hello, I'm ${this.name}`;
  };
}

// 作为构造函数调用
const person1 = new Person('John');
console.log(person1.name);    // 'John'
console.log(person1.greet()); // "Hello, I'm John"

// 作为普通函数调用
const result = Person('Jane');
console.log(result);          // undefined
console.log(window.name);     // 'Jane' (在浏览器中，this指向window)

// 检测是否用new调用
function SafePerson(name) {
  if (!(this instanceof SafePerson)) {
    return new SafePerson(name);
  }
  this.name = name;
}
```

```javascript
// 2. 构造函数的返回值行为
function TestConstructor() {
  this.prop = 'value';

  // 返回原始值 - 被忽略，返回this
  return 'ignored';
}

function ObjectConstructor() {
  this.prop = 'value';

  // 返回对象 - 覆盖默认返回值
  return { custom: 'object' };
}

const test1 = new TestConstructor();
console.log(test1); // { prop: 'value' }

const test2 = new ObjectConstructor();
console.log(test2); // { custom: 'object' }

// 现代检测方法（ES6+）
function ModernConstructor(name) {
  if (!new.target) {
    throw new Error('Must be called with new');
  }
  this.name = name;
}

// const invalid = ModernConstructor('test'); // Error
const valid = new ModernConstructor('test'); // 正常
```

**记忆要点总结：**
- **调用方式**：构造函数用new调用，创建新实例
- **this指向**：构造函数中this指向新创建的对象
- **返回值**：构造函数默认返回新对象，除非显式返回其他对象
- **检测方法**：使用instanceof或new.target检测调用方式
- **最佳实践**：使用ES6类语法替代构造函数，更清晰安全

  

**044. [中级]** `new`操作符的执行过程是什么？
> 创建对象 → 设置原型 → 执行构造函数 → 处理返回值

- 创建一个新对象
- 将新对象的原型设置为构造函数的原型
- 调用构造函数，将this绑定到新对象上
- 如果构造函数执行返回一个对象，则返回这个对象。~~否则放回这个新对象~~ 否则返回这个新对象

## 深度分析与补充

**问题本质解读：** 这道题考察new操作符的内部机制，面试官想了解你是否理解对象创建的完整过程。

**技术错误纠正：**
1. "否则放回这个新对象"应为"否则返回这个新对象"
2. 原答案基本正确，但缺少具体的实现细节

**知识点系统梳理：**

**new操作符的四个步骤：**
1. 创建一个新的空对象
2. 设置新对象的原型链（__proto__指向构造函数的prototype）
3. 执行构造函数，将this绑定到新对象
4. 根据构造函数返回值决定最终返回值

**返回值规则：**
- 如果构造函数返回对象，则返回该对象
- 如果返回原始值或无返回值，则返回新创建的对象

**实战应用举例：**
```javascript
// 1. 手动实现new操作符
function myNew(constructor, ...args) {
  // 步骤1: 创建新对象
  const newObj = {};

  // 步骤2: 设置原型链
  Object.setPrototypeOf(newObj, constructor.prototype);

  // 步骤3: 执行构造函数，绑定this
  const result = constructor.apply(newObj, args);

  // 步骤4: 根据返回值决定最终结果
  return (typeof result === 'object' && result !== null) ? result : newObj;
}

// 测试构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

// 使用自定义new
const person1 = myNew(Person, 'John', 25);
console.log(person1.name);    // 'John'
console.log(person1.greet()); // "Hello, I'm John"
console.log(person1 instanceof Person); // true
```

```javascript
// 2. 不同返回值的处理
function NormalConstructor(value) {
  this.value = value;
  // 无显式返回值，返回新对象
}

function ObjectConstructor(value) {
  this.value = value;
  return { custom: 'returned object' }; // 返回自定义对象
}

function PrimitiveConstructor(value) {
  this.value = value;
  return 'primitive'; // 返回原始值，被忽略
}

const normal = new NormalConstructor('test');
console.log(normal); // { value: 'test' }

const custom = new ObjectConstructor('test');
console.log(custom); // { custom: 'returned object' }

const primitive = new PrimitiveConstructor('test');
console.log(primitive); // { value: 'test' }

// 验证原型链
console.log(normal instanceof NormalConstructor);    // true
console.log(custom instanceof ObjectConstructor);    // false (返回了自定义对象)
console.log(primitive instanceof PrimitiveConstructor); // true
```

**记忆要点总结：**
- **四个步骤**：创建对象 → 设置原型 → 执行构造函数 → 处理返回值
- **原型设置**：新对象的__proto__指向构造函数的prototype
- **this绑定**：构造函数中的this指向新创建的对象
- **返回值规则**：对象类型返回值会覆盖默认返回值，原始值被忽略
- **实际应用**：理解new的机制有助于理解类、继承和原型链



**045. [高级]** 如何实现一个简单的`new`操作符？

```javascript
function MyNew(constructor,...args){
  if (typeof constructor !== 'function') {
    throw new TypeError('Constructor must be a function');
  }
  const newObject = {}
  Object.setPrototypeOf(newObject,constructor.prototype)
  let result = constructor.apply(newObject,args)
  return (typeof result === 'object' && result !== null) ? result : newObject
}
```

## 深度分析与补充

**问题本质解读：** 这道题考察对new操作符的深度理解，面试官想了解你是否能够手动实现JavaScript的核心机制。

**技术错误纠正：**
1. "constuctor"拼写错误，应为"constructor"
2. "Object.setProperty"方法不存在，应为"Object.setPrototypeOf"
3. 代码缺少必要的错误检查和边界处理

**知识点系统梳理：**

**new操作符实现的关键点：**
1. 参数验证（确保第一个参数是函数）
2. 创建新对象并设置原型链
3. 执行构造函数并绑定this
4. 处理返回值（对象 vs 原始值）

**实战应用举例：**
```javascript
// 1. 完整的new操作符实现
function myNew(constructor, ...args) {
  // 参数验证
  if (typeof constructor !== 'function') {
    throw new TypeError('Constructor must be a function');
  }

  // 创建新对象
  const newObj = {};

  // 设置原型链
  Object.setPrototypeOf(newObj, constructor.prototype);

  // 执行构造函数，绑定this
  const result = constructor.apply(newObj, args);

  // 处理返回值
  return (typeof result === 'object' && result !== null) ? result : newObj;
}

// 测试用例
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}, ${this.age} years old`;
};

const person = myNew(Person, 'Alice', 30);
console.log(person.greet()); // "Hello, I'm Alice, 30 years old"
console.log(person instanceof Person); // true
```

```javascript
// 2. 更优雅的实现（使用Object.create）
function betterNew(constructor, ...args) {
  if (typeof constructor !== 'function') {
    throw new TypeError('Constructor must be a function');
  }

  // 使用Object.create直接创建具有正确原型的对象
  const newObj = Object.create(constructor.prototype);

  // 执行构造函数
  const result = constructor.apply(newObj, args);

  // 返回结果
  return (typeof result === 'object' && result !== null) ? result : newObj;
}

// 边界情况测试
function TestConstructor() {
  this.value = 'test';
  return null; // 返回null，应该返回新对象
}

function ObjectConstructor() {
  this.value = 'test';
  return { custom: 'object' }; // 返回对象，应该返回这个对象
}

const test1 = betterNew(TestConstructor);
console.log(test1); // { value: 'test' }

const test2 = betterNew(ObjectConstructor);
console.log(test2); // { custom: 'object' }
```

**记忆要点总结：**
- **核心步骤**：验证参数 → 创建对象 → 设置原型 → 执行构造函数 → 处理返回值
- **原型设置**：使用Object.setPrototypeOf或Object.create
- **返回值处理**：对象类型（非null）返回该对象，否则返回新对象
- **错误处理**：验证构造函数参数，确保代码健壮性
- **实际价值**：深入理解JavaScript对象创建机制，有助于理解框架源码

