# 006. [中级]** 什么是类型转换？隐式转换和显式转换有什么区别？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这道题考察JavaScript类型系统的核心机制，面试官想了解你是否理解类型转换的内部算法和实际应用。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：数据类型与变量（15道），核心是 ToPrimitive/ToNumber/ToString/ToBoolean 四大抽象操作、valueOf 与 toString 的调用优先级、显式转换（Number/String/Boolean）与隐式转换（+/==/if）的触发条件，以及常见转换陷阱。

## 技术错误纠正

1. "toValue()"方法不存在，应该是"valueOf()"
2. 缺少ToPrimitive、ToNumber、ToString等核心转换算法的说明
3. "使用包装对象将其强制转化"表述不准确

## 知识点系统梳理

是指不同类型的值在计算或者比较时需要统一到同一个数据类型的做法

显式转化：~~使用包装对象将其强制转化为对应类型~~

隐式转化：在进行计算或者比较操作时，调用包装对象的内部包含 toString()和~~toValue()~~ valueOf() 方法，自动将其转化为对应的类型


**类型转换的分类：**
- **显式转换**：程序员主动调用转换函数
- **隐式转换**：JavaScript引擎自动进行的转换

**核心转换算法（ECMAScript规范定义的抽象操作）：**

**1. ToPrimitive(input, preferredType) — 对象转原始值：**
- 如果 `preferredType` 是 `"number"`：先调 `valueOf()`，返回原始值就用；否则调 `toString()`
- 如果 `preferredType` 是 `"string"`：先调 `toString()`，返回原始值就用；否则调 `valueOf()`
- 如果都不返回原始值，抛出 `TypeError`
- ES6+可通过 `Symbol.toPrimitive` 自定义转换行为

```javascript
// 自定义ToPrimitive
const price = {
  amount: 99,
  currency: '¥',
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount
    if (hint === 'string') return `${this.currency}${this.amount}`
    return this.amount // default
  }
}

+price           // 99 (hint: 'number')
`${price}`       // '¥99' (hint: 'string')
price + ''       // '99' (hint: 'default')
```

**2. ToNumber — 转换为数字：**

| 输入值 | 结果 | 说明 |
|--------|------|------|
| `undefined` | `NaN` | 常见bug来源 |
| `null` | `0` | 注意和undefined不同 |
| `true` / `false` | `1` / `0` | |
| `''`（空字符串） | `0` | |
| `'123'` | `123` | 有效数字字符串 |
| `'123abc'` | `NaN` | 包含非数字字符 |
| `' \t\n '` | `0` | 纯空白字符串转为0 |
| 对象 | 先ToPrimitive再ToNumber | |

```javascript
Number(undefined)  // NaN
Number(null)       // 0
Number('')         // 0
Number(' ')        // 0
Number('0x1A')     // 26 (支持十六进制)
Number('0b11')     // 3 (支持二进制)
Number('0o17')     // 15 (支持八进制)
```

**3. ToString — 转换为字符串：**

| 输入值 | 结果 |
|--------|------|
| `undefined` | `'undefined'` |
| `null` | `'null'` |
| `true` / `false` | `'true'` / `'false'` |
| 数字 | 对应字符串（`NaN`→`'NaN'`，`Infinity`→`'Infinity'`） |
| 对象 | 先ToPrimitive(hint:'string')再ToString |

```javascript
String([1, 2, 3])    // '1,2,3' — 数组的toString用逗号连接
String({})           // '[object Object]' — 默认toString
String(null)         // 'null'
String(undefined)    // 'undefined'
```

**4. ToBoolean — 转换为布尔值：**

只有以下值转为 `false`（称为falsy值），其余全部为 `true`：
`false`、`0`、`-0`、`0n`、`''`、`null`、`undefined`、`NaN`

```javascript
Boolean([])   // true ← 空数组是truthy！
Boolean({})   // true ← 空对象是truthy！
Boolean('0')  // true ← 非空字符串是truthy！
Boolean(0)    // false
```

**显式转换方法速查表：**

| 目标类型 | 推荐方法 | 替代方法 | 不推荐 |
|---------|---------|---------|--------|
| 转Number | `Number(val)` | `parseInt(val, 10)`、`parseFloat(val)` | `+val`（可读性差） |
| 转String | `String(val)` | `val.toString()`（null/undefined会报错） | `val + ''` |
| 转Boolean | `Boolean(val)` | | `!!val`（不够直观） |

### 实战应用举例
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

### 记忆要点总结
- **显式转换**：Number()、String()、Boolean()、parseInt()、parseFloat()
- **隐式转换**：通过ToPrimitive、ToNumber、ToString算法
- **转换优先级**：valueOf() vs toString()取决于上下文
- **最佳实践**：优先使用显式转换，避免隐式转换的意外结果

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

**前端常见的类型转换场景：**

| 场景 | 转换类型 | 推荐方式 | 避免方式 |
|------|---------|---------|---------|
| 表单输入转数字 | 显式 | `Number(input.value)` 或 `parseInt(val, 10)` | `+val`（可读性差） |
| API数据解析 | 显式 | `String(data.id)`、`Boolean(data.active)` | 依赖隐式转换 |
| 模板渲染 | 隐式 | 框架自动调toString | 注意null/undefined显示 |
| 条件判断 | 隐式 | `if (list.length)` | `if (list.length == true)` |
| 数值拼接 | 隐式（需小心） | `'价格: ' + String(price)` | `'价格: ' + price`（不明确） |

**业务场景：**

```javascript
// 场景1：表单输入始终是字符串，需要显式转换
const age = Number(document.getElementById('age').value)
if (Number.isNaN(age)) {
  showError('请输入有效年龄')
}

// 场景2：URL参数解析（都是字符串）
const page = parseInt(searchParams.get('page'), 10) || 1
const showAll = searchParams.get('all') === 'true' // 不要用Boolean()

// 场景3：避免隐式转换造成的bug
const price = '19.9'
const total = price * quantity  // ✅ 隐式转number，碰巧能工作
const display = price + '元'    // ✅ 字符串拼接
const wrong = price + tax       // ❌ 如果tax是数字，会变成字符串拼接！

// 场景4：显式优于隐式
// ❌ 隐式转换 — 意图不明确
if (!!value) { }
const num = +str
const str = '' + num

// ✅ 显式转换 — 清晰可读
if (Boolean(value)) { }
const num = Number(str)
const str = String(num)
```

## 易错点提示

**1. `+` 操作符的字符串 vs 数字歧义：**
```javascript
1 + '2'     // '12' ← 有字符串就拼接
1 + 2       // 3
'3' - 1     // 2  ← 减法只能数值运算，字符串转number
'3' * '2'   // 6  ← 乘法同理
'3' + '2'   // '32' ← 加法优先拼接
```

**2. `[] + []` 和 `{} + []` 的怪异结果：**
```javascript
[] + []     // '' ← 两个数组ToPrimitive都变成''
[] + {}     // '[object Object]'
{} + []     // 0  ← 浏览器控制台中{}被解析为空代码块，变成 +[]
({}) + []   // '[object Object]' ← 加括号后正确
```

**3. null转为0，undefined转为NaN：**
```javascript
Number(null)      // 0
Number(undefined) // NaN
null + 1          // 1
undefined + 1     // NaN
// 容易在计算中埋下bug
```

**4. `||` 和 `??` 对falsy值的行为不同：**
```javascript
0 || 10     // 10 ← 0是falsy，被跳过
0 ?? 10     // 0  ← ??只跳过null和undefined
'' || '默认' // '默认' ← 空字符串是falsy
'' ?? '默认' // ''     ← 空字符串不是nullish
```

**5. 一元 `+` 操作符做隐式数值转换：**
```javascript
+'42'       // 42
+true       // 1
+false      // 0
+null       // 0
+undefined  // NaN
+''         // 0
+'abc'      // NaN
+[]         // 0 ← [].toString() → '' → 0
```

## 记忆要点总结

- **显式转换**：`Number()`、`String()`、`Boolean()`、`parseInt()`、`parseFloat()` — 意图明确
- **隐式转换**：运算符（`+`、`-`、`==`）、条件判断（`if`、`&&`、`||`）自动触发
- **ToPrimitive**：对象转原始值时先调 `valueOf()`，再调 `toString()`（hint为string时反过来）
- **最大陷阱**：`+` 操作符有字符串就拼接，`-` `*` `/` 只做数值运算
- **实战原则**：优先使用显式转换，代码意图更清晰，减少隐式转换bug

## 延伸问题

JavaScript中的 `==` 比较时，两个不同类型的值是按什么规则进行转换的？能否画出完整的转换流程？

## 可能类似的问题及简要参考答案

**Q：`Number()` 和 `parseInt()` 有什么区别？**
A：`Number('123abc')` 返回 `NaN`（要求整个字符串是合法数字），`parseInt('123abc')` 返回 `123`（从左到右解析到非数字字符停止）。`parseInt` 还需要传第二个参数指定进制（如 `parseInt('0x1A', 16)`）。

**Q：如何让 `if (a == 1 && a == 2 && a == 3)` 为true？**
A：自定义对象的 `valueOf` 方法，每次 `==` 比较时返回递增的值：`const a = { n: 1, valueOf() { return this.n++ } }`。这道题考察的是 `==` 会触发ToPrimitive转换。

## 辅助记忆总结

类型转换分显式（Number/String/Boolean）和隐式（运算符/条件判断自动触发），核心是ToPrimitive/ToNumber/ToString三个抽象操作，`+` 遇字符串拼接是最常见的坑。
