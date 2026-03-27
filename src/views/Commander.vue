
<script setup lang="ts">
import DeckCard from "../components/DeckCard.vue";
import { transformPlayer } from "../utils/transformDeck";
import { ref, onMounted } from "vue";

const players = ref<any[]>([]);
const openPlayers = ref<string[]>([]);

function togglePlayer(name: string) {
  if (openPlayers.value.includes(name)) {
    openPlayers.value = openPlayers.value.filter(p => p !== name);
  } else {
    openPlayers.value.push(name);
  }
}

function getPlayerStatus(player: any) {
  let hasInstantWin = false;
  let hasGameChanger = false;
  let hasOverBudget = false;

  player.decks.forEach((deck: any) => {
    if (deck.hasInstantWin) hasInstantWin = true;
    if (deck.hasGameChanger) hasGameChanger = true;
    if (deck.price > 125) hasOverBudget = true;
  });

  return {
    isClean: !hasInstantWin && !hasGameChanger && !hasOverBudget,
  };
}

// 🔥 HIER passiert der Magic Switch
onMounted(async () => {
  const res = await fetch("/data/decks.json");
  const rawData = await res.json();

  players.value = rawData.map(transformPlayer);
});
</script>


<template>
  <router-link class="back-link" to="/">← Zurück</router-link>




  <div class="container container--main">
    <h1>Gespielte Commander</h1>
  </div>


  <div class="container">
    <div v-for="player in players" :key="player.name" class="player-section">

      <!-- 👤 Spieler Name -->
      <h2
          class="player-name"
          @click="togglePlayer(player.name)"
      >
        {{ player.name }}
        <span class="count">({{ player.decks.length }} Decks)</span>

        <!-- 👇 STATUS -->
        <span
            class="status-badge"
            :class="getPlayerStatus(player).isClean ? 'status-clean' : 'status-bad'"
        >
  {{ getPlayerStatus(player).isClean ? "legal" : "illegal" }}
</span>

        <span class="arrow">
    {{ openPlayers.includes(player.name) ? "▲" : "▼" }}
  </span>
      </h2>

      <!-- 🧩 Deck Grid -->
      <div
          v-if="openPlayers.includes(player.name)"
          class="player-decks grid"
      >
        <DeckCard
            v-for="deck in player.decks"
            :key="deck.id"
            :deck="deck"
        />
      </div>

    </div>
  </div>
</template>
