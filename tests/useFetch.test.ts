import assert from 'node:assert/strict'
import { beforeEach, describe, it } from 'node:test'
import './setup.ts'

const { computed, ref, nextTick } = await import('vue')
const { createPinia, setActivePinia } = await import('pinia')
const { useFetch } = await import('../src/composables/useFetch.ts')

type FetchCall = [string, RequestInit]
type QueuedResult =
  | { type: 'resolve'; value: any }
  | { type: 'reject'; value: Error }

const fetchMock = Object.assign(
  async (...args: FetchCall) => {
    fetchMock.calls.push(args)
    const next = fetchMock.queue.shift()
    if (next?.type === 'reject') throw next.value
    if (next?.type === 'resolve') return next.value
    if (fetchMock.defaultResult) return fetchMock.defaultResult
    throw new Error('No fetch mock result queued')
  },
  {
    calls: [] as FetchCall[],
    queue: [] as QueuedResult[],
    defaultResult: null as any,
    reset() {
      this.calls = []
      this.queue = []
      this.defaultResult = null
    },
    mockResolvedValue(value: any) {
      this.defaultResult = value
      return this
    },
    mockResolvedValueOnce(value: any) {
      this.queue.push({ type: 'resolve', value })
      return this
    },
    mockRejectedValueOnce(value: Error) {
      this.queue.push({ type: 'reject', value })
      return this
    },
  },
)

globalThis.fetch = fetchMock as any

const jsonResponse = (data: any) => ({
  ok: true,
  json: async () => data,
  headers: new Map([['content-type', 'application/json']]),
})

describe('useFetch', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMock.reset()
  })

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'John Doe' }
    fetchMock.mockResolvedValueOnce(jsonResponse(mockData))

    const { data, loading, error, execute } = useFetch('/api/users', {
      immediate: false,
    })

    assert.equal(data.value, null)
    assert.equal(loading.value, false)
    assert.equal(error.value, null)

    await execute()

    assert.deepEqual(data.value, mockData)
    assert.equal(loading.value, false)
    assert.equal(error.value, null)
    assert.equal(fetchMock.calls[0][0], '/api/users')
  })

  it('should handle errors correctly', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'))

    const { data, loading, error, execute } = useFetch('/api/users', {
      immediate: false,
    })

    await assert.rejects(execute, /Network error/)

    assert.equal(data.value, null)
    assert.equal(loading.value, false)
    assert.equal(error.value?.message, 'Network error')
  })

  it('should cache responses', async () => {
    const mockData = { id: 1, name: 'John Doe' }
    fetchMock.mockResolvedValue(jsonResponse(mockData))

    const { execute: execute1 } = useFetch('/api/users', {
      immediate: false,
      cache: true,
    })

    await execute1()
    assert.equal(fetchMock.calls.length, 1)

    const { data: data2, execute: execute2 } = useFetch('/api/users', {
      immediate: false,
      cache: true,
    })

    await execute2()
    assert.equal(fetchMock.calls.length, 1)
    assert.deepEqual(data2.value, mockData)
  })

  it('should handle reactive URLs', async () => {
    const mockData1 = { id: 1, name: 'John' }
    const mockData2 = { id: 2, name: 'Jane' }

    fetchMock
      .mockResolvedValueOnce(jsonResponse(mockData1))
      .mockResolvedValueOnce(jsonResponse(mockData2))

    const userId = ref(1)
    const url = computed(() => `/api/users/${userId.value}`)

    const { data } = useFetch(url, { immediate: true })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    assert.deepEqual(data.value, mockData1)
    assert.equal(fetchMock.calls[0][0], '/api/users/1')

    userId.value = 2
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    assert.deepEqual(data.value, mockData2)
    assert.equal(fetchMock.calls[1][0], '/api/users/2')
  })

  it('should transform data', async () => {
    const mockData = { firstName: 'John', lastName: 'Doe' }
    fetchMock.mockResolvedValueOnce(jsonResponse(mockData))

    const { data, execute } = useFetch('/api/users', {
      immediate: false,
      transform: (data: any) => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
      }),
    })

    await execute()

    assert.deepEqual(data.value, {
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
    })
  })

  it('should call success and error callbacks', async () => {
    const calls = {
      success: [] as any[],
      error: [] as Error[],
    }

    const mockData = { id: 1, name: 'John' }
    fetchMock.mockResolvedValueOnce(jsonResponse(mockData))

    const { execute } = useFetch('/api/users', {
      immediate: false,
      cache: false,
      onSuccess: data => calls.success.push(data),
      onError: error => calls.error.push(error),
    })

    await execute()

    assert.deepEqual(calls.success, [mockData])
    assert.deepEqual(calls.error, [])

    const error = new Error('Network error')
    fetchMock.mockRejectedValueOnce(error)

    await assert.rejects(execute, /Network error/)

    assert.deepEqual(calls.error, [error])
  })

  it('should handle POST requests', async () => {
    const mockResponse = { id: 1, title: 'New Post' }
    fetchMock.mockResolvedValueOnce(jsonResponse(mockResponse))

    const postData = { title: 'New Post', body: 'Post content' }

    const { data, execute } = useFetch('/api/posts', {
      immediate: false,
      method: 'POST',
      body: postData,
      headers: { 'Content-Type': 'application/json' },
    })

    await execute()

    const [url, options] = fetchMock.calls[0]
    assert.equal(url, '/api/posts')
    assert.equal(options.method, 'POST')
    assert.deepEqual(options.headers, { 'Content-Type': 'application/json' })
    assert.equal(options.body, JSON.stringify(postData))
    assert.ok(options.signal instanceof AbortSignal)
    assert.deepEqual(data.value, mockResponse)
  })

  it('should clear cache', async () => {
    const mockData = { id: 1, name: 'John' }
    fetchMock.mockResolvedValue(jsonResponse(mockData))

    const { execute, clearCache } = useFetch('/api/users', {
      immediate: false,
      cache: true,
    })

    await execute()
    assert.equal(fetchMock.calls.length, 1)

    clearCache()

    await execute()
    assert.equal(fetchMock.calls.length, 2)
  })

  it('should refresh data', async () => {
    const mockData = { id: 1, name: 'John' }
    fetchMock.mockResolvedValue(jsonResponse(mockData))

    const { execute, refresh } = useFetch('/api/users', {
      immediate: false,
      cache: true,
    })

    await execute()
    assert.equal(fetchMock.calls.length, 1)

    await refresh()
    assert.equal(fetchMock.calls.length, 2)
  })
})
