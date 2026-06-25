# 110. [高级] Proxy 的基本用法和拦截操作

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

Proxy 是 ES6 提供的**元编程能力**——创建一个对象的代理，拦截并自定义基本操作（属性读写、函数调用、构造函数等）。核心是 `handler` 对象中的**陷阱函数（trap）**，覆盖对象的内置行为。

一句话答法：`const p = new Proxy(target, handler)`，handler 中定义 `get/set/has/deleteProperty/apply/construct` 等 trap 拦截对应操作。Proxy 不修改原对象，拦截作用在`p`上。

## 问题意图

1. 是否理解 Proxy 是"不修改原对象，拦截代理操作"的机制。
2. 是否能写出 `get/set` 拦截的完整代码。
3. 是否知道 Proxy 的 trap 和执行时机：属性访问、赋值、删除、函数调用、构造等。
4. 是否了解 Proxy 和 `Object.defineProperty` 的区别：Proxy 可拦截的操作更多（`in`、`delete`、`for...of`）。

## 考察范围

- `new Proxy(target, handler)` 创建代理。
- `handler.get(target, prop, receiver)` — 属性读取。
- `handler.set(target, prop, value, receiver)` — 属性赋值（返回 Boolean 表示成功）。
- `handler.has(target, prop)` — `in` 操作符。
- `handler.deleteProperty(target, prop)` — `delete` 操作。
- `handler.apply(target, thisArg, args)` — 函数调用。
- `handler.construct(target, args, newTarget)` — `new` 调用。
- `handler.ownKeys(target)` — `Object.keys/Reflect.ownKeys`。
- `handler.getPrototypeOf(target)` — `Object.getPrototypeOf`。
- Proxy 的撤销能力：`Proxy.revocable()`。
- Proxy vs `Object.defineProperty`：Proxy 拦截层面更广（操作级），defineProperty 拦截属性级。

## 技术错误纠正

- "Proxy 是拦截对象"——更准确说是**代理**，拦截并转发到 handler 的 trap。
- "Proxy 会修改原对象"——不会，原对象不变，拦截作用在代理对象上。
- "Proxy 可以做完全的冻结/保护"——`receiver` 和 `Reflect` 配合可以，但纯 Proxy 拦截有边界（`===` 无法拦截）。

## 知识点系统梳理

### 基本创建和常见 trap

```js
const target = { name: 'Alice', _secret: 'hidden' }

const handler = {
  get(target, prop, receiver) {
    if (prop.startsWith('_')) throw new Error('access denied')
    return Reflect.get(target, prop, receiver)
  },
  set(target, prop, value, receiver) {
    if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
      throw new TypeError('age must be a non-negative number')
    }
    return Reflect.set(target, prop, value, receiver)
  },
  has(target, prop) {
    return prop !== '_secret' && prop in target
  },
  deleteProperty(target, prop) {
    if (prop.startsWith('_')) throw new Error('cannot delete private')
    return Reflect.deleteProperty(target, prop)
  }
}

const proxy = new Proxy(target, handler)

proxy.name        // 'Alice'
proxy._secret     // Error: access denied
proxy.age = -1    // TypeError: age must be a non-negative number
'_secret' in proxy // false（隐藏）
delete proxy._secret  // Error: cannot delete private
```

### 函数相关 trap

```js
function sum(a, b) { return a + b }

const sumProxy = new Proxy(sum, {
  apply(target, thisArg, args) {
    console.log(`sum called with ${args}`)
    return Reflect.apply(target, thisArg, args)
  }
})

sumProxy(1, 2) // 日志: sum called with 1,2 → 3
```

### 所有 trap 速查

```js
const handler = {
  get(target, prop, receiver) {},          // proxy.prop
  set(target, prop, value, receiver) {},   // proxy.prop = val
  has(target, prop) {},                    // 'prop' in proxy
  deleteProperty(target, prop) {},         // delete proxy.prop
  apply(target, thisArg, args) {},         // proxy()
  construct(target, args, newTarget) {},   // new proxy()
  ownKeys(target) {},                      // Object.keys/proxy
  getPrototypeOf(target) {},               // Object.getPrototypeOf
  setPrototypeOf(target, proto) {},        // Object.setPrototypeOf
  isExtensible(target) {},                 // Object.isExtensible
  preventExtensions(target) {},            // Object.preventExtensions
  getOwnPropertyDescriptor(target, p) {},  // Object.getOwnPropertyDescriptor
  defineProperty(target, p, desc) {},      // Object.defineProperty
  enumerate(target) {},                    // 已废弃（ES2016）
}
```

### Proxy vs Object.defineProperty

| 对比 | Proxy | Object.defineProperty |
| --- | --- | --- |
| 拦截层面 | 操作级别 | 属性级别 |
| 新增属性 | ✅ 自动拦截 | ❌ 需重新 define |
| 数组监听 | ✅ 能拦截 push/splice | ❌ 需要覆盖方法 |
| `in` / `delete` | ✅ 可拦截 | ❌ 不可拦截 |
| `for...of` | ✅ 可拦截 | ❌ 不可拦截 |
| 函数调用 | ✅ `apply` trap | ❌ 不可拦截 |
| 性能 | 略慢（一层转发） | 更快（直接覆写属性） |
| 兼容性 | ES6+ | ES5+ |

## 实战应用举例

### 示例 1：验证层

```js
const user = new Proxy({}, {
  set(target, prop, value) {
    if (prop === 'age' && (typeof value !== 'number' || value < 0 || value > 150))
      throw new RangeError('invalid age')
    return Reflect.set(target, prop, value)
  }
})
user.age = 25      // ✅
user.age = -1      // ❌ RangeError
```

### 示例 2：日志/调试

```js
function createLogger(obj) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const val = Reflect.get(target, prop, receiver)
      console.log(`[get] ${String(prop)} =`, val)
      return val
    },
    set(target, prop, value, receiver) {
      console.log(`[set] ${String(prop)} = ${value}`)
      return Reflect.set(target, prop, value, receiver)
    }
  })
}
```

### 示例 3：撤销代理

```js
const { proxy, revoke } = Proxy.revocable(target, handler)
proxy.foo = 'bar'   // ✅
revoke()
proxy.foo           // ❌ TypeError（已撤销）
```

## 使用场景说明和对比

| 场景 | 方案 | 说明 |
| --- | --- | --- |
| 验证/校验 | Proxy `set` trap | 赋值时校验 |
| 日志/监控 | Proxy `get/set/apply` | 全操作可追踪 |
| 隐藏敏感属性 | Proxy `get/has/deleteProperty` | 前缀匹配拦截 |
| 数组监听 | Proxy | 原生支持新索引/变异方法 |
| 简单数据校验 | Object.defineProperty | 性能更好 |
| 只读冻结 | Object.freeze | 更简洁安全 |

## 易错点提示

- Proxy 的 trap 中修改目标对象要用 `Reflect` 方法——不要直接 `target[prop] = value`，否则可能递归或跳过拦截。
- `set` trap 必须返回布尔值——`true` 表示赋值成功（严格模式返回 `false` 会抛 TypeError）。
- `get` trap 返回 `undefined` 在属性不存在时和被赋值为 `undefined` 时无法区分，需配合 `has` 或 `getOwnPropertyDescriptor`。
- Proxy 的 `===` 无法拦截——`proxy === target` 是 `false`，Proxy 是不同对象。
- `Proxy.revocable` 是一次性的，撤销后不能再恢复。

## 记忆要点总结

- Proxy = `new Proxy(target, handler)`，不修改原对象。
- 核心 trap：`get/set/has/deleteProperty/apply/construct`。
- 用 `Reflect[method]` 实现默认行为，确保正确性。
- 对比 defineProperty：Proxy 操作级拦截更全面。
- 撤销：`Proxy.revocable()` 返回 `{proxy, revoke}`。

## 延伸问题

1. Proxy 的 `receiver` 参数是什么，什么时候需要用？
2. Proxy 和 `Reflect` 有什么关系？
3. 如何用 Proxy 实现一个只读对象？

## 可能类似的问题及简要参考答案

**Q：Proxy 和 Object.defineProperty 哪个强？**
A：Proxy。可拦截的操作更全面（in、delete、for...of、函数调用等），且能自动拦截新增属性。defineProperty 只能拦截预先定义的属性。

**Q：Proxy 的 set trap 为什么必须返回布尔值？**
A：表示赋值操作的成败。在严格模式下返回 `false` 会抛出 TypeError。

**Q：`proxy === target` 成立吗？**
A：不成立。Proxy 是包装 target 的独立对象，不是 target 本身。

## 辅助记忆总结

记成一句话：Proxy = 对象的"安检门"——过门的每个操作（读写/删除/函数调用）都能被拦截自定义。
