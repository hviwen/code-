# 127. [中级]** Promise中的错误传播机制

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察Promise错误传播的机制，面试官想了解你是否理解Promise链中错误如何传播和处理。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

~~.catch()~~

- 错误会沿着Promise链向下传播，直到被catch捕获
- catch可以捕获之前链条中的任何错误
- catch处理后可以返回正常值，恢复Promise链
- 跳过then的成功回调

### 问题本质解读 这道题考察Promise错误传播的机制，面试官想了解你是否理解Promise链中错误如何传播和处理。

### 知识点系统梳理

**Promise错误传播的核心机制：**

1. **错误冒泡**：错误会沿着Promise链向下传播
2. **跳过成功回调**：错误状态会跳过then的成功回调
3. **catch捕获**：catch可以捕获之前链条中的任何错误
4. **错误恢复**：catch处理后可以返回正常值，恢复Promise链

### 实战应用举例

```javascript
// 1. 基础错误传播
Promise.resolve('开始')
  .then(value => {
    console.log('步骤1:', value)
    throw new Error('步骤1出错')
  })
  .then(value => {
    console.log('步骤2: 不会执行') // 跳过
    return value + ' -> 步骤2'
  })
  .catch(error => {
    console.log('捕获错误:', error.message) // "步骤1出错"
    return '错误已处理' // 恢复正常流程
  })
  .then(value => {
    console.log('恢复执行:', value) // "错误已处理"
  })

// 2. 错误类型和处理策略
function handleDifferentErrors() {
  return Promise.resolve()
    .then(() => {
      const errorType = Math.floor(Math.random() * 3)
      switch (errorType) {
        case 0:
          throw new TypeError('类型错误')
        case 1:
          throw new ReferenceError('引用错误')
        case 2:
          throw new Error('普通错误')
      }
    })
    .catch(error => {
      if (error instanceof TypeError) {
        return '类型错误已修复'
      } else if (error instanceof ReferenceError) {
        return '引用错误已修复'
      } else {
        return '普通错误已修复'
      }
    })
}

// 3. 分层错误处理
function processUserData(userId) {
  return fetchUser(userId)
    .catch(error => {
      console.log('获取用户失败，使用默认用户')
      return { id: userId, name: 'Unknown User' }
    })
    .then(user => processUser(user))
    .catch(error => {
      console.log('处理用户失败，返回错误信息')
      return { error: true, message: error.message }
    })
}
```

### 记忆要点总结

- 错误自动向下传播，跳过成功回调
- catch可以捕获之前链条中的任何错误
- catch处理后可以恢复正常流程
- 合理使用分层错误处理和重试机制

### async/await（8道）

## 实战应用举例

表单提交链路中，校验失败、接口失败和保存失败都可以沿 Promise 链向后传播到统一错误处理。

```javascript
function submitForm(form) {
  return validateForm(form)
    .then(validData => saveForm(validData))
    .then(result => showSuccess(result))
    .catch(error => {
      showError(error.message)
      throw error
    })
}
```

## 使用场景说明和对比

| 处理方式 | 适合场景 | 注意点 |
| --- | --- | --- |
| 链尾 `catch` | 统一处理整条链错误 | catch 后是否继续失败要明确 |
| 中间 `catch` | 局部降级、默认值兜底 | 返回普通值会恢复成功链 |
| `then(null, onRejected)` | 只处理当前一步失败 | 可读性通常不如 catch |
| async/await try/catch | 流程复杂、分支多 | 未 await 的 Promise 捕不到 |

## 易错点提示

1. `then` 里抛异常会让返回的新 Promise rejected。
2. 错误会跳过后续成功回调，直到最近的错误处理。
3. `catch` 返回普通值会让后续恢复 fulfilled。
4. 想继续向上传播错误，`catch` 里要重新 `throw`。
5. 未返回内层 Promise 会让错误脱离当前链。

## 记忆要点总结

- Promise 错误沿链向后传播。
- 最近的 `catch` 会接住前面的错误。
- catch 后返回值决定链路是恢复还是继续失败。
- 统一处理和局部降级要分清。

## 延伸问题

可以继续追问：127. [中级]** Promise中的错误传播机制 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：`catch` 后为什么还能继续 `then`？**  
A：因为 `catch` 也返回新的 Promise；如果它返回普通值，新 Promise 就是 fulfilled。

**Q：怎样在记录错误后继续抛给上层？**  
A：在 `catch` 中记录日志后 `throw error`，不要只返回默认值。

## 辅助记忆总结

一句话记：错误沿链往后跑，catch 接住后是吞掉还是抛出要自己决定。
