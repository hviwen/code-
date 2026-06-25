# 109. [高级] 什么情况下使用 WeakMap 比 Map 更合适？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

WeakMap 的核心优势是**键对象不可达时自动回收条目**。比 Map 合适的情况是：数据生命周期与对象绑定，且该对象的生命周期不由你控制——如 DOM 节点、第三方组件实例、缓存对象。Map 强引用会导致这些对象无法被 GC，造成内存泄漏。

一句话答法：当给**不可控生命周期的对象**（DOM 节点、第三方实例、回调 this）附加数据时用 WeakMap——对象回收后数据自动释放；当需要遍历/计数/任意键时用 Map。

## 问题意图

1. 是否理解 WeakMap 适合"对象生命周期不可控"的场景。
2. 是否能举出 3 个以上具体场景并解释为什么 WeakMap 优于 Map。
3. 是否知道 WeakMap 的局限性（不可遍历、无 size、仅对象键）限制了它的适用场景。

## 考察范围

- DOM 节点数据关联（节点移除 → 自动清理）。
- 类私有属性（`this` 为键，实例销毁后私有数据自动回收）。
- 对象计算结果缓存（缓存绑定 key 对象生命周期）。
- 事件监听器回调中绑定的上下文对象。
- 防止第三方库实例的内存泄漏。
- 不适用的场景：需要遍历、需要计数、键为基本类型、需要 JSON 序列化。

## 技术错误纠正

- "WeakMap 比 Map 性能更好"——不一定。GC 回收时机不确定，可能反而有额外开销。选 WeakMap 是为了正确性（防泄漏）不是性能。
- "WeakMap 所有场景都优于 Map"——不是。需要遍历、计数、基本类型键时 Map 才合适。

## 知识点系统梳理

### 选型决策

```js
// ✅ WeakMap：对象生命周期不可控，数据随对象回收
const nodeData = new WeakMap()
nodeData.set(domNode, { clicks: 0 })

// ✅ Map：需要遍历/计数/基本类型键
const scores = new Map()
scores.set('alice', 100)  // 字符串键
scores.set('bob', 90)
for (const [name, score] of scores) { /* 遍历 */ }
scores.size               // 计数
```

### 对比场景

```js
// ❌ 用 Map 的隐患
const map = new Map()
let btn = document.getElementById('btn')
map.set(btn, { clicks: 0 })
btn.remove()              // btn 从 DOM 移除
// btn 对象仍被 map 引用 → 内存泄漏

// ✅ 用 WeakMap 的正确做法
const wm = new WeakMap()
let btn2 = document.getElementById('btn2')
wm.set(btn2, { clicks: 0 })
btn2.remove()             // btn2 从 DOM 移除
// btn2 无其他引用 → GC 回收，wm 条目自动清除
```

## 实战应用举例

### 示例 1：DOM 节点数据

```js
const _data = new WeakMap()

function attachData(node, data) {
  _data.set(node, data)
  node.addEventListener('click', () => {
    console.log(_data.get(node))
  })
}
// 节点 remove 后 data 自动释放
```

### 示例 2：对象缓存

```js
const cache = new WeakMap()

function compute(obj) {
  if (cache.has(obj)) return cache.get(obj)
  const result = heavyWork(obj)
  cache.set(obj, result)
  return result
}
// obj 被 GC 后缓存自动失效
```

## 使用场景说明和对比

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| DOM 节点数据 | WeakMap | 节点移除后自动清理 |
| 类私有属性 | WeakMap 或 `#` | 实例销毁后数据回收 |
| 对象计算结果缓存 | WeakMap | 缓存绑定对象生命周期 |
| 频繁增删/需要遍历 | Map | WeakMap 不可遍历 |
| 基本类型键 | Map | WeakMap 要求对象键 |
| 需要 size/clear | Map | WeakMap 不支持 |

## 易错点提示

- WeakMap 不可遍历——如果之后需要遍历所有条目，不能选 WeakMap。
- WeakMap 键必须是对象——字符串等基本类型不能用。
- WeakMap 值不是弱引用——值对象不会被自动回收，除非无其他引用。
- WeakMap 没有 `clear()`——只能逐一 `delete`。

## 记忆要点总结

- 选 WeakMap：对象生命周期不可控，数据随对象回收，防泄漏。
- 选 Map：需要遍历/计数/基本键/clear。
- WeakMap 是正确性选择（防泄漏），不是性能选择。

## 延伸问题

1. WeakMap 在 Vue 3 响应式系统中怎么用的？
2. WeakRef 和 WeakMap 的关系？

## 可能类似的问题及简要参考答案

**Q：什么时候用 Map 而不是 WeakMap？**
A：需要遍历、计数、基本类型键、clear 操作时。

**Q：WeakMap 能解决什么问题？**
A：防止因对象数据未清理导致的内存泄漏，重点是正确性而非性能。

## 辅助记忆总结

记成一句话：对象你管不了生命周期 → WeakMap（防泄漏）；需要遍历/数数/字符串键 → Map。
