# 130. [中级]** 如何在async函数中处理错误？

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察async/await中的错误处理机制，面试官想了解你是否掌握异步错误处理的最佳实践。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- 不是"在外部包一个try-catch"，而是在async函数内部使用try-catch
- 还有其他多种错误处理方式

## 知识点系统梳理

- ~~在外部包一个try-catch 捕获异常~~

### 问题本质解读 这道题考察async/await中的错误处理机制，面试官想了解你是否掌握异步错误处理的最佳实践。

### 技术错误纠正

- 不是"在外部包一个try-catch"，而是在async函数内部使用try-catch
- 还有其他多种错误处理方式

### 知识点系统梳理

**async/await错误处理的多种方式：**

1. **try-catch块**：在async函数内部捕获错误
2. **Promise.catch()**：链式调用处理错误
3. **混合方式**：结合try-catch和.catch()
4. **全局错误处理**：unhandledRejection事件

### 实战应用举例

```javascript
// 1. 基础try-catch错误处理
async function basicErrorHandling() {
  try {
    const response = await fetch('/api/data')

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('请求失败:', error.message)
    throw error // 重新抛出或返回默认值
  }
}

// 2. 多层错误处理
async function multiLevelErrorHandling(userId) {
  try {
    // 第一层：获取用户基本信息
    const user = await fetchUser(userId)

    try {
      // 第二层：获取用户详细信息
      const profile = await fetchUserProfile(user.id)
      user.profile = profile
    } catch (profileError) {
      console.warn('获取用户资料失败，使用默认资料:', profileError.message)
      user.profile = getDefaultProfile()
    }

    try {
      // 第三层：获取用户设置
      const settings = await fetchUserSettings(user.id)
      user.settings = settings
    } catch (settingsError) {
      console.warn('获取用户设置失败，使用默认设置:', settingsError.message)
      user.settings = getDefaultSettings()
    }

    return user
  } catch (error) {
    console.error('获取用户信息失败:', error.message)
    return null
  }
}

// 3. 条件错误处理
async function conditionalErrorHandling(operation, fallbackOperation) {
  try {
    return await operation()
  } catch (error) {
    console.log('主操作失败，尝试备用操作:', error.message)

    if (fallbackOperation) {
      try {
        return await fallbackOperation()
      } catch (fallbackError) {
        console.error('备用操作也失败:', fallbackError.message)
        throw new Error('所有操作都失败了')
      }
    } else {
      throw error
    }
  }
}

// 4. 批量操作的错误处理
async function batchOperationWithErrorHandling(items) {
  const results = []
  const errors = []

  for (const item of items) {
    try {
      const result = await processItem(item)
      results.push({ item, result, status: 'success' })
    } catch (error) {
      errors.push({ item, error: error.message, status: 'failed' })
      console.error(`处理项目${item.id}失败:`, error.message)
    }
  }

  return {
    results,
    errors,
    summary: {
      total: items.length,
      successful: results.length,
      failed: errors.length,
    },
  }
}

// 5. 超时和重试的错误处理
async function withTimeoutAndRetry(operation, timeout = 5000, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 添加超时控制
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('操作超时')), timeout)
      })

      const result = await Promise.race([operation(), timeoutPromise])
      return result
    } catch (error) {
      console.log(`第${attempt}次尝试失败:`, error.message)

      if (attempt === maxRetries) {
        throw new Error(`操作失败，已重试${maxRetries}次: ${error.message}`)
      }

      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}

// 6. 使用Promise.catch()的错误处理
async function promiseCatchErrorHandling() {
  const userData = await fetchUser(123).catch(error => {
    console.error('获取用户失败:', error)
    return getDefaultUser() // 返回默认用户
  })

  const userPosts = await fetchUserPosts(userData.id).catch(error => {
    console.error('获取用户文章失败:', error)
    return [] // 返回空数组
  })

  return {
    user: userData,
    posts: userPosts,
  }
}

// 7. 混合错误处理策略
async function hybridErrorHandling(userId) {
  try {
    // 关键操作使用try-catch
    const user = await fetchUser(userId)

    // 可选操作使用.catch()
    const [posts, friends, settings] = await Promise.all([
      fetchUserPosts(userId).catch(() => []),
      fetchUserFriends(userId).catch(() => []),
      fetchUserSettings(userId).catch(() => getDefaultSettings()),
    ])

    return {
      user,
      posts,
      friends,
      settings,
      loadedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
    throw new Error(`无法加载用户${userId}的数据: ${error.message}`)
  }
}

// 8. 错误分类处理
async function categorizedErrorHandling() {
  try {
    const data = await fetchSensitiveData()
    return data
  } catch (error) {
    if (error.name === 'NetworkError') {
      console.error('网络错误，请检查网络连接')
      throw new Error('网络连接失败，请稍后重试')
    } else if (error.status === 401) {
      console.error('认证失败，需要重新登录')
      throw new Error('认证失败，请重新登录')
    } else if (error.status === 403) {
      console.error('权限不足')
      throw new Error('您没有权限访问此资源')
    } else if (error.status >= 500) {
      console.error('服务器错误')
      throw new Error('服务器暂时不可用，请稍后重试')
    } else {
      console.error('未知错误:', error)
      throw new Error('操作失败，请联系技术支持')
    }
  }
}

// 9. 资源清理的错误处理
async function resourceCleanupErrorHandling() {
  let connection = null
  let transaction = null

  try {
    connection = await createDatabaseConnection()
    transaction = await connection.beginTransaction()

    const result = await performDatabaseOperations(transaction)
    await transaction.commit()

    return result
  } catch (error) {
    console.error('数据库操作失败:', error)

    if (transaction) {
      try {
        await transaction.rollback()
      } catch (rollbackError) {
        console.error('回滚失败:', rollbackError)
      }
    }

    throw error
  } finally {
    // 确保资源被清理
    if (connection) {
      try {
        await connection.close()
      } catch (closeError) {
        console.error('关闭连接失败:', closeError)
      }
    }
  }
}
```

**错误处理最佳实践：**

1. **明确错误边界**：在合适的层级处理错误
2. **提供有意义的错误信息**：帮助调试和用户理解
3. **优雅降级**：提供默认值或备用方案
4. **资源清理**：使用finally确保资源释放
5. **错误分类**：根据错误类型采取不同策略

### 记忆要点总结

- 在async函数内部使用try-catch捕获await的错误
- 可以结合Promise.catch()进行链式错误处理
- 支持多层错误处理和条件错误处理
- 使用finally进行资源清理
- 根据错误类型制定不同的处理策略

## 实战应用举例

表单提交时，可以把用户提示、日志和最终失败传播放在同一个错误边界里。

```javascript
async function submitProfile(form) {
  try {
    const payload = normalizeProfile(form)
    const response = await fetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error('保存失败')
    return await response.json()
  } catch (error) {
    showToast(error.message)
    reportError(error)
    throw error
  }
}
```

## 使用场景说明和对比

| 方式 | 适合场景 | 注意点 |
| --- | --- | --- |
| `try/catch` | async 函数内统一处理 await 错误 | 未 await 的 Promise 捕不到 |
| `.catch()` | 调用方处理 async 函数返回的 Promise | 容易和链式写法混杂 |
| `finally` | 关闭 loading、释放资源 | 不要在 finally 里吞掉错误 |
| 局部 catch 后返回默认值 | 允许降级 | 会把失败恢复成成功 |

## 易错点提示

1. 只有被 `await` 的 rejected Promise 才会进入当前 `try/catch`。
2. catch 里不重新 throw，调用方会认为操作成功或已兜底。
3. `finally` 适合清理 loading，但不要只在成功分支关闭 loading。
4. 并发 `Promise.all` 的错误会在 await 时被 catch 捕获。
5. 错误处理层级要清楚：组件提示、业务兜底、全局上报不要混成一坨。

## 记忆要点总结

- async 内部错误用 `try/catch`。
- 调用 async 的地方也可以用 `.catch()`。
- catch 后是否继续失败，看是否重新 throw。
- finally 负责收尾，不负责判断业务成功。

## 延伸问题

可以继续追问：130. [中级]** 如何在async函数中处理错误？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：async 函数里的 rejected Promise 怎么捕获？**  
A：在 async 函数内 `await` 它，并用 `try/catch` 包住。

**Q：catch 里 return 默认值有什么影响？**  
A：会让 async 函数返回 fulfilled Promise，调用方不再进入 catch。

## 辅助记忆总结

一句话记：await 的失败进 catch，catch 后要不要继续失败取决于你是否 throw。
