# 107. [高级] WeakMap 和 Map 有什么区别？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

WeakMap 的键必须是**对象**，且对键持有**弱引用**——如果没有其他引用指向该对象，垃圾回收器会自动回收它，WeakMap 中对应的键值对也随之移除。核心价值是解决 Map 强引用导致的内存泄漏问题。

一句话答法：WeakMap 键必须是对象（不能是基本类型），键对象被 GC 回收后对应条目自动清除，不支持遍历/`size`/`clear`/`keys`/`values`。用于 DOM 节点关联数据和额外数据存储，避免内存泄漏。

## 问题意图

1. 是否理解"弱引用"的含义——不影响 GC 回收。
2. 是否知道 WeakMap 的 API 限制：无遍历、无 `size`、无 `clear`、无 `keys/values`。
3. 是否知道 WeakMap 键必须是对象，值不限类型。
4. 是否能举出 WeakMap 的实际应用场景（DOM 数据关联、私有数据、缓存）。

## 考察范围

- 键类型：WeakMap 键必须是对象（或 Symbol 在提案中），Map 不限。
- 弱引用语义：键对象无其他引用时 GC 可回收，WeakMap 不阻止回收。
- API 限制：WeakMap 只有 `get/set/has/delete`，不支持 `forEach`/`keys`/`values`/`entries`/`size`/`clear`。
- Map 有强引用：键对象不会被 GC 回收，除非显式 `delete`。
- 不可遍历原因：键的存活状态不确定——GC 随时可能回收。

## 技术错误纠正

- "WeakMap 是 Map 的弱引用版本"——不准确。WeakMap 只对**键**弱引用，对值仍是强引用。值不会因为弱引用而被回收。
- "WeakMap 可以存基本类型的键"——不行。键必须是对象。
- "WeakMap 可以用来缓存大量计算结果"——如果计算结果不是对象，值不是弱引用，计算不会被回收。

## 知识点系统梳理

### 核心区别

```js
// Map：强引用
let obj = { name: 'alice' }
const map = new Map()
map.set(obj, 'user')
obj = null        // obj 被赋 null，但 map 仍持有引用
// 该对象不会被 GC 回收 ← map 强引用着它

// WeakMap：弱引用
let obj2 = { name: 'bob' }
const wm = new WeakMap()
wm.set(obj2, 'user')
obj2 = null       // obj2 被赋 null，无其他引用
// 该对象会被 GC 回收 ← wm 的引用不影响 GC
```

### API 差异

```js
const m = new Map()
const wm = new WeakMap()

m.set('key', 1)         // ✅ Map 键可以是字符串
wm.set('key', 1)        // ❌ TypeError: WeakMap 键必须是对象

m.set({}, 1)
wm.set({}, 1)           // ✅

m.size                  // number
wm.size                 // undefined

for (const [k] of m) {} // ✅
for (const [k] of wm) {}// ❌ TypeError（不可遍历）

m.clear()               // ✅
wm.clear()              // ❌（不存在）
```

### 完整对比表

| 对比 | Map | WeakMap |
| --- | --- | --- |
| 键类型 | 任意类型 | **仅对象**（不能是基本类型） |
| 引用强度 | 强引用 | 弱引用（不影响 GC） |
| 遍历 | ✅ `forEach` / `for...of` | ❌ |
| `size` 属性 | ✅ | ❌ |
| `clear()` | ✅ | ❌ |
| `keys/values/entries` | ✅ | ❌ |
| 内存泄漏风险 | 记得 `delete` | 自动回收 |
| 适用场景 | 通用键值存储 | DOM 关联、私有数据、缓存 |

## 实战应用举例

### 示例 1：DOM 节点关联数据

```js
// 用 Map（问题：节点移除后数据仍占用内存）
const _dataMap = new Map()
function setData(node, data) { _dataMap.set(node, data) }

// 用 WeakMap（节点移除 → 数据自动回收）
const _dataWM = new WeakMap()
function setData(node, data) { _dataWM.set(node, data) }
```

### 示例 2：类的私有数据

```js
const _private = new WeakMap()

class User {
  constructor(name, password) {
    _private.set(this, { password })
    this.name = name
  }
  checkPassword(pw) {
    return _private.get(this).password === pw
  }
}

const u = new User('alice', 'secret')
u = null   // GC 自动回收私有数据
```

## 使用场景说明和对比

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| DOM 节点挂载数据 | WeakMap | 节点移除→数据自动清理 |
| 类私有属性 | WeakMap | 真正私有 + 无内存泄漏 |
| 对象缓存 | WeakMap | 对象回收→缓存自动失效 |
| 通用键值存储 | Map | 任意键 + 可遍历 |
| 需要遍历/计数 | Map | WeakMap 不支持 |

## 易错点提示

- WeakMap 键必须是对象，`null`、`undefined`、数字、字符串都不行。
- WeakMap 对值是强引用——值不会被弱引用影响，需要自己管理值的生命周期。
- WeakMap 不可遍历不是"Bug"，是设计决定——因为键的存活状态不确定（GC 随时进行）。
- 不要用 WeakMap 来缓存简单计算——如果键对象被回收了，缓存也没了，可能需要重新计算。
- `WeakMap` 没有 `clear()` 方法，只能逐一 `delete`。

## 记忆要点总结

- 键只能是对象，弱引用→不阻止 GC。
- API 只有 `get/set/has/delete`，无遍历/大小/清除。
- 三大场景：DOM 数据关联、私有数据、对象缓存。
- Map vs WeakMap：强引用可遍历 vs 弱引用不可遍历。

## 延伸问题

1. WeakMap 的值是否也是弱引用？
2. WeakMap 为什么没有 `size` 和遍历？
3. WeakRef 和 WeakMap 有什么关系？
4. 为什么 WeakMap 的键必须时对象而不能是 Symbol？

## 可能类似的问题及简要参考答案

**Q：WeakMap 能遍历吗？为什么？**
A：不能。WeakMap 的键对象可能随时被 GC 回收，遍历时结果不确定，所以故意不提供遍历 API。

**Q：WeakMap 适合什么场景？**
A：适合**需要将数据和对象关联，但又不影响对象生命周期**的场景，如 DOM 节点附加数据、对象私有属性。

**Q：WeakMap 的值会被 GC 回收吗？**
A：不会。WeakMap 只对键弱引用，对值是强引用。值只有在键被回收且没有其他引用时才会被 GC 处理。

## 辅助记忆总结

记成一句话：WeakMap = "对象只存临时标签"——对象没了标签自动消除，限制是没有 size 不能遍历，键必须是对象。
