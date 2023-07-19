<script setup lang="ts">

import GridHeader from "@/components/GridHeader/GridHeader.vue";

const headers = [
  'COUNTRY',
  'LATITUDE',
  'LONGITUDE',
  'LAND AREA',
  'CONTINENT',
  'POPULATION'
]

</script>

<template>
  <div class="flex flex-row mb-6 min-w-[900px]">
    <GridHeader v-for="header in headers" :title="header" />
  </div>
</template>

<style scoped>

</style>