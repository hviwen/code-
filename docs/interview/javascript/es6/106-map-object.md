# 106. [中级] Map 和 Object 的区别是什么？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

Map 和 Object 都是键值对集合，但键类型、遍历顺序、性能特性截然不同：Map 的键可以是**任意类型**（包括对象、NaN），按插入顺序遍历；Object 的键只能是**字符串或 Symbol**，有原型链。

一句话答法：Map 键可以是任意类型（对象、NaN、函数等），按插入顺序遍历，`size` 直接获取个数，无原型链干扰；Object 键只能是字符串/Symbol，有原型链，需 `Object.keys` 遍历。

## 问题意图

1. 是否知道 Map 键可以是任意类型（Map 键不自动转字符串，Object 键会转字符串）。
2. 是否知道 Map 内部实现了 `Symbol.iterator` 所以可直接 `for...of`。
3. 是否知道 Map 有 `size` 属性而 Object 没有。
4. 是否能根据场景判断用 Map 还是 Object。

## 考察范围

- 键类型：Map（任意类型）vs Object（字符串/Symbol）。
- 键自动转换：`obj[true]` → `obj['true']`，Map 不转换。
- 遍历方式：Map 有 `forEach`/`for...of` + `keys/values/entries`，Object 需要 `Object.keys/values/entries`。
- 大小获取：Map 有 `.size`，Object 需 `Object.keys().length`。
- 原型链：Object 有 `__proto__`，Map 没有。
- 插入顺序：两者都按插入顺序遍历（ES6+ 标准）。
- 性能：Map 频繁增删查通常更快。
- 序列化：Map 不能直接 `JSON.stringify`，Object 可以。

## 技术错误纠正

- "Object 键只能是字符串"——实际上也可以是 Symbol，但 Symbol 键不可枚举且 `JSON.stringify` 忽略。
- "Object 改用 Map 取代"——不准确，Object 适合 JSON 序列化 / 结构已知的数据，Map 适合动态键集合。

## 知识点系统梳理

### 对比总表

| 对比 | Object | Map |
| --- | --- | --- |
| 键类型 | 字符串 或 Symbol | **任意类型** |
| 键自动转换 | 是（`true` → `'true'`） | 否 |
| 原型链 | 有（可能冲突） | 无 |
| `size` | 无（`Object.keys().length`） | 有（`.size`） |
| 遍历顺序 | 插入顺序（整数键特殊排序） | 严格插入顺序 |
| 遍历方式 | `Object.keys/values/entries` | `forEach` / `for...of` + keys/values/entries |
| `JSON.stringify` | ✅ 原生支持 | ❌（`toJSON` 可自定义） |
| 性能（高频增删） | 一般 | 更优 |

### 键类型差异

```js
// Object 键自动转字符串
const o = {}
o[true] = 1; o[{}] = 2
Object.keys(o) // ['true', '[object Object]']

// Map 键保留类型
const m = new Map()
const objKey = {}
m.set(true, 1); m.set(objKey, 2); m.set(NaN, 3)
m.get(true)   // 1
m.get(objKey) // 2（同一引用）
m.get(NaN)    // 3（NaN 视为相等）
```

### 遍历对比

```js
// Object 遍历
const obj = { a: 1, b: 2 }
for (const k of Object.keys(obj))       // a, b
for (const v of Object.values(obj))     // 1, 2
for (const [k, v] of Object.entries(obj)) // ['a',1], ['b',2]

for (const k in obj) { /* 含原型链 */ }

// Map 遍历
const map = new Map([['a', 1], ['b', 2]])
for (const [k, v] of map)    // ['a',1], ['b',2]
map.forEach((v, k) => ...)   // 1 a, 2 b
map.keys(); map.values(); map.entries()
```

## 实战应用举例

### 示例 1：用对象作键缓存

```js
// Map 可以用 DOM 节点作键
const cache = new WeakMap()
function process(el) {
  if (cache.has(el)) return cache.get(el)
  const result = expensiveCompute(el)
  cache.set(el, result)
  return result
}
// Object 无法实现此类缓存（键会被转成 "[object HTMLDivElement]"）
```

### 示例 2：JSON 序列化需要 → 用 Object

```js
const data = { name: 'Alice', age: 30 }
JSON.stringify(data) // '{"name":"Alice","age":30}'
```

## 使用场景说明和对比

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| JSON 交互（API、存储） | Object | Map 默认不序列化 |
| 结构已知的静态数据 | Object | 字面量语法更简洁 |
| 键为任意类型（对象/NaN） | Map | Object 键会转字符串 |
| 高频增删查操作 | Map | 性能更好，`has/delete` O(1) |
| 需要 `size` 属性 | Map | Object 无内置 size |
| 需要 `for...of` 直接遍历 | Map | 可迭代，Object 需要转换 |

## 易错点提示

- `obj[true]` 实际上是 `obj['true']`，而 `map.set(true)` 的键是 `true`（布尔型）。
- Object 有原型键污染：`obj.toString` 即使未设置也返回函数，Map 没有。
- Map 不能直接被 `JSON.stringify`——结果是 `{}`。需要先转对象 `Object.fromEntries(map)`。
- Object 整数键有特殊排序：`{3:'c', 1:'a', 2:'b'}` 遍历是 `1,2,3`，不是插入顺序。Map 永远是插入顺序。
- `new Map([['key', 'val']])` 接受 `[key, value]` 对的数组，不是对象。

## 记忆要点总结

- Map 键不限类型，可迭代，有 size，无原型链。
- Object 限字符串/Symbol 键，JSON 序列化友好。
- 选型：动态键/频增删/任意键 → Map；静态结构/JSON → Object。

## 延伸问题

1. 什么时候用 Map 代替 Object？
2. `Object.create(null)` 和 Map 有什么区别？
3. WeakMap 与 Map 有什么区别？

## 可能类似的问题及简要参考答案

**Q：你有多少种方式判断一个 Object 是否为空？**
A：`Object.keys(obj).length === 0`、`JSON.stringify(obj) === '{}'`、`for...in` 遍历检查。

**Q：Map 能序列化为 JSON 吗？**
A：默认不能。需要先 `Object.fromEntries(map)` 再 `JSON.stringify`，或者自定义 `toJSON` 方法。

**Q：为什么说 Object 有原型链问题？**
A：因为 `obj.hasOwnProperty` 是继承来的，而 `obj.__proto__` 也是一个隐式键。Map 没有任何原型键。

## 辅助记忆总结

记成一句话：Map = 任意类型键 + 可遍历 + 可计数；Object = 字符串键 + JSON 原生 + 字面量方便。
