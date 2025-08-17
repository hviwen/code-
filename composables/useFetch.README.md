# useFetch Composable

A comprehensive Vue 3 Composition API composable for handling HTTP requests with advanced features including caching, request deduplication, Pinia integration, and TypeScript support.

## Features

- ✅ **Caching mechanism**: Automatic response caching to avoid redundant requests
- ✅ **Request deduplication**: Prevents multiple concurrent requests to the same endpoint
- ✅ **Pinia integration**: Seamless integration with Pinia store as caching layer
- ✅ **TypeScript support**: Full type safety with generic types
- ✅ **Error handling**: Comprehensive error handling with proper error states
- ✅ **Loading states**: Reactive loading indicators for UI feedback
- ✅ **Cache invalidation**: Methods to clear or refresh cached data
- ✅ **Reactive URLs**: Support for reactive URL parameters
- ✅ **Request timeout**: Configurable request timeouts
- ✅ **Request abortion**: Ability to cancel ongoing requests
- ✅ **Transform responses**: Custom data transformation functions
- ✅ **Lifecycle callbacks**: Success and error callbacks

## Installation

The composable is already included in your project. Make sure you have the required dependencies:

```bash
npm install vue@^3.0.0 pinia@^2.0.0
```

## Basic Usage

```typescript
import { useFetch } from './composables/useFetch'

// Simple GET request
const { data, loading, error, execute } = useFetch<User[]>('/api/users')

// Manual execution
const { data, loading, error, execute } = useFetch<User[]>('/api/users', {
  immediate: false
})

// Execute manually
await execute()
```

## API Reference

### useFetch(url, options?)

#### Parameters

- **url**: `string | Ref<string>` - The URL to fetch from (can be reactive)
- **options**: `UseFetchOptions<T>` - Configuration options

#### Options

```typescript
interface UseFetchOptions<T = any> {
  immediate?: boolean          // Execute immediately (default: true)
  cache?: boolean             // Enable caching (default: true)
  cacheKey?: string          // Custom cache key
  transform?: (data: any) => T // Transform response data
  onError?: (error: Error) => void // Error callback
  onSuccess?: (data: T) => void    // Success callback
  headers?: Record<string, string> // Request headers
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' // HTTP method
  body?: any                  // Request body
  timeout?: number           // Request timeout in ms (default: 10000)
}
```

#### Returns

```typescript
interface UseFetchReturn<T> {
  data: Ref<T | null>        // Response data
  loading: Ref<boolean>      // Loading state
  error: Ref<Error | null>   // Error state
  execute: () => Promise<T | null>  // Execute request
  refresh: () => Promise<T | null>  // Refresh (bypass cache)
  clearCache: () => void     // Clear cache for this request
  abort: () => void          // Abort current request
}
```

## Examples

### Basic GET Request

```typescript
const { data: users, loading, error } = useFetch<User[]>('/api/users', {
  onSuccess: (data) => console.log('Fetched', data.length, 'users'),
  onError: (error) => console.error('Failed to fetch users:', error)
})
```

### POST Request

```typescript
const { data, loading, error, execute } = useFetch<Post>('/api/posts', {
  immediate: false,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: { title: 'New Post', content: 'Post content' }
})

// Execute when needed
await execute()
```

### Reactive URL

```typescript
const userId = ref(1)
const userUrl = computed(() => `/api/users/${userId.value}`)

const { data: user } = useFetch<User>(userUrl)

// Changing userId will automatically trigger a new request
userId.value = 2
```

### Data Transformation

```typescript
const { data } = useFetch<ProcessedUser[]>('/api/users', {
  transform: (rawUsers: RawUser[]) => 
    rawUsers.map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      isActive: user.status === 'active'
    }))
})
```

### Cache Management

```typescript
const { data, refresh, clearCache } = useFetch<User[]>('/api/users')

// Refresh data (bypass cache)
await refresh()

// Clear cache for this endpoint
clearCache()

// Access global cache store
import { useFetchCacheStore } from './composables/useFetch'
const cacheStore = useFetchCacheStore()

// Clear all cache
cacheStore.clearCache()
```

### Request Abortion

```typescript
const { data, loading, abort } = useFetch<User[]>('/api/users')

// Abort the request
const handleCancel = () => {
  abort()
}
```

## Advanced Features

### Pinia Integration

The composable automatically integrates with Pinia for caching:

```typescript
// Access the cache store directly
import { useFetchCacheStore } from './composables/useFetch'

const cacheStore = useFetchCacheStore()

// Check cached data
const cachedData = cacheStore.getCachedData('cache-key')

// Set cached data manually
cacheStore.setCachedData('cache-key', data)
```

### Request Deduplication

Multiple concurrent requests to the same endpoint are automatically deduplicated:

```typescript
// These will share the same request
const request1 = useFetch('/api/users')
const request2 = useFetch('/api/users')
const request3 = useFetch('/api/users')
```

### Error Handling

```typescript
const { data, error, execute } = useFetch<User[]>('/api/users', {
  onError: (error) => {
    // Handle specific error types
    if (error.message.includes('404')) {
      // Handle not found
    } else if (error.message.includes('timeout')) {
      // Handle timeout
    }
  }
})

// Or handle errors manually
try {
  await execute()
} catch (error) {
  // Handle error
}
```

## TypeScript Support

The composable provides full TypeScript support:

```typescript
interface User {
  id: number
  name: string
  email: string
}

// Type-safe response
const { data } = useFetch<User[]>('/api/users')
// data.value is typed as User[] | null

// Type-safe transformation
const { data } = useFetch<string[]>('/api/users', {
  transform: (users: User[]) => users.map(u => u.name)
})
// data.value is typed as string[] | null
```

## Best Practices

1. **Use reactive URLs** for dynamic endpoints
2. **Enable caching** for frequently accessed data
3. **Provide custom cache keys** for complex scenarios
4. **Use transform functions** for data processing
5. **Handle errors gracefully** with callbacks
6. **Clear cache** when data becomes stale
7. **Abort requests** when components unmount (automatic)

## Performance Considerations

- Cached responses reduce network requests
- Request deduplication prevents redundant calls
- Automatic cleanup prevents memory leaks
- Configurable timeouts prevent hanging requests
- Transform functions run only once per request

## Browser Compatibility

Compatible with all modern browsers that support:
- Vue 3
- Fetch API
- AbortController
- Pinia

For older browsers, consider polyfills for Fetch API and AbortController.
