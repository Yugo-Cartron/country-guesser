<script setup lang="ts">
import {computed, ref} from "vue";

import Autocomplete from "@/components/Input/Autocomplete.vue";
import {isValid} from "@/tools/repository";

const guess = ref('')
const isUnknownAnswer = ref(false)
const unknownCountry = ref('')

const emits = defineEmits(
  ['guess', 'annabelle']
)

function evaluateGuess() {
  if (guess.value !== '') {
    if (guess.value === 'Annabelle') {
      emits('annabelle', true)
      guess.value = ''
      return
    }
    if (isValid(guess.value)) {
      emits('guess', guess.value)
    } else {
      isUnknownAnswer.value = true
      unknownCountry.value = guess.value
      setTimeout(() => {
        isUnknownAnswer.value = false
      }, 3000)
    }
    guess.value = ''
  }
}

const incompleteGuess = computed(() => {
  return guess.value
})

function pickACountryWithAutocomplete(selectedCountry: string) {
  guess.value = selectedCountry
  evaluateGuess()
}
</script>

<template>
  <form @submit.prevent="evaluateGuess" class="flex flex-col w-full mt-16">
    <label class="font-semibold text-left mb-2">Make a guess : </label>
    <p v-if="isUnknownAnswer" class="text-red-400 mb-1"><b>{{ unknownCountry }}</b> is not a country.</p>
    <div class="flex flex-row w-full bg-[#eeeeee] rounded-full text-xl 2xl:-translate-x-6 py-1 border hover:border-[#BF8055]">
      <input class="pl-6 py-2" v-model="guess" placeholder="Ex: Argentina..."/>
      <button class="hidden 2xl:flex 2xl:translate-x-6 bg-[#BF8055] text-[#ffffff] rounded-full m-1 py-3 px-8" type="submit" value="submit">
        Submit
      </button>
    </div>
    <div class="relative">
      <Autocomplete id="autocomplete" class="absolute w-full top-0 z-50" :incomplete-guess="incompleteGuess" @selected-country="(selectedCountry) => pickACountryWithAutocomplete(selectedCountry)"/>
    </div>
    <p class="2xl:hidden italic text-gray-700 mt-1 text-right">Press Enter to submit</p>
  </form>
</template>

<style scoped>
textarea:focus, input:focus {
  outline: none;
}
</style>