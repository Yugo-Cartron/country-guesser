<script setup lang="ts">

</script>

<template>
  <div class="main grid grid-cols-2 h-full">
    <div></div>
    <div class="flex h-100 flex-col items-center justify-center">
      <h1> Welcome to <br>Country Guesser</h1>
      <div class="grid grid-cols-2 mt-12 gap-10 text-2xl">
        <RouterLink to="/play">Play</RouterLink>
        <RouterLink to="/tutorial">How to play ?</RouterLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
h1 {
  font-family: "Abstract Groovy";
  font-size: 3rem;
  text-align: center;
  margin-top: 30%;
}

</style>