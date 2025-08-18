import {onUnmounted, ref} from "vue";

export const useDebounce = (fn, delay = 300) => {
  let timer = ref(null)
  let last = ref(fn)

  const run = (...args) => {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => last.value(...args), delay)
  }

  const cancel = () => clearTimeout(timer.value)

  onUnmounted(cancel)
  return {
    run,
    cancel
  }
}
