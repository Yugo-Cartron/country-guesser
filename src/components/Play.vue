<script setup lang="ts">
import {onMounted, ref} from 'vue'
import type {Country} from "@/model/Country";
import countriesJson from "../assets/countries.json"
import TagHistory from "@/components/TagHistory.vue";

export type tagHistoryProps = {
  isCountryName: boolean,
  label: string,
  direction: number,
  good: boolean
}

const guess = ref('')
let countries: Map<String, Country> = new Map()
const tagHistoryList = ref<tagHistoryProps[]>([])
let answer: Country;

onMounted(() => {
  getDataFromJson();
  answer = pickARandomAnswer()
  console.log(answer)
})

function pickARandomAnswer() {
  const countryNames = Array.from(countries.keys())
  const randomCountryIndex = Math.floor(Math.random() * countries.size)
  const randomCountryName = countryNames[randomCountryIndex]
  return countries.get(randomCountryName)
}
function evaluateGuess() {
 if (isValid(guess.value)) {
   displayAttributes(countries.get(guess.value))
   if(guess.value === answer.name)
     PlayerWin()
 }
 guess.value = ''
}

function getDataFromJson() {
  countriesJson.forEach((country) => {
    countries.set(country.name, {
      name: country.name,
      lat: country.latitude,
      long: country.longitude,
      landArea: country.landArea,
      continents: country.continents,
      population: country.population
    })
  })
}

function isValid(guess: string): boolean {
  return countries.has(guess)
}

function PlayerWin() {}
function displayAttributes(country: Country) {
  displayCountryName(country)
  displayLat(country)
  displayLong(country)
  displayLandArea(country)
  displayContinent(country)
  displayPopulation(country)
}

function displayCountryName(country: Country) {
  addCountryNameHistory(country.name)
}
function displayLat(country: Country) {
  const latResult = answer.lat - country.lat;
  if(latResult === 0) {
    addTagHistory(country.lat.toString(), 4, true)
  }
  if(latResult > 0) {
    addTagHistory("North", 0, false)
  }
  if(latResult < 0) {
    addTagHistory("South", 2, false)
  }
}
function displayLong(country: Country) {
  const longResult = answer.long - country.long;
  if(longResult === 0) {
    addTagHistory(country.long.toString(), 4, true)
  }
  if(longResult > 0) {
    addTagHistory("East", 1, false)
  }
  if(longResult < 0) {
    addTagHistory("West", 3, false)
  }
}

function displayLandArea(country: Country) {
  const landAreaDiff = answer.landArea - country.landArea;
  if (landAreaDiff === 0) {
    addTagHistory(country.landArea.toString(), 4, true)
  }
  if(landAreaDiff > 0) {
    addTagHistory(country.landArea.toString(), 0, false)
  }
  if(landAreaDiff < 0) {
    addTagHistory(country.landArea.toString(), 2, false)
  }
}

function displayContinent(country: Country) {
  country.continents === answer.continents
      ? addTagHistory(country.continents, 4, true)
      : addTagHistory(country.continents, 4, false)
}

function displayPopulation(country: Country) {
  const populationDiff = answer.population - country.population;
  if (populationDiff === 0) {
    addTagHistory(country.population.toString(), 4, true)
  }
  if(populationDiff > 0) {
    addTagHistory(country.population.toString(), 0, false)
  }
  if(populationDiff < 0) {
    addTagHistory(country.population.toString(), 2, false)
  }
}

function addCountryNameHistory(countryName: string) {
  //TODO: ajouter icon cross or check
  tagHistoryList.value.push({isCountryName: true, label: countryName, direction: 0, good: true})
}

//Implementer enum direction
function addTagHistory(label: string, direction: number, good: boolean) {
  console.log(tagHistoryList)
  tagHistoryList.value.push({isCountryName: false, label: label, direction: direction, good: good})
  //
  // historyGrid!.appendChild(container)
  // void container.offsetWidth;
  // container.style.opacity = '1';
}

</script>

<template>
  <div class="flex flex-row h-screen">
    <div class="flex flex-col w-1/3 items-center mt-20">

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
        <label class="font-semibold mt-20 mb-5 text-left">Make a guess : </label>
      </div>



      <form @submit.prevent="evaluateGuess" class="flex flex-row bg-[#eeeeee] rounded-full text-xl pl-10 py-1 border hover:border-[#BF8055]">
        <input class="py-2" v-model="guess" placeholder="Ex: Argentina..." />
        <button class="bg-[#BF8055] text-[#ffffff] rounded-full mr-2 m-1 py-3 px-8" type="submit" value="submit">Submit</button>
      </form>

<!--      <div class="grid grid-cols-2 gap-10 text-2xl mt-20">-->
<!--        <RouterLink to="/">Back home</RouterLink>-->
<!--        <RouterLink to="/tutorial">How to play</RouterLink>-->
<!--      </div>-->
    </div>


    <div class="rightPart flex flex-col w-2/3 bg-[url('../assets/backgrounds/237.jpg)]">
      <div class="mt-8 mx-10 p-6 overflow-y-auto snap-end max-h-[50vh] rounded-xl bg-[#ffffffde] backdrop-blur-md">
        <div id="historyGrid" class="grid grid-cols-6 gap-2">
          <h3 class="flex items-center justify-center">Country</h3>
          <h3 class="flex items-center justify-center">Latitude</h3>
          <h3 class="flex items-center justify-center">Longitude</h3>
          <h3 class="flex items-center justify-center">LandArea</h3>
          <h3 class="flex items-center justify-center">Continent</h3>
          <h3 class="flex items-center justify-center">Population</h3>
          <TagHistory class="rounded-full" v-for="tagHistory in tagHistoryList"
            :is-country-name="tagHistory.isCountryName"
            :label="tagHistory.label"
            :direction="tagHistory.direction"
            :good="tagHistory.good"
          />
        </div>
      </div>

      <img class="h-[50vh] py-6 px-20 opacity-100 drop-shadow-xl items-center" src="../assets/backgrounds/world.svg"/>

    </div>
  </div>
</template>

<style scoped>
textarea:focus, input:focus{
  outline: none;
}

h1 {
  font-size: 2rem;
  text-align: center;
}

h2 {
  font-size: 1.5rem;
  text-align: left;
}

h3, label{
  font-size: 1.25rem;
}

p, li{
  font-size: 1rem;
}

.rightPart {
  background-image: url("../assets/backgrounds/237.jpg");
  background-size: cover;
}
</style>