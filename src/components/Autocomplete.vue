<script setup lang="ts">

import type {Country} from "@/model/Country";
import Suggestion from "@/components/Suggestion.vue";
import {onMounted, onUpdated, ref, watch} from "vue";
import countriesJson from "@/assets/countries.json";

const props = defineProps({
  incompleteGuess: {
    type: String,
    default: ""
  },
})

let countries: Map<string, string>

onMounted(() => {
  countries = new Map()
  countriesJson.forEach((country) => {
    countries.set(country.name, country.flag)
  })
})


const emits = defineEmits(['selectedCountry'])
function emitSelectedCountry(selectedCountry: string) {
  console.log(selectedCountry)
  emits('selectedCountry', selectedCountry)
}

const suggestions = ref<Array<string>>([])

watch(props, () => {
  if (props.incompleteGuess !== '') {
    suggestions.value = Array.from(countries.keys()).filter((suggestion) => suggestion.includes(props.incompleteGuess))
  } else {
    suggestions.value = []
  }
})

</script>

<template>
  <div class="mt-4 rounded-xl bg-[#ffffffde] backdrop-blur-md drop-shadow-xl max-h-[25vh] overflow-y-auto 2xl:-translate-x-6">
    <Suggestion v-for="suggestion in suggestions"
                :country-name="suggestion"
                :flag="countries.get(suggestion)"
                @selected-country="(selectedCountry) => emitSelectedCountry(selectedCountry)"
    />
  </div>
</template>

<style scoped>

</style>