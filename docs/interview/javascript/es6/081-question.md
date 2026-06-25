# 081. [中级]** 扩展运算符在对象中的应用

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

对象扩展运算符 `...` 用于将一个对象的所有可枚举自有属性展开到另一个对象字面量中。它的本质是 `Object.assign()` 的语法糖，核心用途是对象合并、浅拷贝和不可变更新。

一句话答法：`{...obj}` 等价于 `Object.assign({}, obj)`，只做浅拷贝、只拷贝可枚举自有属性，后展开的同名属性覆盖前面的。

## 问题意图

这道题考察三件事：

1. 是否理解扩展运算符只做浅拷贝，嵌套对象仍共享引用。
2. 是否知道属性覆盖规则：后面的属性覆盖前面的同名属性。
3. 是否能用它做不可变状态更新、配置合并等实战场景。

## 考察范围

- 对象扩展运算符的语法和等价写法（`Object.assign`）。
- 浅拷贝 vs 深拷贝的边界。
- 属性覆盖顺序。
- 条件属性添加（`...(condition && { key: value })`）。
- 解构剩余属性（`const { a, ...rest } = obj`）。
- 不可变状态更新模式（Redux/Pinia）。

## 技术错误纠正

- 扩展运算符不复制原型链上的属性，也不复制不可枚举属性（`Object.assign` 同理）。
- `{...null}` 和 `{...undefined}` 不会报错，结果是空对象。

## 知识点系统梳理

### 基本语法

```js
const a = { x: 1, y: 2 }
const b = { y: 3, z: 4 }

const merged = { ...a, ...b }
// { x: 1, y: 3, z: 4 }  —— b.y 覆盖 a.y
```

### 与 Object.assign 的对比

| 对比项 | `{...obj}` | `Object.assign(target, src)` |
| --- | --- | --- |
| 返回值 | 新对象 | 修改并返回 target |
| 是否改变目标对象 | 否（总是创建新对象） | 是（直接修改 target） |
| setter 触发 | 否（字面量赋值） | 是（会触发 target 上的 setter） |
| 拷贝深度 | 浅拷贝 | 浅拷贝 |

### 属性覆盖规则

```js
const defaults = { timeout: 3000, retries: 3, verbose: false }
const userConfig = { timeout: 10000, verbose: true }

const config = { ...defaults, ...userConfig }
// { timeout: 10000, retries: 3, verbose: true }
// 结论：后展开的同名属性覆盖前面的
```

### 解构剩余属性

```js
const response = { status: 200, data: [1, 2, 3], headers: {}, config: {} }

const { status, data, ...meta } = response
// status → 200, data → [1, 2, 3]
// meta → { headers: {}, config: {} }
```

## 实战应用举例

### 示例 1：不可变状态更新

这个例子证明：扩展运算符可以在不修改原对象的情况下更新嵌套状态。

```js
const state = {
  user: { name: 'Alice', age: 25 },
  settings: { theme: 'light', lang: 'zh' },
}

// 更新嵌套属性——必须每层都展开
const newState = {
  ...state,
  settings: { ...state.settings, theme: 'dark' },
}

console.log(state.settings.theme)    // 'light'（原对象不变）
console.log(newState.settings.theme) // 'dark'
console.log(state.user === newState.user) // true（未修改的子对象保持引用）
```

边界说明：
- 只有被修改路径上的对象是新引用，其余子对象共享引用（这正是 React/Redux 依赖的优化点）。
- 嵌套超过两三层时，手动展开很痛苦，考虑用 `immer` 或 `structuredClone`。

### 示例 2：条件属性添加

```js
function buildQuery(filters) {
  return {
    page: 1,
    pageSize: 20,
    ...(filters.keyword && { keyword: filters.keyword }),
    ...(filters.status != null && { status: filters.status }),
    ...(filters.dateRange && {
      startDate: filters.dateRange[0],
      endDate: filters.dateRange[1],
    }),
  }
}

console.log(buildQuery({ keyword: 'test' }))
// { page: 1, pageSize: 20, keyword: 'test' }

console.log(buildQuery({ status: 0 }))
// { page: 1, pageSize: 20, status: 0 }  —— 注意用 != null 而不是 &&，否则 0 会被丢弃
```

边界说明：
- `...(false && { key: val })` 等价于 `...false`，展开 falsy 值不会报错，结果为空。
- 用 `!= null` 替代 `&&` 可以保留 `0`、`''` 等有效 falsy 值。

### 示例 3：浅拷贝陷阱

```js
const original = { a: 1, nested: { b: 2 } }
const copy = { ...original }

copy.a = 99
copy.nested.b = 99

console.log(original.a)        // 1（基本类型，独立副本）
console.log(original.nested.b) // 99（引用类型，共享同一对象）
```

## 使用场景说明和对比

| 场景 | 是否适合 `{...obj}` | 原因 |
| --- | --- | --- |
| 合并默认配置和用户配置 | 适合 | 一层合并，覆盖顺序清晰 |
| Redux/Pinia 不可变状态更新 | 适合 | 每次返回新对象，配合引用比较 |
| 剔除对象中的某些属性 | 适合 | `const { secret, ...safe } = obj` |
| 条件性添加请求参数 | 适合 | `...(cond && { key: val })` 简洁 |
| 深层嵌套对象的完整拷贝 | 不适合 | 只做浅拷贝，嵌套引用共享 |
| 含 Date/Map/Set/RegExp 的对象 | 不适合 | 这些类型展开后丢失实例行为 |

## 易错点提示

- `{...obj}` 是浅拷贝，修改嵌套对象会影响原对象。
- 属性覆盖是"后面覆盖前面"，写反顺序会导致默认值覆盖用户配置。
- `...(condition && { key: val })` 中如果 `val` 可能是 `0` 或空字符串，用 `condition != null` 而非 `&&`。
- `{...arr}` 会把数组索引变成对象键：`{...['a','b']}` → `{ 0: 'a', 1: 'b' }`。
- 不复制原型链属性，class 实例展开后丢失方法。

## 记忆要点总结

- `{...a, ...b}` = 浅合并，b 覆盖 a 的同名属性。
- 只拷贝可枚举自有属性，嵌套对象共享引用。
- 条件属性用 `...(cond && { key: val })`。
- 不可变更新时，被修改路径上的每一层都要展开。
- 需要深拷贝时用 `structuredClone()` 或 `immer`。

## 延伸问题

1. `{...obj}` 和 `Object.assign({}, obj)` 在什么场景下行为不同？
2. 为什么 Redux reducer 中用扩展运算符而不是直接修改 state？
3. 嵌套超过三层时，手动展开有什么替代方案？
4. `{...null}`、`{...undefined}`、`{...123}` 分别返回什么？
5. 如何用解构剩余属性实现"从对象中删除某个 key"？

## 可能类似的问题及简要参考答案

**Q：`Object.assign` 和扩展运算符有什么区别？**
A：语义基本等价，但 `Object.assign` 会修改第一个参数并触发 setter，扩展运算符总是创建新对象。

**Q：扩展运算符是深拷贝还是浅拷贝？**
A：浅拷贝。第一层属性是独立副本，嵌套的引用类型仍指向同一对象。

**Q：如何用扩展运算符实现条件属性？**
A：`{ ...baseObj, ...(condition && { key: value }) }`，condition 为 falsy 时展开结果为空。

**Q：扩展运算符能拷贝原型链上的属性吗？**
A：不能。只拷贝对象自身的可枚举属性，等价于 `Object.assign`。

## 辅助记忆总结

记成一句话：`{...obj}` 是"浅合并 + 后覆盖前"，嵌套要逐层展开，深拷贝另找方案。
