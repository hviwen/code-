# 126. [高级]** 如何实现一个简单的Promise？

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察对Promise内部实现机制的深度理解，面试官想了解你是否掌握Promise的核心原理和状态管理。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- `exectue`应该是`executor`
- `resaon`应该是`reason`
- `resoveMyPromise`应该是`resolveMyPromise`
- `MyPromiose`应该是`MyPromise`
- `reslut`应该是`result`
- resolve和reject函数中的`this`指向问题需要修正

## 知识点系统梳理

```javascript
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'

function MyPromise(exectue) {
  this.state = PENDING
  this.reason = null
  this.value = null

  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []

  const that = this
  function resolve(value) {
    if (this.state === PENDING) {
      this.value = value
      this.state = FULFILLED
      that.onFulfilledCallbacks.forEach(fn => fn(that.value))
    }
  }

  function reject(reason) {
    if (this.state === PENDING) {
      this.reason = resaon
      this.state = REJECTED
      that.onRejectedCallbacks.forEach(fn => fn(that.resaon))
    }
  }

  try {
    exectue(resolve, reject)
  } catch (err) {
    reject(err)
  }
}
MyPromise.prototype.then = function (onFullfilled, onRejected) {
  if (typeof onFullfilled !== 'function') {
    onFullfilled = function (value) {
      return value
    }
  }

  if (typeof onRejected !== 'function') {
    onRejected = function (reason) {
      throw reason
    }
  }

  const that = this

  if (this.state === FULFILLED) {
    const promise2 = new MyPromiose((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onFullfilled !== 'function') {
            resolve(that.value)
          } else {
            const x = onFullfilled(that.value)
            resoveMyPromise(promise2, x, resolve, reject)
          }
        } catch (err) {
          reject(err)
        }
      }, 0)
    })
    return promise2
  }

  if (this.state === REJECTED) {
    const promise2 = new MyPromiose((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onRejected !== 'function') {
            reject(that.reason)
          } else {
            const x = onRejected(that.reason)
            resoveMyPromise(promise2, x, resolve, reject)
          }
        } catch (err) {
          reject(err)
        }
      }, 0)
    })
    return promise2
  }

  if (this.state === PENDING) {
    const promise2 = new MyPromise((resolve, reject) => {
      this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          try {
            if (typeof onFullfilled !== 'function') {
              resolve(that.value)
            } else {
              const x = onFullfilled(that.value)
              resoveMyPromise(promise2, x, resolve, reject)
            }
          } catch (err) {
            reject(err)
          }
        }, 0)
      })
      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            if (typeof onRejected !== 'function') {
              reject(that.reason)
            } else {
              const x = onRejected(that.reason)
              resoveMyPromise(promise2, x, resolve, reject)
            }
          } catch (err) {
            reject(err)
          }
        }, 0)
      })
    })
    return promise2
  }
}

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

MyPromise.prototype.finally = function (onFinally) {
  return this.then(onFinally, onFinally)
}

MyPromise.resolve = function (value) {
  if (value instanceof MyPromise) {
    return value
  }

  return new MyPromise((resolve, reject) => {
    resolve(value)
  })
}

MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason)
  })
}

MyPromise.prototype.all = function (promises = []) {
  return new MyPromise((resolve, reject) => {
    const result = []
    let count = 0

    if (promises.length === 0) {
      resolve(result)
    }

    for (const promise of promises) {
      MyPromise.resolve(promise).then(
        value => {
          count++
          result.push(value)
          if (count === promises.length) {
            resolve(reslut)
          }
        },
        reason => {
          reject(reason)
        },
      )
    }
  })
}

function resolveMyPromise(promise, x, resolve, reject) {
  if (x === promise) {
    return reject(new TypeError('promise and x is same value'))
  }

  if (x instanceof MyPromise) {
    x.then(y => {
      resolveMyPromise(promise, y, resolve, reject)
    }, reject)
  } else if (typeof x === 'object' || typeof x === 'function') {
    if (x === null) {
      return resolve(x)
    }

    try {
      var then = x.then
    } catch (err) {
      reject(err)
    }

    if (typeof then === 'function') {
      let called = false

      try {
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolveMyPromise(promise, y, resolve, reject)
          },
          r => {
            if (called) return
            called = true
            reject(r)
          },
        )
      } catch (e) {
        if (called) return
        reject(e)
      }
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}
```

### 问题本质解读 这道题考察对Promise内部实现机制的深度理解，面试官想了解你是否掌握Promise的核心原理和状态管理。

### 技术错误纠正

- `exectue`应该是`executor`
- `resaon`应该是`reason`
- `resoveMyPromise`应该是`resolveMyPromise`
- `MyPromiose`应该是`MyPromise`
- `reslut`应该是`result`
- resolve和reject函数中的`this`指向问题需要修正

**完整的Promise实现：**

```javascript
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'

function MyPromise(executor) {
  this.state = PENDING
  this.value = null
  this.reason = null

  // 存储异步情况下的回调函数
  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []

  const self = this

  function resolve(value) {
    if (self.state === PENDING) {
      self.state = FULFILLED
      self.value = value
      // 执行所有成功回调
      self.onFulfilledCallbacks.forEach(callback => callback())
    }
  }

  function reject(reason) {
    if (self.state === PENDING) {
      self.state = REJECTED
      self.reason = reason
      // 执行所有失败回调
      self.onRejectedCallbacks.forEach(callback => callback())
    }
  }

  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

// then方法实现
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 参数校验，确保是函数
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : reason => {
          throw reason
        }

  const self = this

  // 返回新的Promise，支持链式调用
  const promise2 = new MyPromise((resolve, reject) => {
    if (self.state === FULFILLED) {
      // 异步执行，确保promise2已经创建
      setTimeout(() => {
        try {
          const x = onFulfilled(self.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }, 0)
    }

    if (self.state === REJECTED) {
      setTimeout(() => {
        try {
          const x = onRejected(self.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }, 0)
    }

    if (self.state === PENDING) {
      // 异步情况，将回调存储起来
      self.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          try {
            const x = onFulfilled(self.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      })

      self.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            const x = onRejected(self.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      })
    }
  })

  return promise2
}

// 处理Promise解析过程
function resolvePromise(promise2, x, resolve, reject) {
  // 避免循环引用
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  let called = false

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      const then = x.then

      if (typeof then === 'function') {
        // x是thenable对象
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          r => {
            if (called) return
            called = true
            reject(r)
          },
        )
      } else {
        // x是普通对象
        resolve(x)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    // x是普通值
    resolve(x)
  }
}

// catch方法
MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

// finally方法
MyPromise.prototype.finally = function (onFinally) {
  return this.then(
    value => MyPromise.resolve(onFinally()).then(() => value),
    reason =>
      MyPromise.resolve(onFinally()).then(() => {
        throw reason
      }),
  )
}

// 静态方法
MyPromise.resolve = function (value) {
  if (value instanceof MyPromise) {
    return value
  }
  return new MyPromise(resolve => resolve(value))
}

MyPromise.reject = function (reason) {
  return new MyPromise((_, reject) => reject(reason))
}

MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'))
    }

    const results = []
    let completedCount = 0

    if (promises.length === 0) {
      return resolve(results)
    }

    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        value => {
          results[index] = value
          completedCount++
          if (completedCount === promises.length) {
            resolve(results)
          }
        },
        reason => reject(reason),
      )
    })
  })
}

MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'))
    }

    promises.forEach(promise => {
      MyPromise.resolve(promise).then(resolve, reject)
    })
  })
}
```

**实现要点总结：**

- 状态管理：pending → fulfilled/rejected
- 回调队列：处理异步情况
- then方法：返回新Promise，支持链式调用
- 值处理：普通值、Promise、thenable对象
- 错误处理：try-catch和reject机制
- 静态方法：resolve、reject、all、race

## 实战应用举例

面试手写时先实现最小版本：状态、回调队列、异步触发和链式 `then`。

```javascript
const p = new MyPromise(resolve => {
  setTimeout(() => resolve(1), 0)
})

p.then(value => value + 1).then(value => {
  console.log(value) // 2
})
```

## 使用场景说明和对比

| 实现层级 | 必须覆盖 | 可暂缓 |
| --- | --- | --- |
| 入门版 | 状态不可逆、`then` 注册、异步执行 | thenable 吸收 |
| 面试版 | 链式调用、错误捕获、返回 Promise 处理 | 完整 Promise/A+ 测试 |
| 完整版 | Promise Resolution Procedure、静态方法 | 性能优化 |

手写题不需要一上来写完整规范，先保证主链路正确，再说明完整版要补哪些边界。

## 易错点提示

1. 状态只能从 pending 变到 fulfilled 或 rejected。
2. `then` 必须返回新的 Promise。
3. executor 里的同步异常要捕获并 reject。
4. 已 settled 后注册的回调也要异步执行。
5. 回调返回 Promise 时，外层要跟随它的状态。

## 记忆要点总结

- 三个状态、两个队列、一个 `then`。
- `resolve/reject` 改状态并触发队列。
- `then` 返回新 Promise 才能链式调用。
- 难点在返回值吸收和错误传播。

## 延伸问题

可以继续追问：126. [高级]** 如何实现一个简单的Promise？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：手写 Promise 的核心难点是什么？**  
A：不是状态枚举，而是 `then` 返回新 Promise 后如何根据回调返回值决定新 Promise 的状态。

**Q：为什么回调要异步执行？**  
A：原生 Promise 的 `then` 回调进入微任务队列，保证一致的异步时序。

## 辅助记忆总结

一句话记：手写 Promise 先抓住状态不可逆、回调队列、then 返回新 Promise。
