<script setup lang="ts">
import {onMounted, ref} from 'vue'
import type {Country} from "@/model/Country";
import countriesJson from "../assets/countries.json"
import TagHistoryLine from "@/components/TagHistoryLine.vue";

export type tagHistoryLineProps = {
  country: Country,
  truthTable: Array<boolean>,
  directionTable: Array<number>
}

const guess = ref('')
let countries: Map<String, Country> = new Map()
const tagHistoryLineList = ref<tagHistoryLineProps[]>([])
let answer: Country | undefined;
const annabelle = ref(false)

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
  annabelle.value = (guess.value === 'Annabelle')
  if (isValid(guess.value)) {
    if (countries) {
      displayAttributes(countries.get(guess.value)!)
    }
    if (guess.value === answer!.name)
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

  console.log(tagHistoryLineList)

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


      <form @submit.prevent="evaluateGuess"
            class="flex flex-row bg-[#eeeeee] rounded-full text-xl pl-10 py-1 border hover:border-[#BF8055]">
        <input class="py-2" v-model="guess" placeholder="Ex: Argentina..."/>
        <button class="bg-[#BF8055] text-[#ffffff] rounded-full mr-2 m-1 py-3 px-8" type="submit" value="submit">
          Submit
        </button>
      </form>

      <img v-if="annabelle" src="../assets/backgrounds/annabelle.png"/>

      <!--      <div class="grid grid-cols-2 gap-10 text-2xl mt-20">-->
      <!--        <RouterLink to="/">Back home</RouterLink>-->
      <!--        <RouterLink to="/tutorial">How to play</RouterLink>-->
      <!--      </div>-->
    </div>


    <div class="rightPart flex flex-col w-2/3 bg-[url('../assets/backgrounds/237.jpg)]">
      <div
          class="mt-8 mx-10 p-6 overflow-y-auto snap-end max-h-[50vh] rounded-xl bg-[#ffffffde] backdrop-blur-md drop-shadow-2xl">
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
                          class="transition-opacity duration-500 ease-in-out"
                          :country="tagHistoryLine.country"
                          :truthTable="tagHistoryLine.truthTable"
                          :directionTable="tagHistoryLine.directionTable"
          />
        </div>
      </div>

      <img class="h-[50vh] py-6 px-20 opacity-100 drop-shadow-xl items-center" src="../assets/backgrounds/world.svg"/>

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

.transition-opacity {
  transition-property: opacity;
}
</style>