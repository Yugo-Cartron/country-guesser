<script setup lang="ts">
const props = defineProps({
  name: String
})

</script>

<template>
    <h3 class="flex justify-center text-xl py-7">{{ props.name }}</h3>
</template>

<style scoped>

</style>