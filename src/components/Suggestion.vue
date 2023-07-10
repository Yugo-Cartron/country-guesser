<script setup lang="ts">

const props = defineProps({
  countryName: String,
  flag: String
})

const emits = defineEmits([
    'selectedCountry'
])

function emitSelectedCountry() {
  emits('selectedCountry', props.countryName)
}


</script>

<template>

  <div class="flex flex-row items-center" @click="emitSelectedCountry">
    <div class="w-16 m-4">
      <img :src="props.flag" />
    </div>
    <h2 class="text-lg">{{ props.countryName }}</h2>
  </div>

</template>

<style scoped>

</style>