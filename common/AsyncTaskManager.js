class AsyncTaskManager {
  constructor() {
    this.tasks = new Map()
  }

  async execute(taskId, asyncFn, options = {}) {
    this.cancel(taskId)

    const abortController = new AbortController()
    const {timeout = 36000} = options
    const timeoutId = setTimeout(() => {
      abortController.abort()
    }, timeout)

    this.tasks.set(taskId, {
      abortController,
      timeoutId
    })

    try {
      return await asyncFn(abortController.signal)
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log(`Task ${taskId} was cancelled`)
      } else {
        throw err
      }
    } finally {
      clearTimeout(timeoutId)
      this.tasks.delete(taskId)
    }
  }

  cancel(taskId) {
    const task = this.tasks.get(taskId)
    if (task) {
      task.abortController.abort()
      clearTimeout(task.timeoutId)
      this.tasks.delete(taskId)
    }
  }

  cancelAll() {
    for (const [taskId] of this.tasks) {
      this.cancel(taskId)
    }
  }
}
