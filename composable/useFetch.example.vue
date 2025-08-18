<template>
  <div class="fetch-example">
    <h2>useFetch Composable Example</h2>
    
    <!-- Basic Usage -->
    <section>
      <h3>Basic Usage</h3>
      <button @click="fetchUsers" :disabled="usersLoading">
        {{ usersLoading ? 'Loading...' : 'Fetch Users' }}
      </button>
      <button @click="refreshUsers">Refresh Users</button>
      <button @click="clearUsersCache">Clear Cache</button>
      
      <div v-if="usersError" class="error">
        Error: {{ usersError.message }}
      </div>
      
      <div v-if="users" class="data">
        <h4>Users ({{ users.length }}):</h4>
        <ul>
          <li v-for="user in users.slice(0, 3)" :key="user.id">
            {{ user.name }} ({{ user.email }})
          </li>
        </ul>
      </div>
    </section>

    <!-- Reactive URL -->
    <section>
      <h3>Reactive URL</h3>
      <input v-model="userId" placeholder="Enter user ID" type="number" />
      <div v-if="userLoading">Loading user...</div>
      <div v-if="userError" class="error">
        Error: {{ userError.message }}
      </div>
      <div v-if="user" class="data">
        <h4>User Details:</h4>
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Phone:</strong> {{ user.phone }}</p>
      </div>
    </section>

    <!-- POST Request -->
    <section>
      <h3>POST Request</h3>
      <input v-model="newPost.title" placeholder="Post title" />
      <textarea v-model="newPost.body" placeholder="Post content"></textarea>
      <button @click="createPost" :disabled="postLoading">
        {{ postLoading ? 'Creating...' : 'Create Post' }}
      </button>
      
      <div v-if="postError" class="error">
        Error: {{ postError.message }}
      </div>
      
      <div v-if="createdPost" class="data">
        <h4>Created Post:</h4>
        <p><strong>ID:</strong> {{ createdPost.id }}</p>
        <p><strong>Title:</strong> {{ createdPost.title }}</p>
      </div>
    </section>

    <!-- Cache Status -->
    <section>
      <h3>Cache Status</h3>
      <button @click="showCacheStatus">Show Cache Status</button>
      <pre v-if="cacheStatus">{{ cacheStatus }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFetch, useFetchCacheStore } from './useFetch'

// Types
interface User {
  id: number
  name: string
  email: string
  phone: string
}

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

// Basic fetch example
const {
  data: users,
  loading: usersLoading,
  error: usersError,
  execute: fetchUsers,
  refresh: refreshUsers,
  clearCache: clearUsersCache
} = useFetch<User[]>('https://jsonplaceholder.typicode.com/users', {
  immediate: false,
  cache: true,
  onSuccess: (data) => {
    console.log('Users fetched successfully:', data.length)
  },
  onError: (error) => {
    console.error('Failed to fetch users:', error)
  }
})

// Reactive URL example
const userId = ref(1)
const userUrl = computed(() => `https://jsonplaceholder.typicode.com/users/${userId.value}`)

const {
  data: user,
  loading: userLoading,
  error: userError
} = useFetch<User>(userUrl, {
  immediate: true,
  cache: true
})

// POST request example
const newPost = ref({
  title: '',
  body: ''
})

const {
  data: createdPost,
  loading: postLoading,
  error: postError,
  execute: executeCreatePost
} = useFetch<Post>('https://jsonplaceholder.typicode.com/posts', {
  immediate: false,
  cache: false,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  transform: (data: any) => ({
    ...data,
    title: data.title.toUpperCase() // Transform response
  })
})

const createPost = async () => {
  if (!newPost.value.title || !newPost.value.body) {
    alert('Please fill in both title and body')
    return
  }

  try {
    await executeCreatePost()
    // Reset form on success
    newPost.value = { title: '', body: '' }
  } catch (error) {
    // Error is already handled by onError callback
  }
}

// Cache status
const cacheStatus = ref('')
const cacheStore = useFetchCacheStore()

const showCacheStatus = () => {
  const cache = Array.from(cacheStore.cache.entries()).map(([key, value]) => ({
    key: key.substring(0, 50) + '...',
    timestamp: new Date(value.timestamp).toLocaleString(),
    dataSize: JSON.stringify(value.data).length
  }))
  
  const pending = Array.from(cacheStore.pendingRequests.keys()).map(key => 
    key.substring(0, 50) + '...'
  )
  
  cacheStatus.value = JSON.stringify({
    cachedItems: cache,
    pendingRequests: pending
  }, null, 2)
}
</script>

<style scoped>
.fetch-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

h3 {
  margin-top: 0;
  color: #333;
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

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

input, textarea {
  margin: 5px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

textarea {
  width: 300px;
  height: 80px;
  resize: vertical;
}

.error {
  color: #dc3545;
  background: #f8d7da;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.data {
  background: #d4edda;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}

ul {
  margin: 10px 0;
}

li {
  margin: 5px 0;
}
</style>
