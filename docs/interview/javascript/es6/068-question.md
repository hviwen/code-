# 068. [中级]** 字符串解构赋值的用法

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

字符串解构的核心不是"特殊语法"，而是字符串实现了迭代协议（`Symbol.iterator`），所以数组解构语法可以直接用在字符串上，按位置逐字符提取。

一句话答法：字符串是可迭代的类数组，用 `const [a, b, c] = str` 就能按位置取字符，rest 元素 `...rest` 会收集剩余字符到数组。

## 问题意图

这道题主要考察两件事：

1. 是否理解字符串是可迭代对象，解构赋值基于迭代协议而非"只能用在数组上"。
2. 是否清楚字符串解构用数组语法 `[]` 而不是对象语法 `{}`，以及 rest 收集结果是数组不是字符串。

## 考察范围

- 字符串作为可迭代对象参与数组解构。
- 按位置提取字符、跳过字符（空位）。
- rest 元素 `...rest` 将剩余字符收集为字符串数组。
- `[...str]` 与 `str.split('')` 在 Unicode 处理上的差异。
- 默认值在字符串长度不足时的行为。
- 解构赋值与其他字符串拆分方案的取舍。

## 技术错误纠正

- 字符串解构应该使用数组语法 `[...]` 而不是对象语法 `{...}`。正确写法是 `const [a, b, c] = str` 或 `const [...chars] = str`。
- `[...str]` 按码点（code point）拆分，能正确处理大部分 emoji 和 astral 字符；`str.split('')` 按码元（code unit）拆分，会把 `𝐀`、`😀` 等拆成两个代理对半段。但 `[...str]` 对多码点组合的 grapheme cluster（如 `👨‍👩‍👧`）同样会拆散。

## 知识点系统梳理

### 基本字符提取

```js
const [a, b, c] = 'Hello'
// a = 'H', b = 'e', c = 'l'
```

解构按迭代顺序逐字符赋值，多余的字符被忽略。

### 跳过字符（空位）

```js
const [first, , , , fifth] = 'abcde'
// first = 'a', fifth = 'e'
```

用连续逗号跳过不需要的位置，和数组解构行为完全一致。

### rest 收集剩余字符

```js
const [head, ...tail] = 'Hello'
// head = 'H'
// tail = ['e', 'l', 'l', 'o']  ← 注意：是数组，不是字符串
```

如果需要字符串，可以 `tail.join('')`。

### 默认值

```js
const [x, y, z = '?'] = 'Hi'
// x = 'H', y = 'i', z = '?'
```

字符串长度不足时，缺失位置的值为 `undefined`，触发默认值。

### `[...str]` vs `str.split('')`

| 对比项 | `[...str]` | `str.split('')` |
| --- | --- | --- |
| 拆分依据 | 迭代协议，按码点 | 按 UTF-16 码元 |
| `'😀'` 结果 | `['😀']`（1 个元素） | `['\uD83D', '\uDE00']`（2 个代理半段） |
| grapheme cluster `'👨‍👩‍👧'` | 拆成 5 个元素 | 拆成更多代理半段 |
| 性能 | 通常略慢 | 通常略快 |

结论：纯 ASCII 场景两者等价；涉及 emoji 或多语言文本时优先用 `[...str]`。

## 实战应用举例

### 示例 1：提取首字符并处理边界

```js
function getInitial(name) {
  const [first = ''] = name
  return first.toUpperCase()
}

getInitial('alice')  // 'A'
getInitial('')       // ''（默认值避免 undefined.toUpperCase 报错）
getInitial('😀ok')   // '😀'（迭代协议正确处理 emoji）
```

边界说明：

- 空字符串走默认值 `''`，不会报错。
- 比 `name[0]` 或 `name.charAt(0)` 更简洁地带上默认值。
- emoji 作为单个码点被正确提取；但 grapheme cluster（如 `👨‍👩‍👧`）会被拆散，此时需要 `Intl.Segmenter`。

### 示例 2：分离首字符与剩余部分

```js
function capitalize(str) {
  const [first, ...rest] = str
  if (!first) return ''
  return first.toUpperCase() + rest.join('')
}

capitalize('hello')  // 'Hello'
capitalize('a')      // 'A'
capitalize('')       // ''
```

取舍：简单直观，但 rest 产生临时数组再 `join`，对超长字符串不如 `str[0].toUpperCase() + str.slice(1)` 高效。日常场景足够。

## 使用场景说明和对比

| 场景 | 是否适合字符串解构 | 原因 |
| --- | --- | --- |
| 提取前几个字符并带默认值 | 适合 | 解构天然支持默认值，比 `charAt` + 条件判断更简洁 |
| 分离首字符和剩余部分 | 适合 | `const [head, ...tail] = str` 一行搞定 |
| 字符串转字符数组 | 适合 | `[...str]` 比 `split('')` 更安全处理 Unicode |
| 按分隔符拆分（如 CSV） | 不适合 | 应该用 `split()` 先拆成子串再解构 |
| 处理超长字符串的每个字符 | 不适合 | 一次性展开到数组浪费内存，用 `for...of` 逐个迭代 |
| 需要精确处理 grapheme cluster | 不适合 | 解构按码点拆，组合 emoji 会被拆散 |

## 易错点提示

- 字符串解构用数组语法 `[]`，不是对象语法 `{}`。`const { 0: a } = 'Hi'` 虽然也能取到 `'H'`，但那是对象解构利用了字符串的索引属性，不是迭代解构。
- rest 元素 `...rest` 收集的结果是字符数组，不是字符串。需要字符串时要 `rest.join('')`。
- `[...str]` 按码点拆分，能正确处理单个 emoji，但多码点组合的 grapheme cluster（如肤色修饰符、ZWJ 序列）仍会被拆散。
- 空字符串解构不会报错，所有变量都是 `undefined`（除非有默认值）。
- 字符串是不可变的，解构只是读取字符，不会修改原字符串。
- 嵌套解构对字符串无意义——单个字符是长度为 1 的字符串，再解构只是取出同一个字符。

## 记忆要点总结

- 字符串可迭代，所以数组解构语法 `[a, b, c] = str` 直接可用。
- rest `...rest` 收集的是数组，不是字符串。
- `[...str]` 按码点拆分，比 `split('')` 更安全处理 Unicode。
- 解构语法是 `[]` 不是 `{}`。
- 空字符串解构不报错，缺失位置是 `undefined`。

## 延伸问题

1. 为什么字符串可以用数组解构语法？背后的迭代协议是什么？
2. `[...str]` 和 `Array.from(str)` 有什么区别？
3. 如何正确按 grapheme cluster 拆分字符串？
4. 对象解构 `const { length } = str` 能拿到什么？和数组解构有什么关系？
5. 自定义对象如何实现 `Symbol.iterator` 以支持解构？

## 可能类似的问题及简要参考答案

**Q：字符串解构和数组解构有什么区别？**
A：语法相同，都基于迭代协议逐元素解构。区别在于字符串的每个元素是单字符字符串，且字符串不可变。rest 收集结果都是数组。

**Q：如何把字符串拆成字符数组？**
A：`[...str]` 或 `Array.from(str)`，两者都按码点拆分，比 `str.split('')` 对 Unicode 更安全。

**Q：解构赋值可以用在哪些可迭代对象上？**
A：任何实现了 `Symbol.iterator` 的对象都可以用数组解构，包括字符串、数组、Set、Map、生成器等。

## 辅助记忆总结

记成一句话：字符串是可迭代的，数组解构语法按位置取字符、rest 收集成数组、`[...str]` 比 `split('')` 对 Unicode 更安全。
