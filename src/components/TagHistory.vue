<script setup lang="ts">
import {ref} from "vue";
import arrow from "../assets/arrow.svg"

const props = defineProps({
  label: String,
  rotation: String,
  good: Boolean,
})
const isArrow = ref(true)
isArrow.value = !props.good

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
  const digitsCount = bigNumber.length
  if (bigNumber.includes('.')) {
    const pointIndex = bigNumber.indexOf('.')
    return bigNumber.slice(0, pointIndex + 3)
  }
  if ( digitsCount > 6 ) {
    return bigNumber.slice(0, -6) + " M"
  }
  if( digitsCount > 3 ) {
    return bigNumber.slice(0, -3) + " k"
  }
  return bigNumber

}
</script>

<template>
  <div>
    <div :class="`rounded-full flex flex-row w-fit h-fit mx-auto my-auto py-0.5 px-6 gap-2 justify-center items-center bg-[${backgroundColor}]`">
      <img v-if="isArrow" :class="`w-fit h-fit ${ props.rotation }`" :src="arrow" />
      <p class="text-white text-xl">{{ tagLabel }}</p>
    </div>
  </div>
</template>

<style scoped>
</style>