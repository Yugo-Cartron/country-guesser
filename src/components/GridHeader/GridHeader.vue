<script setup lang="ts">
const props = defineProps({
  title: String
})
</script>

<template>
  <h3 class="flex w-1/6 items-center justify-center">{{ props.title }}</h3>
</template>

<style scoped>
h3 {
  font-size: 1.35rem;
}
</style>