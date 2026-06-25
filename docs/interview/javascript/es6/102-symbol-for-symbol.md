# 102. [中级] Symbol.for() 和 Symbol() 的区别

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

`Symbol()` 每次创建**本地唯一**的 Symbol，`Symbol.for(key)` 在**全局注册表**中按 key 查找/创建 Symbol——相同 key 返回同一值。区别的核心是"全局共享" vs "本地唯一"。

一句话答法：`Symbol()` 创建唯一值，不同调用即使描述相同也不相等；`Symbol.for(key)` 在全局注册表中按 key 存取，相同 key 返回同一个 Symbol，支持跨模块共享。

## 问题意图

1. 是否知道 `Symbol()` 和 `Symbol.for()` 在**相等性**上的根本区别。
2. 是否理解全局注册表的作用及 `Symbol.keyFor()` 的用法。
3. 是否能根据场景选择合适的创建方式。

## 考察范围

- `Symbol()`：每次创建新值，唯一性保证。
- `Symbol.for(key)`：全局注册表查找/创建，相同 key 返回同一值。
- `Symbol.keyFor(sym)`：查询全局 Symbol 的 key，非全局返回 `undefined`。
- 跨模块/跨 realm 共享：`Symbol.for` 可在不同模块甚至 iframe 间共享。
- 描述（description） vs 注册 key 的区别。
- 非全局 Symbol 不能通过 `Symbol.keyFor` 查询。

## 技术错误纠正

- "`Symbol.for('x')` 和 `Symbol('x')` 只是作用域不同"——不仅仅是作用域，`Symbol.for('x')` 和 `Symbol('x')` 完全不相等，即使描述相同。
- `Symbol.keyFor()` 只能查 `Symbol.for()` 创建的，对 `Symbol()` 返回 `undefined`。

## 知识点系统梳理

### 核心区别

```js
// Symbol()：本地唯一
const a = Symbol('key')
const b = Symbol('key')
a === b  // false

// Symbol.for()：全局共享
const c = Symbol.for('key')
const d = Symbol.for('key')
c === d  // true

// 混合比较
const e = Symbol('key')
const f = Symbol.for('key')
e === f  // false（即便 "描述" 和 "key" 相同）
```

### 完整对比表

| 对比项 | `Symbol()` | `Symbol.for()` |
| --- | --- | --- |
| 唯一性 | 每次调用都唯一 | 相同 key 同一值 |
| 全局注册表 | 不写入 | 写入全局注册表 |
| 跨模块共享 | 需导出变量 | 相同 key 自动共享 |
| `keyFor()` | `undefined` | 返回注册 key |
| `description` | 等于传入的描述 | 等于传入的 key |
| 用途 | 模块内唯一标识 | 跨模块协议/常量 |

### 跨 realm 共享

```js
// iframe 内外共享
const s = Symbol.for('shared')
// 另一个 iframe 或 worker 中
Symbol.for('shared') === s  // true（同一全局注册表）

// 而 Symbol() 在不同 realm 间完全不相关
```

## 实战应用举例

### 示例 1：跨模块事件系统

```js
// events.js
export const EVENTS = {
  LOGIN: Symbol.for('app.login'),
  LOGOUT: Symbol.for('app.logout'),
}

// auth.js
import { EVENTS } from './events.js'
emitter.on(EVENTS.LOGIN, user => console.log('login', user))

// another-module.js 也可以用相同的 Symbol.for 订阅
emitter.on(Symbol.for('app.login'), user => console.log('also login', user))
```

### 示例 2：插件钩子

```js
export const HOOKS = {
  BEFORE_INIT: Symbol.for('plugin.beforeInit'),
  AFTER_INIT: Symbol.for('plugin.afterInit'),
}

class PluginSystem {
  hooks = new Map()
  register(name, hook, fn) {
    if (!this.hooks.has(hook)) this.hooks.set(hook, [])
    this.hooks.get(hook).push(fn)
  }
  async run(hook, ctx) {
    for (const fn of this.hooks.get(hook) || []) await fn(ctx)
  }
}
```

## 使用场景说明和对比

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| 模块内部私有键 | `Symbol()` | 不需要跨模块共享 |
| 跨模块共享常量/协议 | `Symbol.for()` | 相同 key 自动等值 |
| 枚举常量 | `Symbol()` 或 `Symbol.for()` | 模块内用前者，跨模块用后者 |
| 避免全局注册表污染 | `Symbol()` | 不会意外覆盖已有 key |

## 易错点提示

- `Symbol.for('x')` 和 `Symbol('x')` 不相等，和描述无关，和注册表有关。
- `Symbol.keyFor()` 只适用于 `Symbol.for()` 创建的条目，对 `Symbol()` 返回 `undefined`。
- 全局注册表是跨 realm 的（iframe、worker 等共享同一个注册表）。
- `Symbol.for` 的 key 冲突风险——不同库可能意外使用相同 key 导致值重叠。
- `description` 和 `keyFor` 的 key 是两回事：`Symbol('foo')` 的 description 是 `'foo'`，但 `keyFor` 返回 `undefined`。

## 记忆要点总结

- `Symbol()` = 本地唯一，每次新值。
- `Symbol.for(key)` = 全局共享，相同 key 同一值。
- `keyFor` 只查全局，对本地 Symbol 返回 `undefined`。
- 选型：模块内用 `Symbol()`，跨模块用 `Symbol.for()`。

## 延伸问题

1. 全局 Symbol 注册表在不同 iframe 中共享吗？
2. 为什么 `Symbol.keyFor(Symbol('x'))` 返回 `undefined`？
3. 如何避免 `Symbol.for` 的 key 冲突问题？

## 可能类似的问题及简要参考答案

**Q：`Symbol.for('foo')` 和 `Symbol('foo')` 哪个是全局的？**
A：`Symbol.for('foo')` 是全局的，`Symbol('foo')` 是本地的。

**Q：如何检查一个 Symbol 是否在全局注册表中？**
A：用 `Symbol.keyFor(sym)`，返回非 `undefined` 的 key 说明已注册。

**Q：两个模块如何共享同一个 Symbol？**
A：两种方式：1) 一个模块导出 Symbol 变量，另一模块导入；2) 双方约定相同的 key 各自调用 `Symbol.for(key)`。

## 辅助记忆总结

记成一句话：`Symbol()` 是"我自己的唯一钥匙"，`Symbol.for()` 是把钥匙放公共柜子——相同标签就拿同一把。
