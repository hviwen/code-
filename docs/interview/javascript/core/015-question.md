# 015. [中级]** 如何准确地比较两个浮点数是否相等？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这道题考察浮点数比较的正确方法，面试官想了解你是否掌握精度安全的比较技巧。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：数据类型与变量（15道）。

## 技术错误纠正

1. "Math.EPSILON"应为"Number.EPSILON"
2. 缺少具体的实现方法和使用场景

## 知识点系统梳理

- 使用Math.EPSILON 通过绝对值计算后和EPSLION比较

### 问题本质解读 这道题考察浮点数比较的正确方法，面试官想了解你是否掌握精度安全的比较技巧。

### 技术错误纠正
1. "Math.EPSILON"应为"Number.EPSILON"
2. 缺少具体的实现方法和使用场景

### 知识点系统梳理

**浮点数比较的方法：**
1. **Number.EPSILON** - 最小精度单位
2. **自定义精度** - 根据业务需求设定
3. **相对误差** - 适用于大数值比较
4. **整数转换** - 避免浮点数运算

### 实战应用举例
```javascript
// 1. 使用Number.EPSILON的精确比较
function isEqual(a, b, epsilon = Number.EPSILON) {
  return Math.abs(a - b) < epsilon;
}

console.log(isEqual(0.1 + 0.2, 0.3));        // true
console.log(isEqual(0.1 + 0.2, 0.3, 1e-10)); // true，自定义精度
```

```javascript
// 2. 相对误差比较（适用于大数值）
function isEqualRelative(a, b, relativeEpsilon = 1e-9) {
  const absoluteEpsilon = relativeEpsilon * Math.max(Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= absoluteEpsilon;
}

// 大数值比较
console.log(isEqualRelative(1000000.1, 1000000.2, 1e-6)); // false
console.log(isEqualRelative(1000000.1, 1000000.1, 1e-6)); // true
```

### 记忆要点总结
- **推荐方法**：Math.abs(a - b) < Number.EPSILON
- **自定义精度**：根据业务需求调整epsilon值
- **相对误差**：大数值比较使用相对误差更合适
- **避免直接比较**：永远不要直接使用===比较浮点数
- 先转位整数计算，然后再转为小数
- 使用第三方库

## 使用场景说明和对比

| 比较方式 | 适合场景 | 注意点 |
| --- | --- | --- |
| `Math.abs(a - b) < epsilon` | 小数近似比较 | epsilon 要按业务设置 |
| 相对误差比较 | 大数值、科学计算 | 不能只用固定 `Number.EPSILON` |
| 转整数比较 | 金额、数量等固定小数位 | 要明确单位和舍入规则 |
| decimal 库 | 高精度金额、财务计算 | 有依赖成本，但更可靠 |

普通 UI 展示误差可以用固定精度；涉及资产、结算、账单时，不要直接用浮点比较作为最终判断。

## 易错点提示

1. 是 `Number.EPSILON`，不是 `Math.EPSILON`。
2. `Number.EPSILON` 很小，只适合接近 1 的数值比较，业务里常要自定义误差。
3. 直接 `a === b` 比较浮点计算结果不可靠。
4. 金额比较不要只靠 epsilon，最好转整数单位或用高精度库。
5. `toFixed` 返回字符串，不能直接当数值计算结果继续运算。

## 记忆要点总结

- 浮点比较看差值是否在可接受误差内。
- 小数用绝对误差，大数更适合相对误差。
- 金额用整数单位或 decimal。
- 展示格式化和计算精度是两件事。

## 延伸问题

1. 固定 epsilon 和相对误差有什么区别？
2. 为什么 `toFixed` 不适合作为通用精度计算方案？
3. 前端金额计算为什么常用“分”而不是“元”？

## 可能类似的问题及简要参考答案

**Q：`Number.EPSILON` 是什么？**  
A：它表示 1 附近能区分的最小浮点差值，常用于近似比较，但业务中通常要按数值量级和容忍误差调整。

**Q：浮点数比较有没有万能函数？**  
A：没有。比较精度取决于业务场景：UI 展示、科学计算、金额结算的容忍误差完全不同。

## 辅助记忆总结

一句话记：浮点数不问“是否完全相等”，要问“误差能不能接受”。
