# 070. [中级]** 如何解构赋值并重命名变量？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

解构重命名的核心是冒号语法 `{ oldKey: newVar } = obj`——冒号左边是源对象的属性名，冒号右边是你要绑定的新变量名。它和对象字面量的方向刚好相反：字面量里 `{ key: value }` 是"变量赋给属性"，解构里 `{ key: variable }` 是"属性赋给变量"。

一句话答法：`const { oldName: newName } = obj` 把 `obj.oldName` 的值绑定到变量 `newName`，`oldName` 本身不会被声明为变量。

## 问题意图

这道题主要考察三件事：

1. 是否理解冒号在解构中的含义——它不是赋值，而是"取这个属性，起个别名"。
2. 是否能处理重命名与默认值、嵌套解构、剩余模式的组合。
3. 是否意识到解构重命名的方向和对象字面量相反，不会混淆。

## 考察范围

- 基本重命名语法 `{ a: b } = obj`。
- 重命名 + 默认值组合 `{ a: b = 默认值 } = obj`。
- 嵌套对象中的重命名 `{ outer: { inner: renamed } } = obj`。
- 重命名与剩余模式配合 `{ a: renamed, ...rest } = obj`。
- 对象字面量 vs 解构重命名的方向差异（最常见混淆点）。
- 数组解构不支持重命名（只能按位置，用普通变量名即可）。

## 技术错误纠正

- 原始材料里的 `： 冒号` 应为 `: 冒号`（全角误用）。
- 数组解构"不支持重命名"这一说法不够精确：数组解构按位置绑定变量名，本身就是自由命名，没有"重命名"的概念。

## 知识点系统梳理

### 基本语法

```js
const user = { name: 'Alice', age: 30 }

// 冒号左边 = 源属性，冒号右边 = 新变量名
const { name: userName, age: userAge } = user

console.log(userName) // 'Alice'
console.log(userAge)  // 30
// console.log(name)  // ReferenceError — name 没有被声明
```

### 重命名 + 默认值

默认值写在新变量名后面：

```js
const config = { timeout: 3000 }

const { timeout: ms = 5000, retries: maxRetries = 3 } = config

console.log(ms)         // 3000（属性存在，用实际值）
console.log(maxRetries) // 3（属性不存在，用默认值）
```

### 嵌套重命名

```js
const response = {
  data: { user: { first_name: 'Bob' } }
}

const { data: { user: { first_name: firstName } } } = response

console.log(firstName) // 'Bob'
// data、user 都不会被声明为变量，只有 firstName 被声明
```

### 重命名 + 剩余模式

```js
const obj = { a: 1, b: 2, c: 3, d: 4 }

const { a: first, ...rest } = obj

console.log(first) // 1
console.log(rest)  // { b: 2, c: 3, d: 4 }
```

### 方向对比：对象字面量 vs 解构重命名

| 语法 | 冒号左边 | 冒号右边 | 数据流向 |
| --- | --- | --- | --- |
| 对象字面量 `{ key: value }` | 属性名 | 值（来源） | 值 → 属性 |
| 解构重命名 `{ key: variable } = obj` | 属性名（来源） | 目标变量 | 属性 → 变量 |

记法：解构时冒号左边永远是"从哪取"，右边永远是"放到哪"。

## 实战应用举例

### 示例 1：API 响应字段转驼峰

后端返回 snake_case，前端用 camelCase。解构重命名一步完成转换，不需要中间变量。

```js
function normalizeUser(apiData) {
  const {
    user_id: id,
    user_name: name,
    is_active: active = false,
    created_at: createdAt,
  } = apiData

  return { id, name, active, createdAt }
}

// 输入
normalizeUser({ user_id: 42, user_name: 'Eve', created_at: '2024-01-01' })
// 输出: { id: 42, name: 'Eve', active: false, createdAt: '2024-01-01' }
```

边界说明：

- `is_active` 不存在时走默认值 `false`，不会是 `undefined`。
- 如果字段多到 10+ 个，考虑用通用的 `snakeToCamel` 映射函数代替逐个解构。

### 示例 2：避免同作用域变量名冲突

```js
const userA = { name: 'Alice', score: 90 }
const userB = { name: 'Bob', score: 85 }

const { name: nameA, score: scoreA } = userA
const { name: nameB, score: scoreB } = userB

console.log(`${nameA}: ${scoreA}, ${nameB}: ${scoreB}`)
// 'Alice: 90, Bob: 85'
```

如果不重命名，第二次 `const { name }` 会报重复声明错误。

## 使用场景说明和对比

| 场景 | 是否适合重命名 | 原因 |
| --- | --- | --- |
| 后端 snake_case 转前端 camelCase | 适合 | 一步完成命名规范适配 |
| 同作用域解构多个同结构对象 | 适合 | 避免变量名冲突 |
| 简化深层嵌套属性名 | 适合 | `response.data.user.name` → `userName` |
| 属性名本身已经语义清晰 | 不需要 | 直接 `{ id, name }` 更简洁 |
| 需要批量转换几十个字段 | 不太适合 | 手动逐个重命名维护成本高，用映射函数更好 |
| 数组解构 | 不适用 | 数组按位置取值，变量名天然自由 |

## 易错点提示

- **方向搞反**：写成 `{ newName: oldKey } = obj` 会取 `obj.newName` 而非 `obj.oldKey`。
- **以为 oldKey 也被声明了**：`const { a: b } = obj` 只声明 `b`，`a` 不可用。
- **默认值位置写错**：`{ a: b = 1 }` 正确；`{ a = 1: b }` 语法错误。
- **嵌套中间层变成了变量**：`{ data: { id } } = obj` 不会声明 `data`；如果同时需要 `data` 和 `id`，要单独解构。
- **函数参数解构重命名忘记外层花括号**：`function f({ a: b }) {}` 正确，`function f(a: b) {}` 是 TypeScript 类型注解而非解构。
- **`let`/`var` 已声明同名变量后再解构重命名不会报错但容易覆盖**：注意作用域。

## 记忆要点总结

- `{ oldKey: newVar } = obj`：冒号左边取值，右边绑定变量。
- 重命名后 `oldKey` 不会被声明，只有 `newVar` 可用。
- 默认值跟在新变量名后面：`{ a: b = 默认值 }`。
- 嵌套路径上的中间层名字也不会被声明为变量。
- 方向和对象字面量相反——这是最常见的混淆来源。

## 延伸问题

1. 解构重命名和 TypeScript 类型注解 `{ a: Type }` 在语法上如何区分？
2. 在函数参数中同时使用解构重命名和默认参数时，求值顺序是什么？
3. 嵌套解构重命名中，如果中间层是 `null` 或 `undefined` 会怎样？
4. `import { foo as bar }` 和解构重命名 `{ foo: bar }` 在语义上有什么异同？
5. 解构重命名在 `for...of` 循环中如何使用？

## 可能类似的问题及简要参考答案

**Q：如何在解构时给变量设置默认值？**
A：`const { a = 1, b = 'default' } = obj`。属性值为 `undefined` 时使用默认值，`null` 不触发默认值。

**Q：解构赋值可以用于已声明的变量吗？**
A：可以，但对象解构需要加括号避免被解析为块语句：`let a; ({ a } = obj)`。

**Q：`import { x as y }` 是解构吗？**
A：不是。语法相似但机制不同——`import` 是模块绑定声明，不是对运行时对象的解构赋值。

## 辅助记忆总结

记成一句话：解构冒号"左取右放"——左边是属性来源，右边是变量归宿，和对象字面量方向相反。
