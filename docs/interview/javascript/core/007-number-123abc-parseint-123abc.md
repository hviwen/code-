# 007. [初级]** `Number('123abc')`和`parseInt('123abc')`的结果分别是什么？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这道题考察不同数值解析函数的行为差异，面试官想了解你是否理解它们的解析规则和适用场景。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：数据类型与变量（15道）。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

直接结论：

- `Number('123abc')` 返回 `NaN`。
- `parseInt('123abc')` 返回 `123`。

**Number() vs parseInt() 的区别：**

- **Number()**：严格解析，整个字符串必须是有效数字
- **parseInt()**：宽松解析，从左到右解析直到遇到非数字字符

| 写法 | 解析规则 | 示例 | 适合场景 |
| --- | --- | --- | --- |
| `Number(value)` | 要求整体能转换成数字 | `Number('123abc')` -> `NaN` | 严格校验用户输入、接口参数 |
| `parseInt(value, 10)` | 从开头解析整数，遇到非法字符停止 | `parseInt('123abc', 10)` -> `123` | 解析带单位字符串的整数部分 |
| `parseFloat(value)` | 从开头解析浮点数，遇到非法字符停止 | `parseFloat('12.5px')` -> `12.5` | 解析 CSS 尺寸、百分比片段 |
| `+value` | 基本等同于 `Number(value)` | `+'123abc'` -> `NaN` | 简短数值转换，但可读性较弱 |

关键边界：

- `Number('')` 和 `Number('   ')` 都是 `0`，这在表单必填校验里很容易误判。
- `parseInt('123.45', 10)` 是 `123`，小数部分会被截断，不是四舍五入。
- `parseInt('abc123', 10)` 是 `NaN`，因为开头不是可解析数字。
- 实际项目中 `parseInt` 建议显式传 `10`，避免读代码的人误解进制意图。

## 实战应用举例

示例 1：表单年龄字段必须是完整数字，不能接受 `18abc`。

```javascript
function parseAge(input) {
  const value = input.trim()
  if (!/^\d+$/.test(value)) return null

  const age = Number(value)
  return age >= 0 && age <= 150 ? age : null
}

console.log(parseAge('18')) // 18
console.log(parseAge('18abc')) // null
console.log(parseAge('')) // null
```

这里不能用 `parseInt(input, 10)`，否则 `18abc` 会被当成合法的 `18`，用户输入错误会被静默吞掉。

示例 2：解析 CSS 像素值时，`parseInt` 可以接受带单位字符串。

```javascript
function getPixelNumber(value) {
  const number = parseInt(value, 10)
  return Number.isNaN(number) ? 0 : number
}

console.log(getPixelNumber('16px')) // 16
console.log(getPixelNumber('12.5px')) // 12
console.log(getPixelNumber('auto')) // 0
```

这里的目标是提取整数像素，不是校验完整数字；如果要保留小数，应该换成 `parseFloat`。

## 使用场景说明和对比

| 场景 | 推荐写法 | 原因 |
| --- | --- | --- |
| 表单金额、年龄、数量等严格输入 | 正则校验 + `Number()` | 必须保证整个字符串合法，不能吞掉脏字符 |
| 接口参数转换 | `Number()` 后用 `Number.isNaN()` 判断 | 失败路径明确，便于返回错误提示 |
| CSS 尺寸如 `16px` | `parseInt(value, 10)` 或 `parseFloat(value)` | 输入本来就可能带单位，需要提取前缀数字 |
| 需要整数但输入可能是小数 | `Math.trunc(Number(value))` 或业务规则明确取整 | `parseInt('12.9', 10)` 看似能用，但会把字符串解析和取整混在一起 |
| 判断是否是 `NaN` | `Number.isNaN(value)` | 全局 `isNaN` 会先做隐式转换，容易误判 |

一句话取舍：校验“是不是一个数字”用 `Number` 思路；提取“开头的数字片段”才用 `parseInt` / `parseFloat`。

## 易错点提示

- 不要说 `parseInt` 能“把字符串转成数字”，更准确是“从字符串开头解析整数前缀”。
- `Number('123abc')` 不是 `123`，因为 `Number` 要求整体合法。
- `parseInt('123abc')` 是 `123`，但这不代表 `123abc` 是合法数字输入。
- `Number.isNaN(NaN)` 是 `true`；`Number.isNaN('abc')` 是 `false`，因为它不会先转换。
- `isNaN('abc')` 是 `true`，因为全局 `isNaN` 会先尝试转数字，面试中经常用来挖坑。

## 记忆要点总结

1. `Number` 看整体，整体不合法就是 `NaN`。
2. `parseInt` 看开头，开头能解析多少算多少。
3. 严格输入校验不要用 `parseInt` 兜底。
4. 带单位字符串可以用 `parseInt` / `parseFloat` 提取数值。
5. 判断 `NaN` 优先用 `Number.isNaN`。

## 延伸问题

1. `Number('')`、`Number(null)`、`Number(undefined)` 分别是什么？
2. `parseInt('12.8px', 10)` 和 `parseFloat('12.8px')` 有什么区别？
3. 为什么 `isNaN('abc')` 和 `Number.isNaN('abc')` 结果不同？
4. 表单金额输入为什么不能简单使用 `parseFloat` 后提交？

## 可能类似的问题及简要参考答案

| 类似问题 | 简要参考答案 |
| --- | --- |
| `Number('')` 的结果是什么？ | `0`，空字符串会被转换为 0，所以必填校验要先判断空值。 |
| `parseInt('08', 10)` 为什么建议传第二个参数？ | 明确按十进制解析，避免读者误解进制意图。 |
| `parseInt('12.6', 10)` 是四舍五入吗？ | 不是，结果是 `12`，它只解析整数前缀。 |
| `+'123abc'` 的结果是什么？ | `NaN`，一元加号走的是类似 `Number()` 的整体转换。 |

## 辅助记忆总结

记法：`Number` 要全对，`parseInt` 只看头；校验用全对，提取看开头。
