# 107. [中级] WeakSet 和 WeakMap 的特点和用途

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

WeakSet 和 WeakMap 的键**必须是对象**，且对键持有**弱引用**——没有其他引用指向该对象时 GC 自动回收。WeakMap 存放键值对，WeakSet 只标记存在性。API 均只有 `add/set`、`has`、`delete`，不可遍历、无 `size`。

一句话答法：WeakMap = `<对象, 值>` 映射，WeakSet = 对象集合，两者键/元素必须是对象且弱引用（不阻止 GC）；只有 `get/set/add/has/delete`，不能遍历和查大小。用于挂载 DOM 数据、标记对象、私有属性。

## 问题意图

1. 是否理解"弱引用"的核心语义——不影响 GC 回收。
2. 是否知道 WeakMap 和 WeakSet 的 API 限制：不可遍历、无 size、无 clear。
3. 是否能区分 WeakMap（存额外数据）和 WeakSet（标记存在性）的用途。

## 考察范围

- 键/元素必须是对象，不能是基本类型。
- 弱引用语义：不阻止 GC，对象回收后自动移除。
- API 限制：WeakMap 只有 `get/set/has/delete`，WeakSet 只有 `add/has/delete`。
- 不可遍历原因：GC 随时可能回收键，遍历结果不确定。
- WeakMap 应用：DOM 数据关联、类私有属性、对象缓存。
- WeakSet 应用：对象标记、已处理检查。
- 与 Map/Set 的区别：强引用 vs 弱引用、可遍历 vs 不可遍历。

## 技术错误纠正

- "WeakMap 的值也是弱引用"——不对。WeakMap 只对键弱引用，对值是强引用。
- "WeakMap/WeakSet 不可遍历是性能问题"——不准确，设计原因是 GC 回收时机不确定，遍历结果不可预测。

## 知识点系统梳理

### WeakMap vs Map

```js
// Map：键强引用 → 阻止 GC
let obj = {}
const map = new Map()
map.set(obj, 'data')
obj = null  // 对象不会被回收（map 强引用）

// WeakMap：键弱引用 → 不阻止 GC
let obj2 = {}
const wm = new WeakMap()
wm.set(obj2, 'data')
obj2 = null // 对象会被 GC 回收
```

### WeakSet vs Set

```js
// Set：强引用
let obj = {}
const set = new Set()
set.add(obj)
obj = null  // 不会被回收

// WeakSet：弱引用
let obj2 = {}
const ws = new WeakSet()
ws.add(obj2)
obj2 = null // 会被回收
```

### API 对比

| 操作 | Map | WeakMap | Set | WeakSet |
| --- | --- | --- | --- | --- |
| 键/值类型 | 任意 | 键仅对象 | 任意 | 仅对象 |
| 引用 | 强 | 弱（仅键） | 强 | 弱 |
| `get` | ✅ | ✅ | ❌ | ❌ |
| `set/add` | ✅ | ✅ | ✅ | ✅ |
| `has` | ✅ | ✅ | ✅ | ✅ |
| `delete` | ✅ | ✅ | ✅ | ✅ |
| `size` | ✅ | ❌ | ✅ | ❌ |
| `clear` | ✅ | ❌ | ✅ | ❌ |
| 遍历 | ✅ | ❌ | ✅ | ❌ |

## 实战应用举例

### 示例 1：WeakMap — DOM 关联数据

```js
const nodeMeta = new WeakMap()

function trackNode(node) {
  nodeMeta.set(node, { clicks: 0 })
  node.addEventListener('click', () => {
    const data = nodeMeta.get(node)
    data.clicks++
  })
}
// 节点移除 → 数据自动清理
```

### 示例 2：WeakSet — 标记已处理

```js
const processed = new WeakSet()

function visit(node) {
  if (processed.has(node)) return
  processed.add(node)
  // 处理逻辑...
}
// node GC 后标记自动清除
```

## 使用场景说明和对比

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| 对象关联额外数据 | WeakMap | 不影响对象生命周期 |
| 标记对象状态（已/未处理） | WeakSet | 对象回收标记自动清除 |
| 类私有属性 | WeakMap | 键为 this，实例销毁数据回收 |
| 通用缓存/需要遍历 | Map/Set | WeakMap/WeakSet 不可遍历 |

## 易错点提示

- WeakMap/WeakSet 键必须是对象，`null`、数字、字符串都会报 TypeError。
- WeakMap 对值是**强引用**——值不会被自动回收。
- WeakMap/WeakSet 没有 `clear()`，只能逐一 `delete`。
- 不可遍历是设计选择，不是功能缺失。

## 记忆要点总结

- WeakMap = `<对象, 值>`，WeakSet = `<对象>` 集合。
- 弱引用：不阻止 GC，对象回收后条目自动消失。
- API：仅 get/set/add/has/delete，无遍历/size/clear。

## 延伸问题

1. WeakMap 为什么没有 `size`？
2. WeakRef 和 WeakMap 的关系是什么？

## 可能类似的问题及简要参考答案

**Q：WeakMap 能遍历吗？**
A：不能。键对象可能随时被 GC 回收，遍历结果不确定。

**Q：WeakMap 和 WeakSet 的适用场景区别？**
A：WeakMap 用于存数据，WeakSet 用于打标记。

## 辅助记忆总结

记成一句话：WeakMap = 给对象贴数据标签，WeakSet = 给对象打勾——对象没了标签和勾自动消失。
