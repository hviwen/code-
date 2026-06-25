# 002. [初级]** `typeof null` 返回什么值？为什么？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这道题考察JavaScript中一个著名的历史bug，面试官想了解你是否知道这个特殊情况以及如何正确检测null值。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：数据类型与变量（15道），核心是 typeof 的返回值表、null 的类型标签历史、精确类型检测方法（=== / toString / instanceof），以及实际项目中的 null 安全处理。

## 技术错误纠正

1. "javaScript"应为"JavaScript"
2. 解释过于简单，缺少技术细节和解决方案

## 知识点系统梳理

object; javaScript 创建之初把null归到了object中，是历史遗留问题


**typeof null返回'object'的原因：**
- 这是JavaScript语言设计初期的一个bug
- 在JavaScript的最初实现中，值是由类型标签和值组成的
- null的类型标签是0，而对象的类型标签也是0
- 因此typeof null被错误地识别为'object'

**历史背景：**
- 这个bug存在于JavaScript 1.0中
- 虽然后来被发现，但为了向后兼容性，一直保留至今
- 这被认为是JavaScript语言中最著名的bug之一

### 实战应用举例
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

### 记忆要点总结
- **typeof null返回'object'**：这是JavaScript的历史bug
- **正确检测null**：使用 `value === null`
- **精确类型检测**：使用 `Object.prototype.toString.call()`
- **现代解决方案**：可选链(?.)和空值合并(??)操作符
- **最佳实践**：明确区分null、undefined和其他falsy值

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

**null检测方案对比：**

| 方法 | 能否正确检测null | 适用场景 | 注意事项 |
|------|----------------|---------|---------|
| `=== null` | ✅ | 精确判断null | 最简洁直接的方式 |
| `== null` | 检测null和undefined | 同时排除null和undefined | ESLint的eqeqeq规则会警告 |
| `typeof x === 'object'` | ❌ 无法区分null和对象 | 不要用来判断null | 这是typeof null的坑 |
| `Object.prototype.toString.call()` | ✅ 返回`[object Null]` | 通用类型检测函数 | 写法较长 |
| `x?.prop` 可选链 | 自动跳过null | 安全访问可能为null的属性 | ES2020+，旧浏览器需编译 |

**业务场景：**

```javascript
// 场景1：表单验证 — 区分"未填写"和"清空"
function validateField(value) {
  if (value === undefined) return '请填写此项'     // 从未输入
  if (value === null) return '请重新选择'          // 主动清空了选择
  if (value === '') return '内容不能为空'          // 输入后又删除
  return null // 验证通过
}

// 场景2：API返回null vs 字段不存在
const user = await fetchUser(id)
// user.avatar === null    → 用户主动删除了头像，显示默认头像
// user.avatar === undefined → API未返回此字段，可能是旧版接口

// 场景3：可选链替代手动null检查
// ❌ 旧写法
const street = user && user.address && user.address.street
// ✅ 可选链
const street = user?.address?.street
```

## 易错点提示

**1. typeof null返回'object'会破坏类型守卫：**
```javascript
// ❌ 错误的对象判断
function isObject(val) {
  return typeof val === 'object' // null也会进来！
}
// ✅ 正确写法
function isObject(val) {
  return val !== null && typeof val === 'object'
}
```

**2. `null == undefined` 为true，但 `null === undefined` 为false：**
```javascript
null == undefined   // true  — 抽象相等的特殊规则
null === undefined  // false — 类型不同
null == 0           // false — null只和undefined宽松相等
null == ''          // false
```

**3. JSON序列化中null和undefined行为不同：**
```javascript
JSON.stringify({ a: null, b: undefined })
// '{"a":null}' — undefined属性被丢弃，null被保留

JSON.parse('{"a":null}').a  // null
// 从后端拿到的JSON永远不会有undefined，只有null
```

**4. `document.getElementById` 找不到元素返回null，不是undefined：**
```javascript
const el = document.getElementById('not-exist')
el        // null
typeof el // 'object' ← 又是typeof null的坑
el === null // true ← 用这个判断
```

## 记忆要点总结

- **结论**：`typeof null` 返回 `'object'`，这是JS初版的类型标签bug
- **原因**：null的内部类型标签为0，与对象相同
- **检测null**：始终用 `value === null`，不要用typeof
- **实际影响**：写类型守卫时必须先排除null再判断typeof === 'object'
- **JSON中**：null会被保留，undefined会被丢弃

## 延伸问题

`typeof` 操作符能区分哪些类型？对于它无法区分的类型（如null、数组、日期），有哪些更精确的检测方法？

## 可能类似的问题及简要参考答案

**Q：如何准确判断一个值是对象而不是null？**
A：使用 `value !== null && typeof value === 'object'`。不能单独用 `typeof`，因为 `typeof null` 也返回 `'object'`。更严谨的方式可用 `Object.prototype.toString.call(value)` 获得精确类型字符串。

**Q：为什么不修复typeof null这个bug？**
A：TC39曾提议修复（typeof null 返回 'null'），但因为互联网上大量现有代码依赖这个行为做判断，修复会造成大规模兼容性问题，提案被否决。

## 辅助记忆总结

`typeof null === 'object'` 是JS初版类型标签bug（null标签为0与对象相同），检测null永远用 `=== null`。
