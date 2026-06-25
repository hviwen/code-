# 150. [中级]** BigInt数据类型的特点和用法

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察BigInt的使用场景，面试官想了解你是否理解JavaScript数值精度限制和大整数处理。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

- 用于表示number不能表示的数字 进行计算操作
- 数字后面跟一个n

### 问题本质解读 这道题考察BigInt的使用场景，面试官想了解你是否理解JavaScript数值精度限制和大整数处理。

### 知识点系统梳理

**BigInt的特点：**

1. **任意精度**：可以表示任意大的整数
2. **类型安全**：不能与Number直接运算
3. **性能考虑**：比Number运算慢
4. **JSON序列化**：需要特殊处理

### 实战应用举例

**通用JavaScript示例：**

```javascript
// 1. 基础用法
const bigInt1 = 123456789012345678901234567890n
const bigInt2 = BigInt('987654321098765432109876543210')
const bigInt3 = BigInt(123) // 从Number转换

console.log(bigInt1) // 123456789012345678901234567890n
console.log(typeof bigInt1) // 'bigint'

// 2. Number精度限制演示
console.log(Number.MAX_SAFE_INTEGER) // 9007199254740991
console.log(Number.MAX_SAFE_INTEGER + 1) // 9007199254740992
console.log(Number.MAX_SAFE_INTEGER + 2) // 9007199254740992 (精度丢失!)

// 使用BigInt避免精度问题
const safeBigInt = BigInt(Number.MAX_SAFE_INTEGER) + 2n
console.log(safeBigInt) // 9007199254740993n

// 3. BigInt运算
const a = 123n
const b = 456n

console.log(a + b) // 579n
console.log(a * b) // 56088n
console.log(b / a) // 3n (整数除法)
console.log(b % a) // 87n

// 4. 类型转换和比较
// BigInt与Number不能直接运算
// console.log(123n + 456); // TypeError!

// 正确的方式
console.log(123n + BigInt(456)) // 579n
console.log(Number(123n) + 456) // 579

// 比较操作
console.log(123n === 123) // false (类型不同)
console.log(123n == 123) // true (值相等)
console.log(123n > 100) // true

// 5. 实际应用场景
// 加密货币计算
class CryptoCurrency {
  constructor(amount) {
    this.amount = BigInt(amount)
  }

  add(other) {
    return new CryptoCurrency(this.amount + other.amount)
  }

  multiply(factor) {
    return new CryptoCurrency(this.amount * BigInt(factor))
  }

  toString() {
    return this.amount.toString()
  }

  toNumber() {
    if (this.amount > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new Error('Value too large for Number type')
    }
    return Number(this.amount)
  }
}

// 时间戳处理
const timestamp = BigInt(Date.now()) * 1000000n // 纳秒级时间戳
console.log(timestamp)

// 6. JSON序列化处理
const data = {
  id: 123456789012345678901234567890n,
  value: 999999999999999999999n,
}

// 自定义序列化
JSON.stringify(data, (key, value) => {
  return typeof value === 'bigint' ? value.toString() + 'n' : value
})

// 自定义反序列化
function reviver(key, value) {
  if (typeof value === 'string' && value.endsWith('n')) {
    return BigInt(value.slice(0, -1))
  }
  return value
}
```

**BigInt 特性总结表：**

| 特性 | 说明 | 注意事项 |
| --- | --- | --- |
| 任意精度整数 | 可表示超过 `Number.MAX_SAFE_INTEGER` 的整数 | 只适合整数 |
| 字面量后缀 | `123n` | 不能写小数 |
| 构造函数 | `BigInt('123')` | 传非法字符串会抛错 |
| 类型隔离 | `typeof 1n === 'bigint'` | 不能和 Number 混合运算 |

### 记忆要点总结

- BigInt 用于安全表示和计算大整数。
- BigInt 不能与 Number 直接混合运算。
- BigInt 不支持小数。
- JSON 默认不能序列化 BigInt，需要转字符串。

---

## 实战应用举例

后端雪花 ID 超过安全整数范围时，前端如果只展示，最好保持字符串；如果确实要做整数计算，再转 BigInt。

```javascript
const idFromApi = '9223372036854775807'
const id = BigInt(idFromApi)
console.log(id + 1n) // 9223372036854775808n
```

## 使用场景说明和对比

| 方案 | 适合场景 | 注意点 |
| --- | --- | --- |
| `number` | 普通计数、浮点计算 | 超过安全整数会丢精度 |
| `bigint` | 大整数运算、位运算、大 ID 计算 | 不能混用 Number |
| `string` | 大 ID 展示、透传 | 不能直接做数学运算 |
| decimal 库 | 金额、高精度小数 | BigInt 不处理小数 |

## 易错点提示

1. `1n + 1` 会抛 TypeError。
2. BigInt 只能表示整数，不能表示小数。
3. `JSON.stringify({ id: 1n })` 默认会报错。
4. 大 ID 如果不参与计算，用字符串通常更稳。
5. BigInt 和 Number 比较时要注意精度和类型转换。

## 记忆要点总结

- BigInt 解决大整数安全问题。
- 字面量用 `n` 后缀。
- 不和 Number 混合运算。
- 展示型大 ID 优先字符串。

## 延伸问题

可以继续追问：150. [中级]** BigInt数据类型的特点和用法 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：BigInt 能解决金额小数精度问题吗？**  
A：不能直接解决小数。金额通常转成最小整数单位，或使用 decimal 高精度库。

**Q：为什么后端大 ID 前端常用字符串？**  
A：因为展示和透传不需要数学运算，字符串能避免 Number 精度丢失和 BigInt 序列化问题。

## 辅助记忆总结

一句话记：BigInt 管大整数，不管小数；要算转 BigInt，只展示用字符串。
