<script setup lang="ts">

import arrow from "@/assets/arrow.svg";
import {ref} from "vue";

const props = defineProps({
  label: String,
  good: Boolean,
  rotation: String,
})

const isArrow = ref(true)
isArrow.value = !props.good

const direction = ref(props.label)
switch(props.rotation) {
  case "rotate-0" :
    direction.value = "North"
    break
  case "rotate-90" :
    direction.value = "East"
    break
  case "rotate-180" :
    direction.value = "South"
    break
  case "-rotate-90" :
    direction.value = "West"
    break
  default:
    direction.value = canBeCastToNumber(props.label!)
        ? enhanceBigNumbers(props.label!)
        : props.label
}

const backgroundColor=ref('#CC0033')
backgroundColor.value =
    props.good ? "#009934" : "#CC0033";

const tagLabel = ref(props.label)

tagLabel.value = canBeCastToNumber(props.label!)
    ? enhanceBigNumbers(props.label!)
    : props.label

function canBeCastToNumber(str: string): boolean {
  return !isNaN(+str);
}
function enhanceBigNumbers(bigNumber: string) {
  if (bigNumber.includes('.')) {
    const pointIndex = bigNumber.indexOf('.')
    return bigNumber.slice(0, pointIndex + 3)
  }
  return bigNumber

}
</script>

<template>
  <div>
    <div :class="`rounded-full flex flex-row w-fit h-fit mx-auto my-auto py-0.5 px-6 gap-2 justify-center items-center bg-[${backgroundColor}]`">
      <img v-if="isArrow" :class="`w-fit h-fit ${ props.rotation }`" :src="arrow" />
      <p class="text-white text-xl">{{ direction }}</p>
    </div>
  </div>
</template>

<style scoped>
</style>