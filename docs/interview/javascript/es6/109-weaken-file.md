# 109. [高级] WeakSet 和 Set 有什么区别？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

WeakSet 是 Set 的"弱引用版本"——元素必须是对象，集合中的对象如果没有其他引用会被 GC 自动回收。API 只有 `add/has/delete`，不能遍历、没有 `size`。常用于**对象标记/存在性检查**，确保不影响对象生命周期。

一句话答法：WeakSet 元素必须是对象且弱引用，对象被 GC 回收后自动从集合中移除；只有 `add/has/delete`，不能遍历或查大小。用于标记对象是否已处理/已注册。

## 问题意图

1. 是否理解 WeakSet 元素必须是对象且弱引用（Set 不限制类型且强引用）。
2. 是否知道 WeakSet 只有 `add/has/delete` 三个方法。
3. 是否能说出 WeakSet 的实际应用场景（对象标记、已处理检查）。

## 考察范围

- 元素类型限制：WeakSet 仅对象，Set 任意类型。
- 弱引用：WeakSet 不阻止 GC，Set 强引用。
- API 限制：WeakSet 只有 `add/has/delete`，无 `size/forEach/keys/values/clear`。
- 不可遍历原因：元素存活状态不确定。
- 使用场景：标记对象是否已访问/已注册/已处理。
- 与 WeakMap 对比：WeakSet = 只关心对象是否存在，WeakMap = 存额外数据。

## 技术错误纠正

- "WeakSet 是 Set 的弱引用版本"——对，但 WeakSet 不是 Set 的子集，API 显著不同。
- "WeakSet 可以存基本类型"——不能，元素必须是对象，加数字/字符串会 TypeError。
- "WeakSet 可以用于值去重"——不能。WeakSet 不能遍历没法查看所有元素，且元素必须是对象。

## 知识点系统梳理

### 核心对比

```js
// Set：强引用
let obj = { id: 1 }
const set = new Set()
set.add(obj)
obj = null         // 对象仍被 Set 引用，不会被 GC 回收

// WeakSet：弱引用
let obj2 = { id: 2 }
const ws = new WeakSet()
ws.add(obj2)
obj2 = null        // 无其他引用 → 对象会被 GC 回收
```

### API 差异

```js
const ws = new WeakSet()

ws.add({})           // ✅
ws.add(1)            // ❌ TypeError（只能加对象）
ws.add('str')        // ❌ TypeError
ws.add(null)         // ❌ TypeError
ws.add(undefined)    // ❌ TypeError

ws.has(obj)          // ✅
ws.delete(obj)       // ✅

ws.size              // undefined
ws.forEach           // undefined
ws.clear             // ❌（不存在）
for (const v of ws) {} // ❌（不可遍历）
```

### WeakSet vs Set 完整对比

| 对比 | Set | WeakSet |
| --- | --- | --- |
| 元素类型 | 任意类型 | **仅对象** |
| 引用强度 | 强引用 | 弱引用 |
| 遍历 | ✅ | ❌ |
| `size` | ✅ | ❌ |
| `clear()` | ✅ | ❌ |
| `keys/values/entries` | ✅ | ❌ |
| `forEach` | ✅ | ❌ |
| 实用方法数 | 8+ | 3（add/has/delete） |

## 实战应用举例

### 示例 1：标记已处理对象

```js
const processed = new WeakSet()

function processItem(item) {
  if (processed.has(item)) return // 跳过已处理的
  processed.add(item)
  // ... 处理逻辑
}

// item GC 后自动从 processed 中移除
```

### 示例 2：防止重复注册

```js
const registered = new WeakSet()

class EventBus {
  register(obj) {
    if (registered.has(obj)) {
      console.warn('already registered')
      return
    }
    registered.add(obj)
    // ... 注册逻辑
  }
}
```

### 示例 3：避免循环引用遍历死循环

```js
const visited = new WeakSet()

function traverse(node) {
  if (!node || visited.has(node)) return
  visited.add(node)
  for (const child of node.children) traverse(child)
  // DOM 树遍历，避免循环引用导致死循环
}
```

## 使用场景说明和对比

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| 标记对象已处理 | WeakSet | 对象回收→标记自动撤销 |
| 对象存在性检查 | WeakSet | 不阻止 GC，比 Set 更安全 |
| 对象去重 | Set 或 Map | WeakSet 不可遍历 |
| 需要计数/遍历的集合 | Set | WeakSet 不支持 |

## 易错点提示

- WeakSet 元素必须是对象，不能是原始值（数字、字符串、布尔、null、undefined）。
- WeakSet 不可遍历，不能查 size——只能用 `has` 做存在性检查。
- WeakSet 没有 `clear()` 方法。单个元素用 `delete`。
- 对象被 GC 后，WeakSet 的 `has` 自动返回 `false`——无法手动控制这个时机。
- WeakSet 和 WeakMap 的区别：WeakSet 只关心"对象在不在"，WeakMap 还能存额外的数据。

## 记忆要点总结

- WeakSet = 只存对象且弱引用，仅 `add/has/delete`。
- 用途：标记对象已处理/已注册。
- 比 Set 的优势：对象回收后标记自动撤销，无内存泄漏。

## 延伸问题

1. WeakSet 和 WeakMap 的应用场景有何不同？
2. WeakSet 为什么没有 `clear` 方法？
3. 什么时候应该用 WeakSet 而不是 Set？

## 可能类似的问题及简要参考答案

**Q：WeakSet 能遍历吗？**
A：不能。WeakSet 的设计目的是做存在性检查，不是遍历集合。元素随时可能被 GC 回收。

**Q：WeakSet 和 Set 的 API 区别？**
A：WeakSet 只有 `add/has/delete`，没有 `size/forEach/clear/keys/values/entries`。

**Q：WeakSet 能做什么 Set 做不了的事？**
A：WeakSet 的元素可以被 GC 自动回收，不会造成内存泄漏。Set 需要手动 `delete`。

## 辅助记忆总结

记成一句话：WeakSet = "来过的对象打个勾"——对象没了勾自动消失，只能打勾不能查列表，只能问"有没有来过"。
