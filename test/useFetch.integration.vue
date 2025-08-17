<template>
  <div class="integration-test">
    <h2>useFetch Integration Test</h2>
    
    <div class="test-section">
      <h3>Test Results</h3>
      <div v-for="test in tests" :key="test.name" class="test-result">
        <span :class="test.status">{{ test.name }}: {{ test.status }}</span>
        <span v-if="test.error" class="error-detail">{{ test.error }}</span>
      </div>
    </div>

    <div class="test-section">
      <h3>Live Demo</h3>
      <button @click="runAllTests">Run All Tests</button>
      <button @click="testBasicFetch">Test Basic Fetch</button>
      <button @click="testCaching">Test Caching</button>
      <button @click="testReactiveUrl">Test Reactive URL</button>
      <button @click="testErrorHandling">Test Error Handling</button>
    </div>

    <div class="test-section">
      <h3>Cache Status</h3>
      <pre>{{ cacheStatus }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFetch, useFetchCacheStore } from '../composables/useFetch'

interface TestResult {
  name: string
  status: 'pending' | 'passed' | 'failed'
  error?: string
}

const tests = ref<TestResult[]>([
  { name: 'Basic Fetch', status: 'pending' },
  { name: 'Caching', status: 'pending' },
  { name: 'Reactive URL', status: 'pending' },
  { name: 'Error Handling', status: 'pending' },
  { name: 'Data Transformation', status: 'pending' },
  { name: 'POST Request', status: 'pending' }
])

const cacheStatus = ref('')
const cacheStore = useFetchCacheStore()

const updateTest = (name: string, status: 'passed' | 'failed', error?: string) => {
  const test = tests.value.find(t => t.name === name)
  if (test) {
    test.status = status
    test.error = error
  }
}

const updateCacheStatus = () => {
  const cache = Array.from(cacheStore.cache.entries()).map(([key, value]) => ({
    key: key.substring(0, 30) + '...',
    timestamp: new Date(value.timestamp).toLocaleString(),
    hasData: !!value.data
  }))
  
  cacheStatus.value = JSON.stringify({
    cachedItems: cache.length,
    items: cache
  }, null, 2)
}

const testBasicFetch = async () => {
  try {
    const { data, loading, error, execute } = useFetch<any[]>('https://jsonplaceholder.typicode.com/users', {
      immediate: false
    })

    await execute()

    if (data.value && Array.isArray(data.value) && data.value.length > 0) {
      updateTest('Basic Fetch', 'passed')
    } else {
      updateTest('Basic Fetch', 'failed', 'No data received')
    }
  } catch (err) {
    updateTest('Basic Fetch', 'failed', err instanceof Error ? err.message : String(err))
  }
  updateCacheStatus()
}

const testCaching = async () => {
  try {
    const startTime = Date.now()
    
    // First request
    const { execute: execute1 } = useFetch<any[]>('https://jsonplaceholder.typicode.com/posts', {
      immediate: false,
      cache: true
    })
    
    await execute1()
    const firstRequestTime = Date.now() - startTime
    
    // Second request (should be cached)
    const secondStartTime = Date.now()
    const { execute: execute2 } = useFetch<any[]>('https://jsonplaceholder.typicode.com/posts', {
      immediate: false,
      cache: true
    })
    
    await execute2()
    const secondRequestTime = Date.now() - secondStartTime
    
    // Cached request should be significantly faster
    if (secondRequestTime < firstRequestTime / 2) {
      updateTest('Caching', 'passed')
    } else {
      updateTest('Caching', 'failed', `First: ${firstRequestTime}ms, Second: ${secondRequestTime}ms`)
    }
  } catch (err) {
    updateTest('Caching', 'failed', err instanceof Error ? err.message : String(err))
  }
  updateCacheStatus()
}

const testReactiveUrl = async () => {
  try {
    const userId = ref(1)
    const url = computed(() => `https://jsonplaceholder.typicode.com/users/${userId.value}`)
    
    const { data } = useFetch<any>(url, { immediate: true })
    
    // Wait for initial request
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const firstUser = data.value
    
    // Change URL
    userId.value = 2
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const secondUser = data.value
    
    if (firstUser && secondUser && firstUser.id !== secondUser.id) {
      updateTest('Reactive URL', 'passed')
    } else {
      updateTest('Reactive URL', 'failed', 'URL change did not trigger new request')
    }
  } catch (err) {
    updateTest('Reactive URL', 'failed', err instanceof Error ? err.message : String(err))
  }
  updateCacheStatus()
}

const testErrorHandling = async () => {
  try {
    let errorCaught = false
    
    const { execute } = useFetch('https://jsonplaceholder.typicode.com/invalid-endpoint', {
      immediate: false,
      onError: () => {
        errorCaught = true
      }
    })
    
    try {
      await execute()
    } catch (err) {
      // Expected to throw
    }
    
    if (errorCaught) {
      updateTest('Error Handling', 'passed')
    } else {
      updateTest('Error Handling', 'failed', 'Error callback not called')
    }
  } catch (err) {
    updateTest('Error Handling', 'failed', err instanceof Error ? err.message : String(err))
  }
  updateCacheStatus()
}

const testDataTransformation = async () => {
  try {
    const { data, execute } = useFetch<any>('https://jsonplaceholder.typicode.com/users/1', {
      immediate: false,
      transform: (user: any) => ({
        ...user,
        displayName: `${user.name} (${user.email})`,
        isTransformed: true
      })
    })
    
    await execute()
    
    if (data.value && data.value.isTransformed && data.value.displayName) {
      updateTest('Data Transformation', 'passed')
    } else {
      updateTest('Data Transformation', 'failed', 'Data not transformed correctly')
    }
  } catch (err) {
    updateTest('Data Transformation', 'failed', err instanceof Error ? err.message : String(err))
  }
  updateCacheStatus()
}

const testPostRequest = async () => {
  try {
    const { data, execute } = useFetch<any>('https://jsonplaceholder.typicode.com/posts', {
      immediate: false,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        title: 'Test Post',
        body: 'This is a test post',
        userId: 1
      }
    })
    
    await execute()
    
    if (data.value && data.value.id) {
      updateTest('POST Request', 'passed')
    } else {
      updateTest('POST Request', 'failed', 'POST request did not return expected data')
    }
  } catch (err) {
    updateTest('POST Request', 'failed', err instanceof Error ? err.message : String(err))
  }
  updateCacheStatus()
}

const runAllTests = async () => {
  // Reset all tests
  tests.value.forEach(test => {
    test.status = 'pending'
    test.error = undefined
  })
  
  // Run tests sequentially
  await testBasicFetch()
  await testCaching()
  await testReactiveUrl()
  await testErrorHandling()
  await testDataTransformation()
  await testPostRequest()
}

onMounted(() => {
  updateCacheStatus()
})
</script>

<style scoped>
.integration-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.test-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
}

.pending {
  color: #6c757d;
  background: #f8f9fa;
}

.passed {
  color: #155724;
  background: #d4edda;
}

.failed {
  color: #721c24;
  background: #f8d7da;
}

.error-detail {
  font-size: 12px;
  color: #dc3545;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

button {
  margin: 5px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}

h2, h3 {
  color: #333;
}
</style>
