# 008. [中级]** 解释JavaScript中的"假值"（falsy values）有哪些？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

这道题考察JavaScript中布尔转换的规则，面试官想了解你是否掌握条件判断的核心机制。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：数据类型与变量（15道）。

## 技术错误纠正

1. 原答案基本正确，但缺少-0和0n（BigInt零值）
2. 没有说明假值的实际应用和注意事项

## 知识点系统梳理

- false
- 0
- ''
- null
- undefined
- NaN
- -0
- 0n

### 问题本质解读 这道题考察JavaScript中布尔转换的规则，面试官想了解你是否掌握条件判断的核心机制。

### 技术错误纠正
1. 原答案基本正确，但缺少-0和0n（BigInt零值）
2. 没有说明假值的实际应用和注意事项

### 知识点系统梳理

**完整的假值列表（8个）：**
1. **false** - 布尔假值
2. **0** - 数字零
3. **-0** - 负零
4. **0n** - BigInt零值
5. **''** - 空字符串
6. **null** - 空值
7. **undefined** - 未定义
8. **NaN** - 非数字

### 实战应用举例
```javascript
// 1. 安全的条件判断
function processValue(value) {
  // 使用显式检查而不是依赖假值判断
  if (value === null || value === undefined) {
    return 'No value provided';
  }

  if (value === '') {
    return 'Empty string provided';
  }

  if (value === 0) {
    return 'Zero value provided';
  }

  return `Processing: ${value}`;
}

// 对比隐式判断的问题
function unsafeProcess(value) {
  if (!value) {  // 这会把0、''、false都当作无效值
    return 'Invalid value';
  }
  return `Processing: ${value}`;
}

console.log(processValue(0));        // 'Zero value provided'
console.log(unsafeProcess(0));       // 'Invalid value' - 可能不是期望的结果
```

```javascript
// 2. 空值合并的实际应用
function getConfigValue(userConfig, defaultConfig) {
  // 使用空值合并操作符，只处理null和undefined
  return userConfig ?? defaultConfig;
}

function getConfigValueOld(userConfig, defaultConfig) {
  // 传统方式，会把所有假值都替换
  return userConfig || defaultConfig;
}

// 测试差异
console.log(getConfigValue(0, 100));        // 0 - 保留用户设置的0
console.log(getConfigValueOld(0, 100));     // 100 - 错误地使用了默认值

console.log(getConfigValue('', 'default')); // '' - 保留用户设置的空字符串
console.log(getConfigValueOld('', 'default')); // 'default' - 错误地使用了默认值
```

### 记忆要点总结
- **8个假值**：false, 0, -0, 0n, '', null, undefined, NaN
- **布尔转换**：假值转换为false，其他所有值转换为true
- **最佳实践**：使用显式比较而不是依赖隐式布尔转换
- **现代解决方案**：使用??操作符区分null/undefined和其他假值

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

| 判断目标 | 推荐写法 | 原因 |
| --- | --- | --- |
| 判断是否没有传值 | `value == null` 或 `value === null || value === undefined` | 只覆盖 null/undefined |
| 判断字符串是否为空 | `value === ''` | 不误伤 `'0'`、`'false'` |
| 判断数组是否为空 | `Array.isArray(list) && list.length === 0` | 空数组本身是 truthy |
| 兜底默认值 | `value ?? defaultValue` | 保留 0、false、空字符串 |
| 条件渲染开关 | `Boolean(flag)` 或直接用布尔字段 | 语义清楚 |

业务中最常见的坑是把 `0`、`false`、`''` 当成“没值”。例如分页页码可以是 0，开关值可以是 false，搜索关键字可以允许空字符串，这些都不该被 `||` 默认值覆盖。

## 易错点提示

1. 空数组 `[]`、空对象 `{}` 都是 truthy。
2. 字符串 `'0'`、`'false'`、`' '` 都是 truthy。
3. `0n` 是 falsy，但 `1n` 是 truthy。
4. `value || defaultValue` 会替换所有假值，`value ?? defaultValue` 只替换 null/undefined。
5. 表单校验不要只写 `if (!value)`，否则数字 0 和布尔 false 会被误判。

## 记忆要点总结

- falsy 只有 8 个：`false`、`0`、`-0`、`0n`、`''`、`null`、`undefined`、`NaN`。
- 除这 8 个外，其余值转布尔基本都是 true。
- 默认值优先用 `??`，空值判断要看业务语义。
- 空数组和空对象不是假值。

## 延伸问题

1. `||` 和 `??` 的区别是什么？
2. 为什么 `[] == false` 是 true，但 `Boolean([])` 是 true？
3. Vue/React 条件渲染中如何避免 `0` 被隐藏或误显示？

## 可能类似的问题及简要参考答案

**Q：空数组是不是假值？**  
A：不是。`Boolean([])` 是 true；只有在宽松相等比较里，数组可能被转换后产生反直觉结果。

**Q：默认值为什么推荐 `??`？**  
A：因为 `??` 只在左侧是 null 或 undefined 时使用默认值，不会误覆盖 0、false、空字符串。

## 辅助记忆总结

一句话记：假值名单很短，默认值别用 `||` 一把梭。
