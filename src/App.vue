<script setup lang="ts">
import Play from "@/components/Play.vue";
import {getDataFromJson} from "@/tools/repository"
import {onMounted} from "vue";

console.log("setup")
getDataFromJson()

onMounted(() => {
  console.log("onMounted")
})


</script>

<template>
  <Play/>
</template>

