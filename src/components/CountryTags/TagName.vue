<script setup lang="ts">
const props = defineProps({
  name: String,
  flag: String
})

</script>

<template>
  <div class="flex flex-row gap-2">
    <img class="object-scale-down w-1/3" :src="props.flag" />
    <h3 class="flex w-full justify-center text-center text-xl py-7">{{ props.name }}</h3>
  </div>
</template>

<style scoped>

</style>