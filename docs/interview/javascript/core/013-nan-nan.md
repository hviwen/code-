# 013. [初级]** 什么是NaN？如何检测一个值是否为NaN？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这道题考察JavaScript中特殊数值NaN的性质，面试官想了解你是否理解NaN的特殊性和正确的检测方法。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：数据类型与变量（15道）。

## 技术错误纠正

1. "内置函数的将值进行一步类型转化"表述不清楚，应该说明isNaN会先转换为数字
2. 缺少NaN === NaN返回false的原因说明

## 知识点系统梳理

NaN是number类型的数据，表示计算错误的值，NaN不等于任何值

可以通过内置函数 isNaN来判断是否是NaN，也可以通过Number.isNaN 来判断

区别是：内置函数的将值进行一步类型转化，只要不是number类型的都是NaN，Number.isNaN 只判断是否是NaN这个值

### 问题本质解读 这道题考察JavaScript中特殊数值NaN的性质，面试官想了解你是否理解NaN的特殊性和正确的检测方法。

### 技术错误纠正
1. "内置函数的将值进行一步类型转化"表述不清楚，应该说明isNaN会先转换为数字
2. 缺少NaN === NaN返回false的原因说明

### 知识点系统梳理

**NaN的特殊性质：**
- NaN !== NaN（唯一不等于自身的值）
- typeof NaN === 'number'
- NaN参与的任何数学运算都返回NaN
- 表示"Not a Number"，但类型仍是number

**检测方法对比：**
- **isNaN()** - 会进行类型转换，不够精确
- **Number.isNaN()** - 严格检测，推荐使用
- **Object.is()** - 可以正确比较NaN

### 实战应用举例
```javascript
// 1. NaN检测方法对比
console.log(isNaN('hello'));        // true - 先转换为NaN
console.log(Number.isNaN('hello')); // false - 严格检测
console.log(Number.isNaN(NaN));     // true - 只有真正的NaN

console.log(NaN === NaN);           // false - 特殊性质
console.log(Object.is(NaN, NaN));   // true - 正确比较
```

```javascript
// 2. 安全的数值处理
function safeParseFloat(value) {
  const result = parseFloat(value);

  if (Number.isNaN(result)) {
    throw new Error(`Cannot parse "${value}" as number`);
  }

  return result;
}

// 使用示例
try {
  console.log(safeParseFloat('123.45')); // 123.45
  console.log(safeParseFloat('abc'));    // Error
} catch (error) {
  console.error(error.message);
}
```

### 记忆要点总结
- **NaN特性**：不等于任何值（包括自己），typeof为'number'
- **检测方法**：Number.isNaN()（推荐）、Object.is(val, NaN)
- **产生场景**：无效数学运算、类型转换失败
- **最佳实践**：使用Number.isNaN()进行严格检测

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

| 方法 | 是否先转换 | 示例 | 推荐场景 |
| --- | --- | --- | --- |
| `Number.isNaN(value)` | 否 | `Number.isNaN('abc')` 为 false | 判断值本身是不是 NaN |
| `isNaN(value)` | 是 | `isNaN('abc')` 为 true | 少用，除非明确想先转数字 |
| `Object.is(value, NaN)` | 否 | `Object.is(NaN, NaN)` 为 true | 精确比较特殊值 |
| `value !== value` | 否 | 只有 NaN 满足 | 面试技巧，不推荐业务代码 |

表单和接口解析时，先用 `Number(value)` 或 `parseFloat(value)` 得到结果，再用 `Number.isNaN(result)` 判断解析是否失败。

## 易错点提示

1. `typeof NaN` 是 `'number'`。
2. `NaN === NaN` 是 false，不能用严格相等判断。
3. 全局 `isNaN` 会先转数字，所以 `isNaN('abc')` 是 true。
4. `Number.isNaN('abc')` 是 false，因为字符串本身不是 NaN。
5. NaN 参与数学运算通常继续得到 NaN，容易污染后续计算。

## 记忆要点总结

- NaN 表示无效数值结果，但类型仍是 number。
- NaN 是唯一不等于自身的值。
- 检测首选 `Number.isNaN`。
- 解析失败后要尽早兜底，避免 NaN 继续传播。

## 延伸问题

1. `isNaN` 和 `Number.isNaN` 的区别是什么？
2. 为什么 NaN 不等于自身？
3. `Object.is(NaN, NaN)` 和 `NaN === NaN` 为什么不同？

## 可能类似的问题及简要参考答案

**Q：`Number('abc')` 的结果是什么？**  
A：结果是 NaN，表示字符串不能整体转换成有效数字。

**Q：如何判断计算结果是否可用？**  
A：先判断 `typeof result === 'number'`，再用 `Number.isNaN(result)` 排除 NaN，必要时还要用 `Number.isFinite` 排除 Infinity。

## 辅助记忆总结

一句话记：NaN 是 number 里的“坏结果”，自己都不等于自己。
