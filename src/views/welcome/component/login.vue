<script setup lang="ts">
import { useLogto } from '@logto/vue'

const { signIn, isAuthenticated } = useLogto()
const onClickSignIn = () => signIn('http://43.136.50.202:3003/')
</script>

<template>
  <div v-if="isAuthenticated">
    <div>Signed in</div>
  </div>
  <div v-else>
    <button @click="onClickSignIn">
      Sign In
    </button>
  </div>
</template>
