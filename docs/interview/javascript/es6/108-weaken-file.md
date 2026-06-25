# 108. [高级] WeakMap 的实际应用场景有哪些？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

WeakMap 强在"不影响 GC"——对象作为键时，被关联的数据生命周期与对象绑定，对象回收数据自动释放。核心场景是 DOM 附加数据、类私有属性、对象缓存、事件监听器管理、防止内存泄漏。

一句话答法：WeakMap 用于 DOM 节点关联数据（节点移除→数据自动回收）、类私有属性（WeakMap 键为 this）、对象缓存（缓存生命周期与键对象绑定）、事件监听器去重和反注册。

## 问题意图

1. 能否说出 3 个以上 WeakMap 的实际使用场景。
2. 是否理解 WeakMap 在"防止内存泄漏"中的角色。
3. 是否能用 WeakMap 实现类私有属性的完整模式。
4. 是否知道 WeakMap 在框架/库中的实际应用（Vue 响应式、React 内部等）。

## 考察范围

- DOM 节点附加数据（`DOM` 事件回调、状态缓存）。
- 类私有属性的实现（WeakMap 键为 `this`）。
- 对象缓存（缓存生命周期绑定键对象）。
- 事件监听器注册和反注册（避免泄漏）。
- 框架中的 WeakMap 应用（Vue `WeakMap<target, deps>`、React 内部 fiber 关联）。
- 与 Map 方案的对比（Map 强引用的内存泄漏问题）。

## 技术错误纠正

- "WeakMap 可以替代所有 map 应用"——不能。WeakMap 不可遍历且键必须是对象，不适用需要遍历的场景。
- "WeakMap 的键值为空时会自动触发回调"——不会。WeakMap 只是不阻止 GC，没有回调机制。可以用 `FinalizationRegistry`。

## 知识点系统梳理

### 场景 1：DOM 节点关联数据

```js
const nodeData = new WeakMap()

function trackClick(node) {
  if (!nodeData.has(node)) {
    nodeData.set(node, { count: 0 })
  }
  node.addEventListener('click', () => {
    const data = nodeData.get(node)
    data.count++
    console.log(`clicked ${data.count} times`)
  })
}

// 节点被移除（removeChild/innerHTML）→ WeakMap 自动清理
// 用 Map 的话节点被移除了 data 还在内存中 → 内存泄漏
```

### 场景 2：类私有属性（模拟私有）

```js
const _private = new WeakMap()

class Widget {
  constructor(id, secret) {
    _private.set(this, { id, secret, initTime: Date.now() })
  }

  getId() { return _private.get(this)?.id }
  verify(s) { return _private.get(this)?.secret === s }
  isExpired() {
    return Date.now() - _private.get(this).initTime > 3600000
  }
}

// 实例销毁后，私有数据自动释放
```

### 场景 3：对象缓存

```js
const cache = new WeakMap()

function processResult(obj) {
  if (cache.has(obj)) return cache.get(obj)
  const result = heavyComputation(obj)
  cache.set(obj, result)
  return result
}

// 缓存有效期完全绑定 obj 生命周期
// obj 回收后缓存自动失效，无需手动清理
```

### 场景 4：去重事件监听

```js
const handlers = new WeakMap()

function addOnceListener(node, type, fn) {
  if (!handlers.has(node)) handlers.set(node, new Map())
  const nodeHandlers = handlers.get(node)
  if (!nodeHandlers.has(type)) nodeHandlers.set(type, new Set())

  if (!nodeHandlers.get(type).has(fn)) {
    nodeHandlers.get(type).add(fn)
    node.addEventListener(type, fn)
  }
}
```

## 实战应用举例

### 示例 1：Vue 响应式系统中的依赖收集

```
// 简化 Vue 3 reactivity 中的 WeakMap<target, Map<key, Set<effect>>>
// target（响应式对象）→ 对应的依赖映射
// target 回收后依赖自动清理
```

### 示例 2：React fiber 关联状态

```
// React 使用 WeakMap 将 fiber 节点与其挂载的状态关联
// fiber 节点回收后状态自动释放
```

## 使用场景说明和对比

| 场景 | 方案 | 说明 |
| --- | --- | --- |
| DOM 节点附加数据 | WeakMap | 节点移除→自动清理，防止泄漏 |
| 类私有属性 | WeakMap 或 `#` | WeakMap 兼容性好，`#` 更安全 |
| 对象计算结果缓存 | WeakMap | 缓存绑定对象生命周期 |
| 频繁增删的通用缓存 | Map | 需要手动管理，但可遍历 |
| 服务端长期缓存 | LRU 或 Map | WeakMap 对象回收后缓存会消失 |

## 易错点提示

- WeakMap 键必须是对象，不能是原始值。如果键是 `this` 但 `this` 是基本类型（strict 模式下不会），会报错。
- WeakMap 不可遍历，调试时没法查看所有内容——可以考虑在生产环境限制使用。
- 值不会被弱引用：WeakMap 的键被回收后值会被 GC 处理，但不是因为 WeakMap 的关系——是值本身不再被引用。
- 不要用 WeakMap 做"短期缓存"——如果操作频繁且键不会被回收，WeakMap 和 Map 没有区别。
- WeakMap 不能直接替代 Map，因为不支持 `size` 和遍历。

## 记忆要点总结

- 三大场景：DOM 数据、私有属性、对象缓存。
- 核心价值：对象回收→数据自动释放，零内存泄漏。
- 限制：键限对象、不可遍历、无 size。

## 延伸问题

1. WeakMap 在 Vue 3 的 reactivity 系统中扮演什么角色？
2. 除了 WeakMap，还有哪些方案可以防止 DOM 节点的内存泄漏？
3. `FinalizationRegistry` 和 WeakMap 有什么区别？

## 可能类似的问题及简要参考答案

**Q：如何处理 DOM 节点移除后的内存泄漏？**
A：用 WeakMap 关联节点和数据——节点 GC 后数据自动被清理。或手动在 `removeChild` 时清理对应 Map。

**Q：WeakMap 能缓存计算结果吗？**
A：能，但缓存的 key 必须是对象，且对象被回收后缓存自动失效。适合临时计算结果缓存，不适合长期缓存。

**Q：除了 WeakMap，还有什么方式实现私有属性？**
A：用 `#` 私有字段（ES2022）更安全、语法更简洁。或用闭包。

## 辅助记忆总结

记成一句话：WeakMap = 给对象打临时标签——对象消失标签自动消失，最适合 DOM 附加数据、私有属性和对象缓存。
