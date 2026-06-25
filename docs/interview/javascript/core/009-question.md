# 009. [初级]** 如何检测一个变量的数据类型？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这道题考察JavaScript中精确类型检测的方法，面试官想了解你是否掌握不同检测方法的优缺点。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：数据类型与变量（15道）。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

- Object.prototype.toString.call(xxx) 返回的 '[object XXX]' 其中XXX就是xxx的数据类型

### 问题本质解读 这道题考察JavaScript中精确类型检测的方法，面试官想了解你是否掌握不同检测方法的优缺点。

### 知识点系统梳理

**类型检测的方法对比：**
1. **typeof** - 基础类型检测，有局限性
2. **instanceof** - 原型链检测，有跨iframe问题
3. **Object.prototype.toString.call()** - 最精确的检测方法
4. **Array.isArray()** - 专门的数组检测

### 实战应用举例
```javascript
// 1. 通用类型检测工具
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

// 使用示例
console.log(getType([]));           // 'array'
console.log(getType({}));           // 'object'
console.log(getType(null));         // 'null'
console.log(getType(new Date()));   // 'date'
console.log(getType(/test/));       // 'regexp'
console.log(getType(function(){})); // 'function'
```

```javascript
// 2. 类型验证器
const TypeValidator = {
  isString: (val) => typeof val === 'string',
  isNumber: (val) => typeof val === 'number' && !isNaN(val),
  isArray: (val) => Array.isArray(val),
  isObject: (val) => getType(val) === 'object',
  isFunction: (val) => typeof val === 'function',
  isDate: (val) => getType(val) === 'date',

  // 组合验证
  validate(value, expectedType) {
    const actualType = getType(value);
    return actualType === expectedType.toLowerCase();
  }
};

// 使用示例
console.log(TypeValidator.isArray([]));        // true
console.log(TypeValidator.validate(new Date(), 'Date')); // true
```

### 记忆要点总结
- **最精确方法**：Object.prototype.toString.call()
- **常用方法**：typeof（基础类型）、Array.isArray()（数组）
- **返回格式**：'[object Type]'，需要slice(8, -1)提取类型名
- **实际应用**：参数验证、类型守卫、通用工具函数

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

| 方法 | 能判断什么 | 局限 | 推荐场景 |
| --- | --- | --- | --- |
| `typeof` | 原始类型、函数 | `null` 返回 object，数组也返回 object | 快速判断基础类型 |
| `Array.isArray` | 数组 | 只判断数组 | 数组判断首选 |
| `instanceof` | 原型链关系 | 跨 iframe 可能失败 | 判断自定义类实例 |
| `Object.prototype.toString.call` | 内置类型标签 | 写法较长 | 通用类型工具 |

项目里不要所有类型都用一个复杂工具。判断字符串、函数用 `typeof`；判断数组用 `Array.isArray`；需要区分 Date、RegExp、Map、Set 时再用 `toString.call`。

## 易错点提示

1. `typeof null === 'object'` 是历史遗留问题。
2. `typeof [] === 'object'`，数组要用 `Array.isArray`。
3. `instanceof Array` 在跨 iframe 数组场景可能失效。
4. `Object.prototype.toString.call` 依赖内置标签，自定义类通常返回 `[object Object]`，除非配置 `Symbol.toStringTag`。
5. 判断对象时要排除 null：`value !== null && typeof value === 'object'`。

## 记忆要点总结

- 基础类型先 `typeof`。
- 数组先 `Array.isArray`。
- 内置对象精确判断用 `Object.prototype.toString.call`。
- 类实例关系用 `instanceof`。

## 延伸问题

1. `typeof null` 为什么是 object？
2. `instanceof` 的判断原理是什么？
3. `Symbol.toStringTag` 如何影响 `Object.prototype.toString.call`？

## 可能类似的问题及简要参考答案

**Q：怎么判断一个值是不是普通对象？**  
A：先排除 null，再用 `Object.prototype.toString.call(value) === '[object Object]'`，必要时还要检查原型是否为 `Object.prototype` 或 null。

**Q：为什么不用 `constructor` 判断类型？**  
A：`constructor` 可以被改写，跨 realm 也可能不可靠，不适合作为通用类型判断。

## 辅助记忆总结

一句话记：基础 `typeof`，数组 `isArray`，复杂内置看 `toString.call`。
