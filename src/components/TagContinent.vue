<script setup lang="ts">

import {ref} from "vue";

const props = defineProps({
  continent: String,
  good: Boolean
})

const backgroundColor=ref('#CC0033')
backgroundColor.value =
    props.good ? "#009934" : "#CC0033";

</script>

<template>
  <div>
    <div :class="`tagHistory flex flex-row rounded-full w-fit h-fit mx-auto my-auto py-0.5 px-6 gap-2 justify-center items-center bg-[${backgroundColor}]`">
      <p class="text-white text-xl">{{ props.continent }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>