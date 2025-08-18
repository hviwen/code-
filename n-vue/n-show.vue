<template>
  <view class="wrapper">
    <text>hello</text>
  </view>
</template>

<script setup>

import useCounterStore from "../stores/counter";

const store = useCounterStore()

store.$onAction(({name, args, after, onError}) => {
  console.log(`action ${name} called`, args)
  after((result) => {
    console.log('action finished', result)
  })
  onError((err) => {
    console.error('action failed', err)
  })
})

const unsub = store.$subscribe(({mutation, state}) => {
  console.log('mutation type', mutation.type)
})


unsub()
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
