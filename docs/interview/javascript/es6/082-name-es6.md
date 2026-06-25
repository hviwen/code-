# 082. [中级]** 函数的`name`属性在ES6中的变化

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

ES6 统一并增强了函数的 `name` 属性：匿名函数表达式可以根据赋值上下文推断出名称，绑定函数加 `"bound "` 前缀，`Symbol` 键方法用 `[描述]` 表示。核心价值是让调试日志、错误堆栈和函数注册系统自动拿到有意义的函数名。

一句话答法：ES5 中匿名函数表达式的 `name` 是空字符串，ES6 改为根据变量名/属性名自动推断，绑定函数加 `"bound "` 前缀。

## 问题意图

这道题考察三件事：

1. 是否知道 ES6 之前匿名函数 `name` 为空的问题。
2. 是否能列举不同函数形式（声明、表达式、箭头、绑定、Symbol 键）的 `name` 取值规则。
3. 是否理解 `name` 属性在调试和元编程中的实际用途。

## 考察范围

- 函数声明、函数表达式、箭头函数的 `name` 取值。
- `bind()` 返回函数的 `name` 前缀规则。
- 对象方法简写、计算属性名、Symbol 键方法的 `name`。
- `name` 属性的可配置性（configurable 但不可 writable）。
- 调试、日志、函数注册等实际应用。

## 知识点系统梳理

### 各种函数形式的 name 取值

```js
// 函数声明
function foo() {}
foo.name // 'foo'

// 具名函数表达式——name 取函数自身名，不取变量名
const bar = function baz() {}
bar.name // 'baz'

// 匿名函数表达式——ES6 推断变量名
const fn = function() {}
fn.name // 'fn'（ES5 中为 ''）

// 箭头函数
const arrow = () => {}
arrow.name // 'arrow'

// 对象方法简写
const obj = { greet() {} }
obj.greet.name // 'greet'

// bind
const bound = foo.bind(null)
bound.name // 'bound foo'

// new Function
const dynamic = new Function()
dynamic.name // 'anonymous'

// Symbol 键方法
const sym = Symbol('myMethod')
const obj2 = { [sym]() {} }
obj2[sym].name // '[myMethod]'
```

### name 推断规则汇总

| 函数形式 | `name` 值 | 说明 |
| --- | --- | --- |
| `function foo() {}` | `'foo'` | 声明名 |
| `const f = function() {}` | `'f'` | ES6 推断变量名 |
| `const f = function g() {}` | `'g'` | 具名表达式优先取自身名 |
| `const f = () => {}` | `'f'` | 箭头函数推断变量名 |
| `{ method() {} }` | `'method'` | 对象方法简写 |
| `foo.bind(null)` | `'bound foo'` | 加 `bound ` 前缀 |
| `new Function()` | `'anonymous'` | 固定值 |
| `export default function() {}` | `'default'` | 默认导出 |
| `{ [Symbol('x')]() {} }` | `'[x]'` | Symbol 描述加方括号 |

### name 属性的特殊性质

```js
const fn = function() {}

// name 不可直接赋值（non-writable）
fn.name = 'other'
console.log(fn.name) // 'fn'（赋值静默失败）

// 但可以通过 defineProperty 修改（configurable）
Object.defineProperty(fn, 'name', { value: 'custom' })
console.log(fn.name) // 'custom'
```

## 实战应用举例

### 示例 1：利用 name 实现函数调试包装器

这个例子证明：`name` 属性让包装后的函数在日志中仍然可识别。

```js
function withLogging(fn) {
  return function(...args) {
    console.log(`→ ${fn.name}(${args.join(', ')})`)
    const result = fn(...args)
    console.log(`← ${fn.name} = ${result}`)
    return result
  }
}

function add(a, b) { return a + b }
const loggedAdd = withLogging(add)
loggedAdd(2, 3)
// → add(2, 3)
// ← add = 5
```

边界说明：
- 如果传入匿名函数，`fn.name` 可能是空字符串，日志会不够清晰。
- 包装后的函数自身 `name` 是空字符串（匿名函数表达式），可用 `Object.defineProperty` 修正。

### 示例 2：函数注册表自动命名

```js
const registry = new Map()

function register(fn) {
  const name = fn.name || `fn_${registry.size}`
  if (registry.has(name)) {
    throw new Error(`Function "${name}" already registered`)
  }
  registry.set(name, fn)
}

register(function validate() {})
register(function transform() {})

console.log([...registry.keys()]) // ['validate', 'transform']
```

## 使用场景说明和对比

| 场景 | `name` 属性是否有用 | 说明 |
| --- | --- | --- |
| 错误堆栈和调试 | 有用 | 匿名函数有名字后堆栈更可读 |
| 日志和性能追踪 | 有用 | 自动记录函数名，无需手动传字符串 |
| 函数注册/中间件系统 | 有用 | 自动用函数名作为注册键 |
| 运行时逻辑判断 | 不推荐 | `name` 可被压缩工具改名，不可靠 |
| 序列化/持久化函数标识 | 不推荐 | 构建后函数名不稳定 |

## 易错点提示

- 具名函数表达式 `const f = function g() {}` 的 `name` 是 `'g'` 不是 `'f'`。
- `bind()` 的结果 `name` 是 `'bound 原名'`，不是原名本身，字符串比较会失败。
- 生产环境代码经过压缩后，函数名可能变成 `a`、`b` 等，不能依赖 `name` 做运行时逻辑。
- `name` 是 non-writable 的，直接赋值静默失败，必须用 `Object.defineProperty`。
- `new Function()` 的 `name` 固定是 `'anonymous'`，不会根据变量名推断。

## 记忆要点总结

- ES6 让匿名函数表达式根据变量名/属性名自动推断 `name`。
- 具名表达式优先取自身名，不取变量名。
- `bind()` 加 `'bound '` 前缀，`new Function()` 固定 `'anonymous'`。
- `name` 是 configurable 但 non-writable，只能通过 `defineProperty` 改。
- 生产环境压缩后函数名不稳定，不能用于运行时逻辑判断。

## 延伸问题

1. `const f = function g() {}` 中，`f.name` 是 `'f'` 还是 `'g'`？为什么？
2. 经过 `bind` 两次的函数，`name` 是什么？
3. 为什么不能依赖 `name` 属性做运行时分支判断？
4. 如何让装饰器包装后的函数保留原函数名？

## 可能类似的问题及简要参考答案

**Q：ES5 中匿名函数的 `name` 是什么？**
A：空字符串 `''`。ES6 改为根据赋值上下文推断。

**Q：`name` 属性可以修改吗？**
A：直接赋值不行（non-writable），但可以用 `Object.defineProperty` 修改（configurable）。

**Q：箭头函数有 `name` 属性吗？**
A：有。箭头函数的 `name` 根据赋值的变量名推断，规则和匿名函数表达式一致。

**Q：`function.name` 在调试中有什么作用？**
A：让错误堆栈、console 日志、性能追踪中显示有意义的函数名，而不是 `<anonymous>`。

## 辅助记忆总结

记成一句话：ES6 让每个函数都有名字——声明看函数名、表达式看变量名、绑定加 `bound` 前缀。
