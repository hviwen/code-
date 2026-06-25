# 058. [中级] 箭头函数没有哪些特性？

> 来源：`docs/javascript/js_interview_questions_part_2.md`

## 问题本质解读

箭头函数是更轻量的函数表达式，因此少了一些普通函数具备的运行时能力：自己的 `this`、`arguments`、`prototype`、构造调用能力，以及自己的 `super`、`new.target`。

一句话回答：箭头函数适合短回调，不适合需要动态上下文、构造实例或读取 `arguments` 的场景。

## 问题意图

面试官想确认你能从“缺什么”推导出“哪里不能用”，而不是只背一串名词。

## 考察范围

- 词法 `this`。
- rest 参数替代 `arguments`。
- 构造函数和 `prototype`。
- `super`、`new.target` 的使用前提。
- 对象方法、类方法、回调中的实际影响。

## 技术错误纠正

`augments` 应改为 `arguments`。

“没有函数提升”不严谨。箭头函数通常写成变量保存的函数表达式，变量声明规则取决于 `const/let/var`，但函数值不会像函数声明那样提前可调用。

## 知识点系统梳理

| 缺失特性 | 影响 | 替代方案 |
| --- | --- | --- |
| 自己的 `this` | 不能做动态 `this` 方法 | 普通函数 |
| `arguments` | 不能直接读实参列表 | `(...args)` |
| `prototype` | 不能挂原型方法 | 普通函数或 class |
| `[[Construct]]` | 不能 `new` | class 或普通构造函数 |
| 自己的 `super`/`new.target` | 不适合构造/继承语义 | class 方法或普通函数 |

## 实战应用举例

```js
const sum = (...numbers) => numbers.reduce((total, n) => total + n, 0)

console.log(sum(1, 2, 3)) // 6
```

箭头函数没有 `arguments`，变参场景直接用 rest 参数，得到的是真数组。

```js
const fn = () => {}

console.log(fn.prototype) // undefined
new fn() // TypeError
```

这个例子证明：没有 `prototype` 和构造能力，就不能把箭头函数当构造器。

## 使用场景说明和对比

| 场景 | 箭头函数问题 | 推荐 |
| --- | --- | --- |
| 对象方法依赖 `this` | `this` 不指向对象 | 普通方法 |
| 原型方法 | 无动态实例 `this` | 普通函数 |
| 构造实例 | 不能 `new` | class |
| 读取全部实参 | 无 `arguments` | rest 参数 |
| 数组回调 | 无明显问题 | 箭头函数 |

## 易错点提示

- “没有自己的 `this`”不等于不能读取 `this`，而是读取外层的。
- rest 参数是真数组，`arguments` 是类数组。
- 箭头函数不能用作 generator，也不能写 `function*` 那类语义。
- 不要在需要 `new.target` 判断构造调用时使用箭头函数。

## 记忆要点总结

- 无 `this`：借外层。
- 无 `arguments`：用 rest。
- 无 `prototype`：不能造实例。
- 无构造能力：不能 `new`。

## 延伸问题

为什么 rest 参数比 `arguments` 更适合现代代码？

参考答案：rest 参数是真数组，可以直接使用 `map/reduce/filter`；它还能和命名参数组合，语义比类数组 `arguments` 更清楚。

## 可能类似的问题及简要参考答案

问：箭头函数能不能访问外层函数的 `arguments`？

答：可以沿作用域链读取外层普通函数的 `arguments`，但这通常不如显式 rest 参数清晰。

问：箭头函数为什么没有 `prototype`？

答：它本来就不是构造函数，不需要通过 `prototype` 给实例提供原型方法。

## 辅助记忆总结

记成一句话：箭头函数少了“动态上下文”和“造对象”那套能力。
