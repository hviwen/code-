import { ref, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useFetch, useFetchCacheStore } from '../composables/useFetch'

// Mock fetch for testing
global.fetch = jest.fn()

describe('useFetch', () => {
  beforeEach(() => {
    // Setup Pinia
    setActivePinia(createPinia())
    
    // Reset fetch mock
    ;(fetch as jest.Mock).mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'John Doe' }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: new Map([['content-type', 'application/json']])
    })

    const { data, loading, error, execute } = useFetch('/api/users', {
      immediate: false
    })

    expect(data.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()

    await execute()

    expect(data.value).toEqual(mockData)
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(fetch).toHaveBeenCalledWith('/api/users', expect.any(Object))
  })

  it('should handle errors correctly', async () => {
    const errorMessage = 'Network error'
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    const { data, loading, error, execute } = useFetch('/api/users', {
      immediate: false
    })

    try {
      await execute()
    } catch (err) {
      // Expected to throw
    }

    expect(data.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value?.message).toBe(errorMessage)
  })

  it('should cache responses', async () => {
    const mockData = { id: 1, name: 'John Doe' }
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
      headers: new Map([['content-type', 'application/json']])
    })

    const cacheStore = useFetchCacheStore()

    // First request
    const { execute: execute1 } = useFetch('/api/users', {
      immediate: false,
      cache: true
    })

    await execute1()
    expect(fetch).toHaveBeenCalledTimes(1)

    // Second request should use cache
    const { data: data2, execute: execute2 } = useFetch('/api/users', {
      immediate: false,
      cache: true
    })

    await execute2()
    expect(fetch).toHaveBeenCalledTimes(1) // Still only called once
    expect(data2.value).toEqual(mockData)
  })

  it('should handle reactive URLs', async () => {
    const mockData1 = { id: 1, name: 'John' }
    const mockData2 = { id: 2, name: 'Jane' }
    
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData1,
        headers: new Map([['content-type', 'application/json']])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData2,
        headers: new Map([['content-type', 'application/json']])
      })

    const userId = ref(1)
    const url = computed(() => `/api/users/${userId.value}`)

    const { data } = useFetch(url, { immediate: true })

    // Wait for initial request
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(data.value).toEqual(mockData1)
    expect(fetch).toHaveBeenCalledWith('/api/users/1', expect.any(Object))

    // Change URL
    userId.value = 2
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(data.value).toEqual(mockData2)
    expect(fetch).toHaveBeenCalledWith('/api/users/2', expect.any(Object))
  })

  it('should transform data', async () => {
    const mockData = { firstName: 'John', lastName: 'Doe' }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: new Map([['content-type', 'application/json']])
    })

    const { data, execute } = useFetch('/api/users', {
      immediate: false,
      transform: (data: any) => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
      })
    })

    await execute()

    expect(data.value).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe'
    })
  })

  it('should call success and error callbacks', async () => {
    const onSuccess = jest.fn()
    const onError = jest.fn()

    // Test success callback
    const mockData = { id: 1, name: 'John' }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: new Map([['content-type', 'application/json']])
    })

    const { execute } = useFetch('/api/users', {
      immediate: false,
      onSuccess,
      onError
    })

    await execute()

    expect(onSuccess).toHaveBeenCalledWith(mockData)
    expect(onError).not.toHaveBeenCalled()

    // Test error callback
    const error = new Error('Network error')
    ;(fetch as jest.Mock).mockRejectedValueOnce(error)

    try {
      await execute()
    } catch (err) {
      // Expected
    }

    expect(onError).toHaveBeenCalledWith(error)
  })

  it('should handle POST requests', async () => {
    const mockResponse = { id: 1, title: 'New Post' }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
      headers: new Map([['content-type', 'application/json']])
    })

    const postData = { title: 'New Post', body: 'Post content' }

    const { data, execute } = useFetch('/api/posts', {
      immediate: false,
      method: 'POST',
      body: postData,
      headers: { 'Content-Type': 'application/json' }
    })

    await execute()

    expect(fetch).toHaveBeenCalledWith('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
      signal: expect.any(AbortSignal)
    })
    expect(data.value).toEqual(mockResponse)
  })

  it('should clear cache', async () => {
    const mockData = { id: 1, name: 'John' }
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
      headers: new Map([['content-type', 'application/json']])
    })

    const { execute, clearCache } = useFetch('/api/users', {
      immediate: false,
      cache: true
    })

    // First request
    await execute()
    expect(fetch).toHaveBeenCalledTimes(1)

    // Clear cache
    clearCache()

    // Second request should fetch again
    await execute()
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('should refresh data', async () => {
    const mockData = { id: 1, name: 'John' }
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
      headers: new Map([['content-type', 'application/json']])
    })

    const { execute, refresh } = useFetch('/api/users', {
      immediate: false,
      cache: true
    })

    // First request
    await execute()
    expect(fetch).toHaveBeenCalledTimes(1)

    // Refresh should bypass cache
    await refresh()
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
