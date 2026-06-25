import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore, type User } from '../stores/user'

export default function useFetch(url: RequestInfo | URL) {
  const data = ref<User | null>(null)
  const error = ref<unknown>(null)
  const isLoading = ref(true)
  const userStore = useUserStore()

  const { user } = storeToRefs(userStore)

  const fetchData = async () => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      data.value = await response.json()

      user.value = data.value
      userStore.setLoginStatus(true)
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  fetchData()

  return {
    data,
    error,
    isLoading,
  }
}
