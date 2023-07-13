<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import type {Country} from "@/model/Country";
import countriesJson from "../assets/countries.json"
import TagHistoryLine from "@/components/CountryTags/TagLine.vue";
import Autocomplete from "@/components/Autocomplete.vue";

export type tagHistoryLineProps = {
  country: Country,
  truthTable: Array<boolean>,
  directionTable: Array<number>
}

const guess = ref('')
const unknownCountry = ref('')
const unknownAnswer = ref(false)
const countries = ref<Map<string, Country>>(new Map())
const tagHistoryLineList = ref<tagHistoryLineProps[]>([])
let answer: Country | undefined;
const annabelle = ref(false)
const hint = ref(false)
const guessCount = ref(0)

onMounted(() => {
  getDataFromJson();
  newGame()
})

function newGame() {
  answer = pickARandomAnswer()
  console.log(answer)
  tagHistoryLineList.value = []
  hint.value = false
  annabelle.value = false
  guess.value = ''
  guessCount.value = 0
}

function pickARandomAnswer() {
  const countryNames = Array.from(countries.value.keys())
  const randomCountryIndex = Math.floor(Math.random() * countries.value.size)
  const randomCountryName = countryNames[randomCountryIndex]
  return countries.value.get(randomCountryName)
}

const incompleteGuess = computed(() => {
  return guess.value
})

function pickACountryWithAutocomplete(selectedCountry: string) {
  guess.value = selectedCountry
  evaluateGuess()
}

function evaluateGuess() {
  unknownAnswer.value = false
  if(guess.value !== ''){
    if (guess.value === 'Annabelle') {
      annabelle.value = true
      guess.value =''
      return
    } else {
      annabelle.value = false
    }
    if (isValid(guess.value)) {
      displayAttributes(countries.value.get(guess.value)!)

      if (guess.value === answer!.name)
        PlayerWin()
    } else {
      unknownAnswer.value = true
      unknownCountry.value = guess.value
    }
    guessCount.value ++
    guess.value = ''
  }
}

function getDataFromJson() {
  countriesJson.forEach((country) => {
    countries.value.set(country.name, {
      name: country.name,
      lat: country.latitude,
      long: country.longitude,
      landArea: country.landArea,
      continents: country.continents,
      population: country.population,
      flag: country.flag,
    })
  })
}

function isValid(guess: string): boolean {
  return countries.value.has(guess)
}

function PlayerWin() {
}

function displayAttributes(country: Country) {
  let truthTable: Array<boolean> = []
  let directionTable: Array<number> = []
  addLat(country, truthTable, directionTable)
  addLong(country, truthTable, directionTable)
  addLandArea(country, truthTable, directionTable)
  addContinent(country, truthTable)
  addPopulation(country, truthTable, directionTable)

  tagHistoryLineList.value.push({
    country: country,
    truthTable: truthTable,
    directionTable: directionTable,
  })
  updateCompass(country)
}

function addLat(country: Country, truthTable: Array<boolean>, directionTable: Array<Number>) {
  const latResult = answer!.lat - country.lat;
  if (latResult === 0) {
    truthTable.push(true);
    directionTable.push(4);
  }
  if (latResult > 0) {
    truthTable.push(false);
    directionTable.push(0);
  }
  if (latResult < 0) {
    truthTable.push(false);
    directionTable.push(2);
  }
}

function addLong(country: Country, truthTable: Array<boolean>, directionTable: Array<Number>) {
  const longResult = answer!.long - country.long;
  if (longResult === 0) {
    truthTable.push(true);
    directionTable.push(4);
  }
  if (longResult > 0) {
    truthTable.push(false);
    directionTable.push(1);
  }
  if (longResult < 0) {
    truthTable.push(false);
    directionTable.push(3);
  }
}

function addLandArea(country: Country, truthTable: Array<boolean>, directionTable: Array<Number>) {
  const landAreaDiff = answer!.landArea - country.landArea;
  if (landAreaDiff === 0) {
    truthTable.push(true);
    directionTable.push(4);
  }
  if (landAreaDiff > 0) {
    truthTable.push(false);
    directionTable.push(0);
  }
  if (landAreaDiff < 0) {
    truthTable.push(false);
    directionTable.push(2);
  }
}

function addContinent(country: Country, truthTable: Array<boolean>) {
  country.continents === answer!.continents
      ? truthTable.push(true)
      : truthTable.push(false)
}

function addPopulation(country: Country, truthTable: Array<boolean>, directionTable: Array<Number>) {
  const populationDiff = answer!.population - country.population;
  if (populationDiff === 0) {
    truthTable.push(true);
    directionTable.push(4);
  }
  if (populationDiff > 0) {
    truthTable.push(false);
    directionTable.push(0);
  }
  if (populationDiff < 0) {
    truthTable.push(false);
    directionTable.push(2);
  }
}


function updateCompass(country: Country) {
  if(country.long !== answer!.long) {
    let angleInRad = Math.atan(
        (answer!.lat - country.lat )
        /
        (answer!.long - country.long)
    )

    if (country.long < answer!.long) {
      angleInRad -= Math.PI
    }
    const compassArrow = document.getElementById("compassArrow")
    compassArrow!.setAttribute("style", "transform: rotate(" + -(angleInRad) + "rad)")

  }
}

function displayHint() {
  hint.value = !hint.value
}

</script>

<template>
  <div class="flex flex-row h-screen">
    <div class="flex flex-col w-1/3 items-center pt-20 bg-[#F5FEFF]">

      <div class="flex flex-col items-start">
        <h1 class="tracking-[.4rem] font-bold">COUNTRY<a class="bg-[#BF8055] text-[#ffffff] p-1">GUESSER</a></h1>
        <h2 class="mt-10 font-semibold">Try to find the country</h2>
        <p class="mt-5">Each guess will give you more information about :</p>
        <ul class="list-disc pl-10 pt-3">
          <li>Latitude</li>
          <li>Longitude</li>
          <li>Land area</li>
          <li>Continents</li>
          <li>Population</li>
        </ul>
      </div>


      <form @submit.prevent="evaluateGuess" class="flex flex-col mt-16">
        <label class="font-semibold text-left mb-2">Make a guess : </label>
        <p v-if="unknownAnswer" class="text-red-400 mb-1"><b>{{ unknownCountry }}</b> is not a country.</p>
        <div class="flex flex-row bg-[#eeeeee] rounded-full text-xl -translate-x-6 py-1 border hover:border-[#BF8055]">
          <input class="pl-6 py-2" v-model="guess" placeholder="Ex: Argentina..."/>
          <button class="bg-[#BF8055] text-[#ffffff] rounded-full mr-2 m-1 py-3 px-8" type="submit" value="submit">
            Submit
          </button>
        </div>
        <div class="relative">
          <Autocomplete id="autocomplete" class="absolute w-full top-0 z-50" :incomplete-guess="incompleteGuess" @selected-country="(selectedCountry) => pickACountryWithAutocomplete(selectedCountry)"/>
        </div>
      </form>
      <div class="flex flex-row text-xl gap-4 py-8">
        <div v-if="(guessCount < 5)" class="bg-[#eeeeee] text-[#bbbbbb] rounded-full py-3 px-8">
          {{5-guessCount}} left
        </div>
        <button v-else class="bg-[#BF8055] text-[#ffffff] rounded-full py-3 px-8"
        @click="displayHint">
          Hint
        </button>
        <button class="bg-[#BF8055] text-[#ffffff] rounded-full py-3 px-8"
        @click="newGame">
          Restart
        </button>
      </div>
      <img v-if="hint" :src="answer!.flag" class="py-2 flex justify-center rounded-2xl items-center max-h-[15vh] drop-shadow-2xl" />
      <p v-if="annabelle">Thank you Annabelle for your wonderful design</p>
      <img v-if="annabelle" class="max-h-[20vh]" src="../assets/backgrounds/annabelle.png"/>
      <h3 class="absolute bottom-0 text-4xl text-[#bbbbbb] left-0 ml-4 mb-4">Yugo Cartron © 2023 </h3>
    </div>


    <div class="rightPart flex flex-col w-2/3 h-full bg-[url('../assets/backgrounds/237.jpg)]">
      <div class="flex flex-row max-h-[30vh] mt-5 px-20 gap-10 items-center justify-around">
        <img class="max-h-[30vh] w-2/3 drop-shadow-xl object-scale-down" src="../assets/backgrounds/world.svg"/>
        <div class="relative items-center">
          <img class="object-scale-down opacity-60 max-h-[30vh] drop-shadow-2xl" src="../assets/compass-modified.png" />
          <div id="compassArrow" class="absolute top-1/2 h-0 w-full  transition-all duration-1000">
            <img class="-translate-y-1/2 scale-75 mx-8" src="../assets/compassArrow-2.svg">
          </div>
          <div class="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 bg-[#FDF1E7] border-2 border-[#D98366] rounded-full"></div>
        </div>
      </div>
      <div
          class="my-5 mx-10 p-6 overflow-y-auto snap-end max-h-[70vh] rounded-xl bg-[#ffffffde] backdrop-blur-md drop-shadow-2xl">
        <div class="flex flex-row mb-6">
          <h3 class="flex w-1/6 items-center justify-center">COUNTRY</h3>
          <h3 class="flex w-1/6 items-center justify-center">LATITUDE</h3>
          <h3 class="flex w-1/6 items-center justify-center">LONGITUDE</h3>
          <h3 class="flex w-1/6 items-center justify-center">LAND AREA</h3>
          <h3 class="flex w-1/6 items-center justify-center">CONTINENT</h3>
          <h3 class="flex w-1/6 items-center justify-center">POPULATION</h3>
        </div>
        <div id="historyGrid" class="flex flex-col-reverse gap-2">
          <TagHistoryLine v-for="tagHistoryLine in tagHistoryLineList"
                          :country="tagHistoryLine.country"
                          :truthTable="tagHistoryLine.truthTable"
                          :directionTable="tagHistoryLine.directionTable"
          />

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>



textarea:focus, input:focus {
  outline: none;
}

h1 {
  font-size: 2.5rem;
  text-align: center;
}

h2 {
  font-size: 1.75rem;
  text-align: left;
}

h3, label {
  font-size: 1.5rem;
}

p, li {
  font-size: 1rem;
}

.rightPart {
  background-image: url("../assets/backgrounds/237.jpg");
  background-size: cover;
}
</style>