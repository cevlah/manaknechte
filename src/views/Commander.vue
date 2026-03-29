
<script setup lang="ts">
import DeckCard from "../components/DeckCard.vue";
import { transformPlayer } from "../utils/transformDeck";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const dropdownRef = ref<HTMLElement | null>(null);
const filterLegal = ref<"all" | "legal" | "illegal">("all");
const filterPlayer = ref<string>("all");
const filterColors = ref<string[]>([]);

const players = ref<any[]>([]);
const openPlayers = ref<string[]>([]);
const showColorDropdown = ref(false);
const lastUpdated = ref<string | null>(null);

const COLORS = [
  { key: "W", label: "Weiß" },
  { key: "U", label: "Blau" },
  { key: "B", label: "Schwarz" },
  { key: "R", label: "Rot" },
  { key: "G", label: "Grün" },
];

function togglePlayer(name: string) {
  if (openPlayers.value.includes(name)) {
    openPlayers.value = openPlayers.value.filter(p => p !== name);
  } else {
    openPlayers.value.push(name);
  }
}

function handleClickOutside(event: MouseEvent) {
  if (!dropdownRef.value) return;

  if (!dropdownRef.value.contains(event.target as Node)) {
    showColorDropdown.value = false;
  }
}

function isDeckLegal(deck: any) {
  return !deck.hasInstantWin && !deck.hasGameChanger && deck.price <= 125;
}

const filteredPlayers = computed(() => {
  return players.value
      .map((player) => {
        const filteredDecks = player.decks.filter((deck: any) => {

          // 🔹 Legal Filter
          if (filterLegal.value === "legal" && !isDeckLegal(deck)) return false;
          if (filterLegal.value === "illegal" && isDeckLegal(deck)) return false;

          // 🔹 Player Filter
          if (filterPlayer.value !== "all" && player.name !== filterPlayer.value) return false;

          // 🔹 Multi Color AND Filter
          if (filterColors.value.length > 0) {
            const hasAllColors = filterColors.value.every(color =>
                deck.colors.includes(color)
            );

            if (!hasAllColors) return false;
          }

          return true;
        });

        return {
          ...player,
          decks: filteredDecks,
        };
      })
      .filter(player => player.decks.length > 0); // nur Spieler mit Treffern
});

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

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// 🔥 HIER passiert der Magic Switch
onMounted(async () => {
  const res = await fetch("/data/decks.json");
  const rawData = await res.json();

  lastUpdated.value = rawData.updatedAt;
  players.value = (rawData.players || []).map(transformPlayer);
});
</script>


<template>
  <router-link class="back-link" to="/">← Zurück</router-link>




  <div class="container container--main">
    <h1>Gespielte Commander</h1>
  </div>


  <div class="container">

    <div class="last-updated" v-if="lastUpdated">
      Letztes Update: {{ formatDate(lastUpdated) }}
    </div>


    <div class="filters">

      <!-- Legal -->
      <select v-model="filterLegal">
        <option value="all">Alle</option>
        <option value="legal">Legal</option>
        <option value="illegal">Illegal</option>
      </select>

      <!-- Spieler -->
      <select v-model="filterPlayer">
        <option value="all">Alle Spieler</option>
        <option v-for="p in players" :key="p.name" :value="p.name">
          {{ p.name }}
        </option>
      </select>

      <!-- Farben -->
      <div class="filter-dropdown" ref="dropdownRef">

        <button class="filter-button" @click="showColorDropdown = !showColorDropdown">
          Farben
          <span v-if="filterColors.length">
  ({{ filterColors.map(c => COLORS.find(x => x.key === c)?.label).join(", ") }})
</span>
          <span v-if="filterColors.length">({{ filterColors.length }})</span>
        </button>

        <div v-if="showColorDropdown" class="dropdown">
          <label v-for="c in COLORS" :key="c.key" class="dropdown-item">
            <input
                type="checkbox"
                :value="c.key"
                v-model="filterColors"
            />
            {{ c.label }}
          </label>

          <!-- optional reset -->
          <button class="reset" @click="filterColors = []">
            Zurücksetzen
          </button>
        </div>

      </div>

    </div>


    <div v-for="player in filteredPlayers" :key="player.name" class="player-section">

      <!-- 👤 Spieler Name -->
      <h2
          class="player-name"
          @click="togglePlayer(player.name)"
      >
        <span class="player-name__name">{{ player.name }} <span class="count">({{ player.decks.length }} Decks)</span></span>


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



<style lang="css">

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filters select {
  padding: 8px;
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  color: white;
  border: none;
}

.color-filter {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-filter label {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 6px;
  background: rgba(255,255,255,0.08);
  cursor: pointer;
}

.color-filter input {
  accent-color: #ff9800;
}

.filter-dropdown {
  position: relative;
}

.filter-button {
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  color: white;
  border: none;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  min-width: 160px;

  background: rgba(20,20,20,0.95);
  backdrop-filter: blur(10px);

  border-radius: 10px;
  padding: 10px;

  box-shadow: 0 10px 30px rgba(0,0,0,0.5);

  z-index: 10;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 4px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(255,255,255,0.05);
}

.reset {
  margin-top: 8px;
  width: 100%;
  padding: 6px;
  border-radius: 6px;
  border: none;
  background: rgba(255,255,255,0.08);
  color: white;
  cursor: pointer;
}


.last-updated {
  font-size: 12px;
  opacity: 0.7;
  margin-top: -10px;
  margin-bottom: 15px;
}

</style>
