<script setup lang="ts">
import {onMounted, ref} from 'vue'
import JSConfetti from "js-confetti";

import type {Country} from "@/model/Country";
import TagHistoryLine from "@/components/CountryTags/TagLine.vue";
import Input from "@/components/Input/Input.vue";
import {getCountry, pickARandomAnswer} from "@/tools/repository";
import GridHeaderLine from "@/components/GridHeader/GridHeaderLine.vue";

export type tagHistoryLineProps = {
  country: Country,
  truthTable: Array<boolean>,
  directionTable: Array<number>
}

const tagHistoryLineList = ref<tagHistoryLineProps[]>([])
let answer: Country | undefined;
const annabelle = ref(false)
const hint = ref(false)
const guessCount = ref(0)

onMounted(() => {
  newGame()
})

function newGame() {
  answer = pickARandomAnswer()
  console.log(answer)
  tagHistoryLineList.value = []
  hint.value = false
  annabelle.value = false
  guessCount.value = 0
}

function evaluateGuess(guess: string) {
  displayAttributes(getCountry(guess))

  if (guess === answer!.name)
    PlayerWin()

  guessCount.value ++
}

function easterEgg() {
  annabelle.value = true
  setTimeout(() => {
    annabelle.value = false
  }, 5000)
}

const jsConfetti = new JSConfetti()
function PlayerWin() {
  jsConfetti.addConfetti({
    // confettiColors: [
    //   '#FF0A54', '#45F8F8', '#7DF870', '#F8FF2E', '#9E3FF6', '#FF832E',
    // ],
    emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
    emojiSize: 40,
    // confettiRadius: 10,
    confettiNumber: 150,
  })
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
  let angleInRad = 0
  if(country.long !== answer!.long) {
    angleInRad = Math.atan(
        (answer!.lat - country.lat )
        /
        (answer!.long - country.long)
    )

    if (country.long < answer!.long) {
      angleInRad -= Math.PI
    }
  }
  else {
    angleInRad = country.lat > answer!.lat
        ? Math.PI/2
        : -Math.PI/2
  }
  const compassArrow = document.getElementById("compassArrow")
  compassArrow!.setAttribute("style", "transform: rotate(" + -(angleInRad) + "rad)")
}

function displayHint() {
  hint.value = !hint.value
}

</script>

<template>
  <div class="flex flex-col lg:flex-row h-screen">
    <div class="flex flex-col lg:w-1/3 items-center pt-20 bg-[#F5FEFF]">
      <div class="flex flex-col items-start">
        <div class="flex w-full items-center justify-center">
          <h1 class="tracking-[.4rem] font-bold">COUNTRY<br class="2xl:hidden"><span class="bg-[#BF8055] text-[#ffffff] p-1">GUESSER</span></h1>
        </div>
        <h2 class="mt-10 font-semibold">Try to find the country</h2>
        <p class="mt-5">Each guess will give you more information about :</p>
        <ul class="list-disc pl-10 pt-3">
          <li>Latitude</li>
          <li>Longitude</li>
          <li>Land area</li>
          <li>Continents</li>
          <li>Population</li>
        </ul>
        <Input @guess="(guessEmit) => evaluateGuess(guessEmit)"
               @annabelle="easterEgg"
        />
        <div class="flex flex-col w-full 2xl:flex-row text-xl gap-4 py-8 items-center justify-center">
          <div v-if="(guessCount < 5)" class="bg-[#eeeeee] text-[#bbbbbb] rounded-full py-3 px-8 text-center">
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
        <div v-if="hint" class="flex w-full justify-center items-center">
          <img :src="answer!.flag" class="py-2 flex rounded-2xl max-h-[15vh] drop-shadow-2xl" />
        </div>
        <p v-if="annabelle">Thank you Annabelle for your wonderful design</p>
        <img v-if="annabelle" class="max-h-[20vh]" src="../assets/backgrounds/annabelle.png"/>
        <h3 class="lg:hidden absolute top-0 text-4xl text-[#bbbbbb] left-0 ml-4 mb-4">Yugo Cartron © 2023 </h3>
        <h3 class="hidden lg:block absolute bottom-0 text-4xl text-[#bbbbbb] left-0 ml-4 mb-4">Yugo Cartron © 2023 </h3>
      </div>
    </div>


    <div class="rightPart flex flex-col-reverse lg:flex-col lg:w-2/3 h-full bg-[url('../assets/backgrounds/237.jpg)]">
      <div class="md:flex hidden md:flex-row max-h-[30vh] mt-5 px-20 gap-10 items-center justify-around">
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
          class="my-5 mx-10 p-6 overflow-y-auto lg:overflow-x-auto snap-end max-h-[65vh] rounded-xl bg-[#ffffffde] backdrop-blur-md drop-shadow-2xl">
        <GridHeaderLine />
        <div class="flex flex-col-reverse gap-2 min-w-[900px]">
          <TransitionGroup name="fade" >
            <div v-for="(tagHistoryLine,index) in tagHistoryLineList" :key="index">
              <TagHistoryLine
                  :country="tagHistoryLine.country"
                  :truthTable="tagHistoryLine.truthTable"
                  :directionTable="tagHistoryLine.directionTable"
              />
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

h1 {
  font-size: 2.5rem;
  text-align: center;
}

h2 {
  font-size: 1.75rem;
  text-align: left;
}

h3, label {
  font-size: 1.25rem;
}

p, li {
  font-size: 1rem;
}

.rightPart {
  background-image: url("../assets/backgrounds/237.jpg");
  background-size: cover;
}

.item {
  width: 100%;
  height: 30px;
  background-color: #f3f3f3;
  border: 1px solid #666;
  box-sizing: border-box;
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}

</style>