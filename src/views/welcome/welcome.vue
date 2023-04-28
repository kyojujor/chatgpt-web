<script setup lang="ts">
import { ref } from 'vue'

const name = ref('World')
</script>

<template>
  <div>Hello, {{ name }}!</div>
</template>
