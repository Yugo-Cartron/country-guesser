<script setup lang="ts">
import TagHistory from "@/components/CountryTags/TagWithNumber.vue";
import TagName from "@/components/CountryTags/TagName.vue";
import type {Country} from "@/model/Country";
import TagContinent from "@/components/CountryTags/TagContinent.vue";
import TagLocation from "@/components/CountryTags/TagLocation.vue";

const props = defineProps({
  country: {
    type: Object as () => Country,
    default: {
      name: "",
      lat: 0.0,
      long: 0.0,
      landArea: 0.0,
      continent: "Europe",
      population: "0",
      flag: ""
    }
  },
  truthTable: {
    type: Array<boolean>,
    default: [false, false, false, false, false]
  },
  directionTable: {
    type: Array<number>,
    default: [0, 0, 0, 0]
  },
})

function arrowRotation(direction: number) {
  if(direction < 4 ) {
    switch (direction) {
      case 0:
        return "rotate-0"
      case 1:
        return "rotate-90"
      case 2:
        return "rotate-180"
      case 3:
        return "-rotate-90"
      default :
        return "correct"
    }
  }
}

</script>

<template>
  <div v-if="true" class="tagline flex flex-row">
    <TagName id="name" class="flex w-1/6 justify-start" :name="props.country.name" :flag="props.country.flag"/>
    <TagLocation id="lat" class="flex w-1/6 justify-center" :label="props.country.lat.toString()" :good="props.truthTable[0]" :rotation="arrowRotation(props.directionTable[0])"/>
    <TagLocation class="flex w-1/6 justify-center" :label="props.country.long.toString()" :good="props.truthTable[1]" :rotation="arrowRotation(props.directionTable[1])"/>
    <TagHistory class="flex w-1/6 justify-center" :label="props.country.landArea.toString()" :good="props.truthTable[2]" :rotation="arrowRotation(props.directionTable[2])"/>
    <TagContinent class="flex w-1/6 justify-center" :continent="props.country.continents" :good="props.truthTable[3]" />
    <TagHistory class="flex w-1/6 justify-center" :label="props.country.population.toString()" :good="props.truthTable[4]" :rotation="arrowRotation(props.directionTable[3])"/>
  </div>
  <div class="border-t-2 border-[#BDBDBD]"></div>
</template>

<style scoped>

.tagline {
  animation: fade 0.8s;
}

@keyframes fade {
  0% { opacity: 0}
100% { opacity: 1}
}

</style>