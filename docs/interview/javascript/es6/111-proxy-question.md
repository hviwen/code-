# 111. [高级] Proxy 的典型应用场景？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

Proxy 的核心价值是对对象操作的**完全拦截能力**。典型场景包括：数据验证（set trap）、属性隐藏（get/has trap）、日志追踪、只读/冻结、懒加载、链式调用、响应式系统（Vue 3 核心机制）。

一句话答法：Proxy 用于数据校验、访问控制（权限/隐藏）、日志调试、响应式系统（Vue 3 reactivity）、只读对象、懒初始化、撤销代理等场景。

## 问题意图

1. 能否说出 3 个以上 Proxy 的实际应用场景，并解释为什么用 Proxy 而不用其他方案。
2. 是否了解 Vue 3 的 reactivity 基于 Proxy 实现——能自动拦截新增属性、数组变异。
3. 是否能写出 Proxy 实现只读对象或访问控制的具体代码。

## 考察范围

- 数据校验：`set` trap 拦截赋值做类型/范围检查。
- 访问控制：`get/has` trap 隐藏私有属性、权限控制。
- 日志/监控：所有 trap 中记录操作日志。
- 只读对象：`set/deleteProperty` trap 抛出错误。
- 懒初始化：第一次访问属性时才计算/加载。
- 链式调用：`get` trap 返回函数形成方法链。
- 响应式系统：Vue 3 `reactive()` 的核心——读写拦截触发依赖收集。
- 撤销代理：`Proxy.revocable` 保存/恢复权限管控。

## 技术错误纠正

- "Proxy 可以替代 getter/setter"——Proxy 能做更多：getter/setter 只能拦截已定义的属性，Proxy 可拦截新增属性和数组操作。
- "Proxy 在 Vue 2 中也能用"——Vue 2 使用的是 `Object.defineProperty`，Vue 3 才改用 Proxy。

## 知识点系统梳理

### 场景 1：数据校验

```js
const validated = new Proxy({}, {
  set(target, prop, value) {
    if (prop === 'age') {
      if (typeof value !== 'number') throw new TypeError('age must be number')
      if (value < 0 || value > 150) throw new RangeError('age out of range')
    }
    if (prop === 'email' && !/@/.test(value)) throw new Error('invalid email')
    return Reflect.set(target, prop, value)
  }
})
```

### 场景 2：只读/防卫式对象

```js
function readonly(obj) {
  return new Proxy(obj, {
    set() { throw new Error('readonly') },
    deleteProperty() { throw new Error('readonly') },
    defineProperty() { throw new Error('readonly') },
    setPrototypeOf() { throw new Error('readonly') },
  })
}

const config = readonly({ db: 'prod', port: 5432 })
config.port = 8080 // Error: readonly
```

### 场景 3：懒初始化（延迟计算）

```js
const lazy = new Proxy({}, {
  get(target, prop) {
    if (!(prop in target)) {
      console.log(`initializing ${String(prop)}...`)
      target[prop] = expensiveComputation(prop)
    }
    return target[prop]
  }
})

// 第一次访问才计算
lazy.data   // 日志: initializing data... → 计算结果
lazy.data   // 直接返回缓存值
```

### 场景 4：链式调用

```js
const chain = new Proxy({}, {
  get(target, prop) {
    if (prop === 'end') return () => target
    target[prop] ??= []
    target[prop].push(Date.now())
    return chain // 返回 Proxy 自身形成链
  }
})

chain.a.b.c.end()
// target = { a: [time1], b: [time1], c: [time1] }
```

### 场景 5：响应式系统（简化 Vue 3）

```js
function reactive(obj, onChange) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      track(target, prop)  // 依赖收集
      return Reflect.get(target, prop, receiver)
    },
    set(target, prop, value, receiver) {
      const old = target[prop]
      const result = Reflect.set(target, prop, value, receiver)
      if (old !== value) onChange(prop, value)
      return result
    }
  })
}
```

### 场景 6：撤销代理（权限收回）

```js
const { proxy, revoke } = Proxy.revocable(
  { apiKey: 'secret' },
  { get: (t, p) => p in t ? t[p] : undefined }
)

proxy.apiKey  // 'secret'
revoke()
proxy.apiKey  // TypeError（已撤销）
```

## 实战应用举例

### 场景 7：访问日志（审计）

```js
function audit(obj, name) {
  return new Proxy(obj, {
    get(t, p, r) {
      console.log(`[audit] ${name}.${String(p)} accessed`)
      return Reflect.get(t, p, r)
    },
    set(t, p, v, r) {
      console.log(`[audit] ${name}.${String(p)} = ${v}`)
      return Reflect.set(t, p, v, r)
    }
  })
}

const user = audit({ name: 'Alice', role: 'admin' }, 'user')
user.name   // [audit] user.name accessed
user.role = 'user' // [audit] user.role = user
```

## 使用场景说明和对比

| 场景 | Proxy 适合 | 替代方案 |
| --- | --- | --- |
| 数据校验 | ✅ 自动拦截所有赋值 | 手动校验函数 |
| 只读对象 | ✅ 全方位保护 | Object.freeze（浅层） |
| 响应式系统 | ✅ 全面拦截，新增属性自动追踪 | Object.defineProperty（需预定义） |
| 懒初始化 | ✅ 按需计算 | 工厂函数 + getter |
| 撤销访问 | ✅ Proxy.revocable | 手动状态控制 |
| 属性隐藏 | ✅ get/has 拦截 | Symbol/# 私有字段 |

## 易错点提示

- Proxy trap 中的 `receiver` 和 `this` 指向可能不一致——用 `Reflect[method]` 保持上下文正确。
- Proxy 不会拦截 `Object.keys()` 中 Symbol 键和不可枚举属性——除非 `ownKeys` trap 配合 `getOwnPropertyDescriptor`。
- 递归代理：如果对象属性也是对象，需要递归创建 Proxy（如 Vue 3 的 `reactive`）。
- `Proxy.revocable()` 撤销后不能恢复，需要重新创建。
- Proxy 性能有开销，不适合对性能极度敏感的代码路径。

## 记忆要点总结

- 六大典型：校验、只读、日志、懒初始化、响应式、撤销。
- Proxy 优势：操作级拦截、新增属性自动处理、数组原生支持。
- 注意：递归代理（嵌套对象）、receiver、性能开销。

## 延伸问题

1. Vue 3 的 `reactive` 如何用 Proxy 实现深度响应式？
2. 如何用 Proxy 实现一个负索引数组？
3. Proxy 能拦截函数的 `call/apply/bind` 吗？`apply` trap 能否处理所有情况？

## 可能类似的问题及简要参考答案

**Q：Vue 3 为什么从 Object.defineProperty 换成 Proxy？**
A：Proxy 能拦截新增属性、数组索引/长度变化、delete 操作，不需要 Vue 2 的 `Vue.set/Vue.delete` 特殊处理。

**Q：如何实现一个深度只读对象？**
A：Proxy 的 `get` trap 中递归对返回的对象值也包装为只读 Proxy。结合 `Reflect.get` 的返回值判断是否对象。

**Q：Proxy 能检测数组 `push` 操作吗？**
A：能。`push` 会触发 `set`（设置 length 和新索引）和 `get`（读取原 length），Proxy 都能拦截。

## 辅助记忆总结

记成一句话：Proxy 像一个万能中间件——拦截所有对象的操作实现校验/只读/日志/响应式，Vue 3 用它做到了 Vue 2 做不到的。
