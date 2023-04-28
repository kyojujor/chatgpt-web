<script setup lang="ts">
import { useHandleSignInCallback } from '@logto/vue'
const { isLoading } = useHandleSignInCallback(() => {
  // Navigate to root path when finished
})
</script>

<template>
  <!-- When it's working in progress -->
  <p v-if="isLoading">
    登录成功，正在跳转。。。
  </p>
</template>
