import { ref, computed, watch, onUnmounted, type Ref } from 'vue'
import { defineStore } from 'pinia'

// Types for the composable
export interface UseFetchOptions<T = any> {
  immediate?: boolean
  cache?: boolean
  cacheKey?: string
  transform?: (data: any) => T
  onError?: (error: Error) => void
  onSuccess?: (data: T) => void
  headers?: Record<string, string>
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: any
  timeout?: number
}

export interface UseFetchReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  execute: () => Promise<T | null>
  refresh: () => Promise<T | null>
  clearCache: () => void
  abort: () => void
}

// Cache store for managing fetch cache
export const useFetchCacheStore = defineStore('fetchCache', {
  state: () => ({
    cache: new Map<string, {
      data: any
      timestamp: number
      ttl: number
    }>(),
    pendingRequests: new Map<string, Promise<any>>()
  }),

  getters: {
    getCachedData: (state) => (key: string, ttl: number = 5 * 60 * 1000) => {
      const cached = state.cache.get(key)
      if (!cached) return null

      const isExpired = Date.now() - cached.timestamp > ttl
      if (isExpired) {
        state.cache.delete(key)
        return null
      }

      return cached.data
    },

    hasPendingRequest: (state) => (key: string) => {
      return state.pendingRequests.has(key)
    }
  },

  actions: {
    setCachedData(key: string, data: any, ttl: number = 5 * 60 * 1000) {
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      })
    },

    setPendingRequest(key: string, promise: Promise<any>) {
      this.pendingRequests.set(key, promise)

      // Clean up when promise resolves/rejects
      promise.finally(() => {
        this.pendingRequests.delete(key)
      })
    },

    clearCache(key?: string) {
      if (key) {
        this.cache.delete(key)
      } else {
        this.cache.clear()
      }
    },

    clearPendingRequest(key: string) {
      this.pendingRequests.delete(key)
    }
  }
})

// Default fetch function
const defaultFetch = async (url: string, options: RequestInit = {}): Promise<any> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

// Generate cache key from URL and options
const generateCacheKey = (url: string, options: UseFetchOptions): string => {
  if (options.cacheKey) {
    return options.cacheKey
  }

  const key = {
    url,
    method: options.method || 'GET',
    body: options.body,
    headers: options.headers
  }

  return btoa(JSON.stringify(key))
}

/**
 * Comprehensive fetch composable with caching, deduplication, and Pinia integration
 *
 * @param url - The URL to fetch from
 * @param options - Configuration options
 * @returns Reactive fetch state and control methods
 */
export const useFetch = <T = any>(
  url: string | Ref<string>,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> => {
  const {
    immediate = true,
    cache = true,
    transform,
    onError,
    onSuccess,
    headers = {},
    method = 'GET',
    body,
    timeout = 10000
  } = options

  // Reactive state
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Cache store instance
  const cacheStore = useFetchCacheStore()

  // Abort controller for cancelling requests
  let abortController: AbortController | null = null

  // Computed URL for reactive URL support
  const computedUrl = computed(() => {
    return typeof url === 'string' ? url : url.value
  })

  // Generate cache key
  const cacheKey = computed(() => {
    return generateCacheKey(computedUrl.value, options)
  })

  // Execute fetch request
  const execute = async (): Promise<T | null> => {
    const currentUrl = computedUrl.value
    const currentCacheKey = cacheKey.value

    // Reset error state
    error.value = null

    // Check cache first (if caching is enabled)
    if (cache) {
      const cachedData = cacheStore.getCachedData(currentCacheKey)
      if (cachedData !== null) {
        data.value = transform ? transform(cachedData) : cachedData
        return data.value
      }

      // Check for pending request (deduplication)
      if (cacheStore.hasPendingRequest(currentCacheKey)) {
        try {
          const result = await cacheStore.pendingRequests.get(currentCacheKey)!
          data.value = transform ? transform(result) : result
          return data.value
        } catch (err) {
          error.value = err instanceof Error ? err : new Error(String(err))
          onError?.(error.value)
          throw error.value
        }
      }
    }

    // Set loading state
    loading.value = true

    try {
      // Create abort controller
      abortController = new AbortController()

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          abortController?.abort()
          reject(new Error(`Request timeout after ${timeout}ms`))
        }, timeout)
      })

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: abortController.signal,
        ...(body && { body: typeof body === 'string' ? body : JSON.stringify(body) })
      }

      // Create fetch promise
      const fetchPromise = defaultFetch(currentUrl, fetchOptions)

      // Store pending request for deduplication
      if (cache) {
        cacheStore.setPendingRequest(currentCacheKey, fetchPromise)
      }

      // Race between fetch and timeout
      const result = await Promise.race([fetchPromise, timeoutPromise])

      // Transform data if transformer provided
      const transformedData = transform ? transform(result) : result

      // Update reactive state
      data.value = transformedData

      // Cache the result
      if (cache) {
        cacheStore.setCachedData(currentCacheKey, result)
      }

      // Call success callback
      onSuccess?.(transformedData)

      return transformedData

    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error(String(err))
      error.value = fetchError

      // Clear pending request on error
      if (cache) {
        cacheStore.clearPendingRequest(currentCacheKey)
      }

      // Call error callback
      onError?.(fetchError)

      throw fetchError

    } finally {
      loading.value = false
      abortController = null
    }
  }

  // Refresh function (bypasses cache)
  const refresh = async (): Promise<T | null> => {
    if (cache) {
      cacheStore.clearCache(cacheKey.value)
    }
    return execute()
  }

  // Clear cache function
  const clearCache = (): void => {
    if (cache) {
      cacheStore.clearCache(cacheKey.value)
    }
  }

  // Abort current request
  const abort = (): void => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    loading.value = false
  }

  // Watch URL changes and re-fetch if immediate is true
  watch(
    computedUrl,
    (newUrl, oldUrl) => {
      if (newUrl !== oldUrl && immediate) {
        execute().catch(() => {
          // Error is already handled in execute function
        })
      }
    },
    { immediate }
  )

  // Cleanup on unmount
  onUnmounted(() => {
    abort()
  })

  return {
    data: data as Ref<T | null>,
    loading,
    error,
    execute,
    refresh,
    clearCache,
    abort
  }
}
