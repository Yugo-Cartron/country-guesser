<script setup lang="ts">
import {ref} from "vue";
import arrow from "../assets/arrow.svg"

const props = defineProps({
  isCountryName: Boolean,
  label: String,
  direction: Number,
  good: Boolean,
})

const backgroundColor=ref('#CC0033')
backgroundColor.value =
    props.good ? "#009934" : "#CC0033";

const arrowDirection = ref('rotate-0')
const isArrow = ref(false)
const tagLabel = ref(props.label)

tagLabel.value = canBeCastToNumber(props.label)
  ? enhanceBigNumbers(props.label)
  : props.label

if( props.direction < 4 ) {
  isArrow.value = true
  switch (props.direction) {
    case 1:
      arrowDirection.value = "rotate-90"
      break
    case 2:
      arrowDirection.value = "rotate-180"
      break
    case 3:
      arrowDirection.value = "-rotate-90"
      break
    default :
      arrowDirection.value = "rotate-0"
      break
  }
}

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
  <div v-if="props.isCountryName">
    <h3 class="flex justify-center text-lg mx-10 py-7">{{ props.label }}</h3>
  </div>
  <div v-else :class="`tagHistory flex flex-row w-fit h-fit mx-auto my-auto py-0.5 px-6 gap-2 justify-center items-center bg-[${backgroundColor}]`">
    <img v-if="isArrow" :class="`w-fit h-fit ${arrowDirection}`" :src="arrow" />
    <p class="text-white text-xl">{{ tagLabel }}</p>
  </div>
</template>

<style scoped>

.tagHistory {
 font-size: 1rem;
 opacity: 1;
 transition: opacity 1s ease;
}


</style>