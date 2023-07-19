<script setup lang="ts">
import Suggestion from "@/components/Input/Suggestion.vue";
import {computed, ref, watch} from "vue";
import {getCountryNames, getFlag} from "@/tools/repository";

const props = defineProps({
  incompleteGuess: {
    type: String,
    default: ""
  },
})
const emits = defineEmits(['selectedCountry'])
function emitSelectedCountry(selectedCountry: string) {
  emits('selectedCountry', selectedCountry)
}
const countries: string[] = getCountryNames()
const suggestions = computed(() => {
  if (props.incompleteGuess !== '') {
    return countries.filter((suggestion) => suggestion.includes(props.incompleteGuess))
  } else {
    return []
  }
})

</script>

<template>
  <div class="mt-4 rounded-xl bg-[#ffffffde] backdrop-blur-md drop-shadow-xl max-h-[25vh] overflow-y-auto 2xl:-translate-x-6">
    <Suggestion v-for="suggestion in suggestions"
                :country-name="suggestion"
                :flag="getFlag(suggestion)"
                @selected-country="(selectedCountry) => emitSelectedCountry(selectedCountry)"
    />
  </div>
</template>
