# 017. [中级]** 什么是函数提升（hoisting）？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这道题考察JavaScript的提升机制，面试官想了解你是否理解不同声明方式的提升行为。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：函数与作用域（15道），包括变量提升（var）与函数提升的区别、暂时性死区（TDZ）、let/const 的块级作用域行为，以及提升在 JavaScript 执行上下文中的实现机制。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

使用函数声明的函数，函数会被提升到作用域的顶部，任意位置都可以调用

### 问题本质解读 这道题考察JavaScript的提升机制，面试官想了解你是否理解不同声明方式的提升行为。

### 知识点系统梳理

**提升的类型：**
- **函数声明提升**：整个函数定义被提升
- **变量提升**：只有声明被提升，赋值留在原位置
- **let/const提升**：提升但存在暂时性死区

**提升的执行顺序：**
1. 函数声明
2. 变量声明
3. 函数表达式赋值

### 实战应用举例
```javascript
// 1. 提升机制演示
console.log(hoistedFunc());  // "I'm hoisted!"
console.log(typeof varFunc); // "undefined"
// console.log(letFunc());   // ReferenceError: Cannot access before initialization

function hoistedFunc() {
  return "I'm hoisted!";
}

var varFunc = function() {
  return "I'm a var function";
};

let letFunc = function() {
  return "I'm a let function";
};
```

```javascript
// 2. 复杂提升场景
var a = 1;
function test() {
  console.log(a);        // undefined (不是1!)
  var a = 2;
  console.log(a);        // 2
}

// 等价于：
function test() {
  var a;               // 提升的声明
  console.log(a);      // undefined
  a = 2;               // 原位置的赋值
  console.log(a);      // 2
}
```

### 记忆要点总结
- **函数声明**：完整提升，可在任意位置调用
- **变量声明**：只提升声明，不提升赋值
- **let/const**：提升但有暂时性死区，不能提前访问
- **实际影响**：理解提升有助于避免意外的undefined错误

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

**代码组织建议：**

| 声明方式 | 提升行为 | 推荐场景 | 避免场景 |
|---------|---------|---------|---------|
| `function` 声明 | 完整提升（可提前调用） | 模块入口、递归、互相调用 | 块级条件分支 |
| `var` | 变量提升（值undefined） | 兼容ES5的老项目 | 新项目（使用let/const） |
| `let` / `const` | TDZ，声明前不可访问 | 现代项目首选 | 不需要块级作用域的场景 |

**常见场景：**
- 函数声明最适用于模块级别互相调用的工具函数集。
- 使用 `const f = () => {}` 可避免提升带来的意外引用，缺点是失去了提升，调用顺序严格受定义位置约束。

## 易错点提示

1. 提升不是“代码被物理移动”，而是执行上下文创建阶段先登记声明。
2. `var` 只提升声明，不提升赋值，所以访问结果是 `undefined`。
3. `let` 和 `const` 也会被登记，但初始化前处于暂时性死区，访问会报 `ReferenceError`。
4. 函数声明会整体提升，函数表达式不会整体提升。
5. 同名声明会让代码可读性变差，尤其是 `var` 和函数声明混用时容易误判输出。

## 记忆要点总结

- 提升发生在执行上下文创建阶段。
- `function`：声明和值一起可用。
- `var`：只有名字可用，值是 `undefined`。
- `let/const`：名字被登记，但初始化前不能访问。
- 新项目优先 `const` / `let`，减少提升带来的隐式行为。

## 延伸问题

1. 为什么 `typeof undeclared` 不报错，但 `typeof letVar` 在 TDZ 中会报错？
2. 函数声明和变量声明同名时，最终访问到的是什么？
3. ES Module 顶层作用域和普通脚本顶层作用域有什么区别？

## 可能类似的问题及简要参考答案

**Q：`let` / `const` 有没有提升？**  
A：有声明登记，但初始化前处于暂时性死区，所以不能像 `var` 一样提前访问。

**Q：为什么函数声明可以写在调用后面？**  
A：函数声明在执行上下文创建阶段会把函数对象绑定到标识符上，执行阶段调用时已经可用。

## 辅助记忆总结

一句话记：函数“整包提升”，`var`“只提名字”，`let/const`“登记但锁住”。
