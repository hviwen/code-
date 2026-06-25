# 001. [初级]** 请解释JavaScript中的原始数据类型有哪些？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这道题考察JavaScript基础类型系统的理解，面试官想了解你是否掌握ES6+新增的原始类型以及各类型的特点和使用场景。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：数据类型与变量（15道），包括 7 种原始类型的值语义、栈存储、typeof 返回规则、自动装箱机制，以及与引用类型的区别。

## 技术错误纠正

1. 格式不规范，应该用标准的类型名称
2. 缺少ES2020新增的原始类型说明
3. 没有说明各类型的特点和用途

## 知识点系统梳理

string number boolean null undefined Symbol bigint


JavaScript共有7种原始数据类型（Primitive Types）：

1. **string** - 字符串类型
2. **number** - 数值类型（包括整数和浮点数）
3. **boolean** - 布尔类型
4. **null** - 空值类型
5. **undefined** - 未定义类型
6. **symbol** - 符号类型（ES6新增）
7. **bigint** - 大整数类型（ES2020新增）

### 实战应用举例
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

### 记忆要点总结
- **7种原始类型**：string, number, boolean, null, undefined, symbol, bigint
- **存储特点**：按值存储，不可变，栈内存
- **ES6+新增**：symbol（ES6）、bigint（ES2020）
- **类型检测**：typeof操作符（注意null返回'object'）
- **自动装箱**：原始类型可以调用对应包装对象的方法

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

**前端业务场景中各原始类型的使用对比：**

| 类型 | 典型前端场景 | 示例 | 何时避免 |
|------|------------|------|---------|
| string | 用户输入、路由参数、DOM文本 | `input.value`、`route.params.id` | 需要数值计算时先转为number |
| number | 计算、索引、倒计时、分页 | `page * pageSize`、`setTimeout(fn, 1000)` | 超过 `2^53 - 1` 的后端ID |
| boolean | 条件渲染、开关状态、权限标记 | `v-if="isLogin"`、`disabled={loading}` | 不要用 0/1 代替布尔值 |
| null | 主动清空引用、重置状态 | `selectedUser = null`、API返回"无数据" | 不要用来表示"未初始化" |
| undefined | 可选参数、未赋值变量 | `props.onChange`未传时为undefined | 不要主动赋值 `x = undefined` |
| symbol | 组件内部私有属性键、枚举常量 | `const LOADING = Symbol('loading')` | 需要JSON序列化的场景 |
| bigint | 后端雪花算法ID、金融精确计算 | `BigInt(response.orderId)` | 不能与number混合运算 |

**Symbol vs 字符串枚举：**
```javascript
// 字符串枚举：可读但可能与第三方库冲突
const STATUS = { LOADING: 'loading', ERROR: 'error' }

// Symbol枚举：绝对唯一，无冲突风险
const STATUS = { LOADING: Symbol('loading'), ERROR: Symbol('error') }
```

**BigInt vs Number处理后端大ID：**
```javascript
// ❌ 后端返回超大ID（雪花算法），Number精度丢失
const orderId = 1234567890123456789  // 变成 1234567890123456800

// ✅ 用BigInt或保持字符串
const orderId = BigInt('1234567890123456789')
const orderId = '1234567890123456789' // 仅展示不计算时用字符串更简单
```

## 易错点提示

**1. `typeof null === 'object'` 是历史bug，不是null属于对象类型：**
```javascript
typeof null     // 'object' ← 不代表null是对象
null instanceof Object // false
```

**2. BigInt不能与Number混合运算：**
```javascript
1n + 1    // ❌ TypeError: Cannot mix BigInt and other types
1n + BigInt(1) // ✅ 2n
Number(1n) + 1 // ✅ 2，但可能丢失精度
```

**3. `Symbol()` 即使描述相同也不相等：**
```javascript
Symbol('id') === Symbol('id') // false，每次调用都创建新的唯一值
Symbol.for('id') === Symbol.for('id') // true，全局注册表共享
```

**4. NaN是number类型，但不等于自身：**
```javascript
typeof NaN        // 'number' ← NaN属于number类型
NaN === NaN       // false
Number.isNaN(NaN) // true ← 用这个检测
isNaN('abc')      // true ← 全局isNaN会先转number，不推荐
```

**5. 原始类型调用方法时的自动装箱（auto-boxing）：**
```javascript
const str = 'hello'
str.toUpperCase() // JS临时创建new String(str)，调用后销毁

// 但原始类型不能添加属性
str.custom = 1
console.log(str.custom) // undefined，临时包装对象已销毁
```

## 记忆要点总结

- **7种原始类型**：string、number、boolean、null、undefined、symbol（ES6）、bigint（ES2020）
- **核心特点**：按值存储、不可变、栈内存分配
- **typeof陷阱**：`typeof null === 'object'` 是历史bug，用 `=== null` 检测
- **新类型注意**：symbol保证唯一性，bigint不能与number混合运算
- **自动装箱**：原始类型调用方法时临时创建包装对象，调用后销毁

## 延伸问题

原始类型和引用类型在内存中的存储方式有什么区别？这如何影响赋值、比较和函数传参的行为？

## 可能类似的问题及简要参考答案

**Q：JavaScript中原始类型和引用类型有什么区别？**
A：原始类型（7种）按值存储在栈内存，不可变；引用类型（Object及其子类）按引用存储在堆内存，变量保存的是指针。赋值原始类型是值拷贝，赋值引用类型是引用拷贝。

**Q：如何判断一个值的具体类型？**
A：`typeof` 可判断大部分原始类型（注意null返回'object'），`Object.prototype.toString.call()` 能精确区分所有类型包括Array、Date、RegExp等。

## 辅助记忆总结

JS有7种原始类型（string/number/boolean/null/undefined/symbol/bigint），按值存储不可变，typeof能检测除null外的所有原始类型。
