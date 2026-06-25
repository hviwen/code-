# 108. [中级] 如何遍历 Set 和 Map？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

Set 和 Map 都实现了迭代器协议，所以 `for...of`、扩展运算符、`Array.from` 可直接使用。Set 按插入顺序产出值，Map 按插入顺序产出 `[key, value]` 对。两者都有 `forEach` 方法和 `keys/values/entries` 迭代器方法。

一句话答法：`for...of` 可直接遍历 Set（每次一个值）和 Map（每次一个 `[key, val]` 对）；两者都有 `forEach((v, k, coll) => ...)`、`.keys()`、`.values()`、`.entries()`。Set 不支持索引遍历。

## 问题意图

1. 是否知道 Set/Map 都实现了 `[Symbol.iterator]` 接口。
2. 是否知道 `for...of`、`.forEach`、`.keys/values/entries` 三种遍历方式。
3. 是否区分 Set 和 Map 遍历时的值结构差异。
4. 是否知道 Set 的 `keys()` 和 `values()` 返回相同迭代器（为与 Map 对称）。

## 考察范围

- `for...of`：Set 产出每个值，Map 产出 `[key, value]` 数组。
- `forEach`：Set `(val, val, set)`，Map `(val, key, map)`。
- `keys()` / `values()` / `entries()` 迭代器。
- Set 的 `keys()` 是 `values()` 的别名（为 API 对称）。
- 扩展运算符 `...` 和 `Array.from` 也可遍历。
- 遍历顺序：按插入顺序。
- 不能中途中断 `forEach`（可用 `for...of` + `break`）。

## 技术错误纠正

- "Set 可以用索引遍历"——不能，Set 没有索引。
- "Map 的 `forEach` 参数和 Set 一样"——不一样，Map 的回调是 `(value, key, map)`，Set 是 `(value, value, set)`。

## 知识点系统梳理

### Set 遍历

```js
const set = new Set(['a', 'b', 'c'])

// for...of
for (const v of set) console.log(v)     // a, b, c

// forEach（第二个参数等于第一个——为对称）
set.forEach((v, v2, s) => console.log(v, v === v2)) // a true, b true, c true

// keys === values（Set 只有值）
for (const v of set.keys()) console.log(v)   // a, b, c
for (const v of set.values()) console.log(v) // a, b, c
for (const [v] of set.entries()) console.log(v) // a, b, c（[val, val]）

// 转数组
;[...set]        // ['a', 'b', 'c']
Array.from(set)  // ['a', 'b', 'c']
```

### Map 遍历

```js
const map = new Map([['a', 1], ['b', 2]])

// for...of
for (const [k, v] of map) console.log(k, v)  // a 1, b 2

// forEach
map.forEach((v, k, m) => console.log(k, v))  // a 1, b 2

// 迭代器
for (const k of map.keys()) console.log(k)          // a, b
for (const v of map.values()) console.log(v)        // 1, 2
for (const [k, v] of map.entries()) console.log(k, v) // a 1, b 2

// 转数组
;[...map]            // [['a',1], ['b',2]]
;[...map.keys()]     // ['a', 'b']
Array.from(map.values()) // [1, 2]
```

### 遍历对比表

| 方式 | Set | Map | 说明 |
| --- | --- | --- | --- |
| `for...of` | `v` 每次 | `[k, v]` 每次 | 解构 `[k, v]` |
| `forEach` | `(val, val, set)` | `(val, key, map)` | Set 的 key=val |
| `.keys()` | 同 values | 返回键迭代器 | Set 中 key 不存在 |
| `.values()` | 返回值迭代器 | 返回值迭代器 | - |
| `.entries()` | `[val, val]` | `[key, val]` | Set 的键=值 |

## 实战应用举例

### 示例：提前终止遍历

```js
const map = new Map([['a', 1], ['b', 2], ['c', 3]])

// forEach 不能中途停止，用 for...of + break
for (const [k, v] of map) {
  if (v > 2) break
  console.log(k, v) // a 1, b 2
}
```

## 使用场景说明和对比

| 场景 | 推荐方式 |
| --- | --- |
| 只需值 | `for...of` 或 `.forEach` |
| 需提前终止 | `for...of` + `break` |
| 只需键（Map） | `map.keys()` |
| 函数式处理 | `.forEach` 或转换为数组后链式 |
| 转数组 | `[...col]` 或 `Array.from` |

## 易错点提示

- `Map.forEach` 回调参数顺序是 `(value, key, map)`，不是 `(key, value)`。
- `Set.forEach` 回调参数是 `(value, value, set)`——前两个相同。
- `for...of` 遍历 Map 产出的是 `[key, value]` 数组，需要解构。
- `for...of` 在 Set/Map 上按插入顺序遍历。
- 不能用 `break` 中断 `forEach`——用 `for...of` 替代。

## 记忆要点总结

- Set/Map 都可用 `for...of` 和 `forEach` 遍历。
- Set 的 `key` 就是 `value`，Map 是 `[key, val]` 对。
- 提前终止用 `for...of` + `break`。

## 延伸问题

1. 为什么 Set 的 `keys()` 返回和 `values()` 一样？
2. 遍历 Set/Map 时能否修改元素？

## 可能类似的问题及简要参考答案

**Q：Set 能像数组一样用索引遍历吗？**
A：不能。Set 没有索引，只能用 `for...of` 或 `forEach`。

**Q：Map 的 forEach 回调参数是什么？**
A：`(value, key, map)`——注意 value 在前，key 在后。

## 辅助记忆总结

记成一句话：Set 和 Map 都能用 `for...of` 遍历——Set 出一个值，Map 出一对 `[key, val]`。
