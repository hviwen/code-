# 097. [高级] 类的装饰器（decorator）概念及用法

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

装饰器是一种函数，可以在不修改原类/方法源码的情况下附加行为（日志、缓存、权限检查）。JavaScript 装饰器仍处于 Stage 3 提案阶段，尚未标准化。面试问这个是在考察你是否掌握高阶函数包装、`Object.defineProperty` 属性描述符操作以及 AOP 思想。

一句话答法：装饰器是接收 `target, name, descriptor` 并返回新 descriptor 的函数，用于横切关注点（日志、权限、缓存），JS 中目前通过高阶函数手动应用。

## 问题意图

1. 是否理解装饰器的本质——高阶函数包装，而不是"魔法语法"。
2. 是否知道 JS 原生装饰器（`@`）还是提案，生产中用高阶函数模拟。
3. 是否能写出实用的方法装饰器：日志、缓存、重试等。
4. 是否了解装饰器和 AOP（面向切面编程）的关系。

## 考察范围

- 装饰器的定义：接收 `target, name, descriptor` 返回 descriptor 的函数。
- 方法装饰器：替换 `descriptor.value` 实现包装。
- 属性描述符的结构：`{ value, writable, enumerable, configurable }`。
- 装饰器工厂：带参数的装饰器（如 `@log('info')`）。
- 类装饰器：接收类构造函数，返回新类。
- JS `@` 装饰器提案状态（Stage 3）和 Babel/TypeScript 实验支持。
- 高阶函数模拟装饰器。

## 技术错误纠正

- 原始代码使用 `Object.getOwnPropertyDescriptor` + `Object.defineProperty` 手动应用装饰器——这是模拟装饰器的正确方式。
- 注意：JS 原生 `@` 装饰器提案目前 Stage 3，TypeScript 有 `experimentalDecorators` 但行为与提案有差异（TypeScript 使用旧版）。

## 知识点系统梳理

### 装饰器函数签名

```js
// 方法装饰器
function decorator(target, propertyName, descriptor) {
  // target: 类的 prototype（实例方法）或类本身（静态方法）
  // propertyName: 方法名
  // descriptor: 属性描述符 { value, writable, enumerable, configurable }

  const original = descriptor.value
  descriptor.value = function (...args) {
    console.log(`called ${propertyName} with`, args)
    return original.apply(this, args)
  }
  return descriptor
}
```

### 手动应用装饰器（JS 实现方式）

```js
class Calculator {
  add(a, b) { return a + b }
}

// 手动应用装饰器
const desc = Object.getOwnPropertyDescriptor(Calculator.prototype, 'add')
decorator(Calculator.prototype, 'add', desc)
Object.defineProperty(Calculator.prototype, 'add', desc)
```

### 装饰器工厂（带参数）

```js
function log(level = 'info') {
  return function(target, name, descriptor) {
    const original = descriptor.value
    descriptor.value = function (...args) {
      console.log(`[${level}] ${name} called`)
      return original.apply(this, args)
    }
    return descriptor
  }
}

// 应用时传入参数
// @log('warn')  // 原生语法
```

### 类装饰器（接收类，返回类）

```js
function singleton(Class) {
  let instance = null
  return class extends Class {
    constructor(...args) {
      if (instance) return instance
      super(...args)
      instance = this
    }
  }
}

// const SingletonService = singleton(ServiceClass)
```

### 实用装饰器示例

```js
// 日志
function logMethod(target, name, desc) {
  const orig = desc.value
  desc.value = function (...args) {
    console.log(`${name}() args:`, args)
    const result = orig.apply(this, args)
    console.log(`${name}() result:`, result)
    return result
  }
}

// 缓存/记忆化
function memoize(target, name, desc) {
  const orig = desc.value
  const cache = new Map()
  desc.value = function (...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = orig.apply(this, args)
    cache.set(key, result)
    return result
  }
}

// 重试
function retry(maxAttempts = 3) {
  return function(target, name, desc) {
    const orig = desc.value
    desc.value = async function (...args) {
      for (let i = 1; i <= maxAttempts; i++) {
        try { return await orig.apply(this, args) }
        catch (e) { if (i === maxAttempts) throw e }
      }
    }
  }
}

// 执行时间
function timing(target, name, desc) {
  const orig = desc.value
  desc.value = function (...args) {
    const start = performance.now()
    const result = orig.apply(this, args)
    console.log(`${name}: ${performance.now() - start}ms`)
    return result
  }
}
```

## 实战应用举例

### 示例 1：手动给类加日志和缓存

```js
class UserService {
  async fetchUser(id) {
    // 模拟请求
    return { id, name: 'User' + id }
  }

  async saveUser(data) {
    return { success: true, id: data.id }
  }
}

// 手动装饰
const methods = ['fetchUser', 'saveUser']
for (const method of methods) {
  const desc = Object.getOwnPropertyDescriptor(UserService.prototype, method)
  if (desc) {
    logMethod(UserService.prototype, method, desc)
    Object.defineProperty(UserService.prototype, method, desc)
  }
}
```

### 示例 2：权限检查装饰器

```js
function requirePermission(permission) {
  return function(target, name, desc) {
    const orig = desc.value
    desc.value = function (...args) {
      if (!this.user?.permissions?.includes(permission)) {
        throw new Error(`Permission denied: ${permission}`)
      }
      return orig.apply(this, args)
    }
  }
}
```

## 使用场景说明和对比

| 场景 | 是否适合装饰器 | 原因 |
| --- | --- | --- |
| 日志/监控 | 非常适合 | 横切关注点，不改业务逻辑 |
| 缓存/记忆化 | 适合 | 透明的性能优化 |
| 权限/认证检查 | 适合 | 和业务逻辑分离 |
| 重试/降级 | 适合 | 不影响核心逻辑 |
| 参数验证 | 适合 | 干净分离 |
| 修改返回值类型 | 不太适合 | 可能影响类型契约 |

vs 其他方案：

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| 装饰器 | 声明式、可组合、复用 | 提案阶段、嵌套复杂 |
| 高阶函数包装 | 灵活、无语法依赖 | 调用处代码较长 |
| Proxy | 可拦截任意操作 | 性能开销 |
| Mixin | 可组合多行为 | 命名冲突 |

## 易错点提示

- JS 原生 `@` 装饰器还是 Stage 3 提案，不要在生产代码中直接使用——用 `babel`/`TypeScript` 实验支持。
- 装饰器在模块加载时执行（类定义时），不是运行时。不能在装饰器里访问实例属性。
- 方法装饰器的 `descriptor.value` 替换后，原始函数通过闭包持有，避免 `this` 丢失。
- 多个装饰器顺序：从下到上（靠近类的先执行工厂函数，再从上到下执行包装逻辑）。
- 类装饰器返回新类而不是修改原类，注意原型链和静态成员的保留。

## 记忆要点总结

- 装饰器 = 接收 `(target, name, descriptor)` 返回 descriptor 的高阶函数。
- 通用模式：存原始 → 替换新函数（包一层）→ 返回 descriptor。
- 使用场景：日志、缓存、权限、重试、计时。
- JS 目前用高阶函数手动应用，`@` 还是提案。

## 延伸问题

1. 装饰器的执行时机是什么时候？类实例化时还是类定义时？
2. 多个装饰器叠加时，执行顺序是怎样的？
3. 装饰器和 HOC（高阶组件）在 React 中的关系是什么？
4. 原生装饰器提案和 TypeScript 的 `experimentalDecorators` 有什么不同？

## 可能类似的问题及简要参考答案

**Q：装饰器的本质是什么？**
A：一个接收目标对象、属性名、属性描述符，返回新描述符的函数。核心是高阶函数包装。

**Q：JS 的 @ 装饰器可以直接用吗？**
A：不建议。JS 装饰器是 Stage 3 提案，生产环境应使用 Babel/TypeScript 实验支持或手动高阶函数。

**Q：装饰器工厂是什么？**
A：返回装饰器函数的函数，用于传递参数。如 `@log('warn')` → `log('warn')` 返回装饰器。

## 辅助记忆总结

记成一句话：装饰器是"在不改类的前提下给方法加料"——存原方法、包新行为、返回 descriptor，`@` 语法还是提案，目前手动包。
