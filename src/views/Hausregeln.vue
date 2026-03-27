<script setup lang="ts">
import { ref, onMounted } from "vue";

const rules = ref<any>(null);

onMounted(async () => {
  const res = await fetch("/data/rules.json");
  rules.value = await res.json();
});
</script>


<template>
  <div class="rules site-container">
    <router-link class="back-link" to="/">← Zurück</router-link>

    <div v-if="rules">
      <div class="container container--main">
        <h1>{{ rules.title }}</h1>
      </div>

      <div
          v-for="section in rules.sections"
          :key="section.title"
          class="container"
      >
        <h2>
          {{ section.title }} <br />
          {{ section.subtitle }}
        </h2>
        <p v-html="section.text"></p>
      </div>
    </div>
  </div>
</template>



<style lang="css">

.container h2 {
  text-align: center;
}

</style>
