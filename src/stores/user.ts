import { defineStore } from 'pinia'

export interface User {
  name: string
  age: number
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    login: false,
  }),

  getters: {
    isLogin: state => !!state.user,
  },

  actions: {
    login(user: User) {
      this.user = user
    },
    logout() {
      this.user = null
    },
    setUser(user: User) {
      this.user = user
    },
    clearUser() {
      this.user = null
    },
    setLoginStatus(status: boolean) {
      this.login = status
    },
  },
})
