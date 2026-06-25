# 027. [中级] 函数的 `length` 属性表示什么？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

函数的 `length` 表示函数声明中“期望接收的形参个数”，不是实际传入参数个数。它只统计第一个默认参数之前的形参，不包含剩余参数。

一句话答法：`fn.length` 看函数定义，`arguments.length` 或 `args.length` 看调用时实际传了几个。

## 问题意图

这道题想确认你是否知道函数也是对象，并能处理默认参数、剩余参数、解构参数、`bind` 后函数长度这些边界。

## 考察范围

- 函数对象的 `length` 属性。
- 默认参数对 `length` 的截断影响。
- 剩余参数不计入 `length`。
- 解构参数算作一个参数。
- `bind` 后函数 `length` 的变化。
- `fn.length` 与 `arguments.length` 的区别。

## 技术错误纠正

原始答案“表示参数个数”太泛。准确说法是：表示函数定义时第一个带默认值参数之前的形参数量，不表示实际调用时传入的参数数量。

## 知识点系统梳理

```js
function a(x, y, z) {}
console.log(a.length) // 3

function b(x, y = 1, z) {}
console.log(b.length) // 1

function c(x, ...rest) {}
console.log(c.length) // 1

function d({ id }, name) {}
console.log(d.length) // 2
```

对比：

| 表达式 | 含义 | 时机 |
| --- | --- | --- |
| `fn.length` | 形参期望个数 | 函数定义时确定 |
| `arguments.length` | 实际传入个数 | 函数调用时确定 |
| `args.length` | 剩余参数数组长度 | 函数调用时确定 |

## 实战应用举例

### 示例 1：区分定义参数和实际参数

```js
function log(a, b = 'default', ...rest) {
  console.log(log.length)
  console.log(arguments.length)
  console.log(rest.length)
}

log(1, 2, 3, 4)
// log.length: 1
// arguments.length: 4
// rest.length: 2
```

这个例子证明：`length` 不适合判断调用者实际传了几个参数。

### 示例 2：根据函数形参数量做简单适配

```js
function runMiddleware(fn, context, next) {
  if (fn.length >= 2) {
    return fn(context, next)
  }

  const result = fn(context)
  return result ?? next()
}
```

这种写法在中间件、测试框架或兼容旧 API 时会见到，但要小心默认参数会改变 `length`。

## 使用场景说明和对比

| 场景 | 是否适合用 `fn.length` | 原因 |
| --- | --- | --- |
| 框架兼容不同回调签名 | 可以 | 例如区分 `(ctx)` 和 `(ctx, next)` |
| 判断实际传参个数 | 不适合 | 应使用 `arguments.length` 或剩余参数 |
| 校验业务必填参数 | 不推荐 | 默认参数、解构、TS 类型更可靠 |
| 手写 curry | 可以但有限 | 默认参数和 rest 会影响判断 |

## 易错点提示

- 默认参数会让 `length` 在第一个默认参数处停止统计。
- 剩余参数 `...rest` 不计入 `length`。
- 解构参数整体算一个形参。
- `bind` 预置参数后，返回函数的 `length` 会减少。
- `fn.length` 是函数对象属性，不是数组长度。

## 记忆要点总结

- `fn.length` = 函数“期望”的形参数量。
- 它不等于实际传参个数。
- 第一个默认参数之后都不计。
- rest 参数不计。
- 框架可以用它做签名适配，但业务校验别依赖它。

## 延伸问题

1. 默认参数为什么会影响函数 `length`？
2. `bind` 之后函数 `length` 如何变化？
3. `fn.length` 和 `arguments.length` 有什么区别？
4. 手写 curry 时依赖 `fn.length` 有什么问题？
5. 解构参数在 `length` 中如何统计？

## 可能类似的问题及简要参考答案

**Q：`function f(a, b = 1, c) {}` 的 `f.length` 是多少？**  
A：是 1，因为只统计第一个默认参数之前的形参。

**Q：`function f(a, ...rest) {}` 的 `f.length` 是多少？**  
A：是 1，剩余参数不计入 `length`。

**Q：实际传了几个参数应该看什么？**  
A：普通函数里看 `arguments.length`，现代写法通常用剩余参数 `args.length`。

## 辅助记忆总结

记成一句话：`fn.length` 看“定义时想要几个”，不是“调用时给了几个”。
