<script setup lang="ts">
import DeckCard from "../components/DeckCard.vue";
import { transformPlayer } from "../utils/transformDeck";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

/**
 * -----------------------------
 * STATE
 * -----------------------------
 */

// Filter
const filterLegal = ref<"all" | "legal" | "illegal" | "editing">("all");
const filterPlayer = ref<string>("all");
const filterColors = ref<string[]>([]);
const filterIdeasOnly = ref(false);

// UI State
const dropdownRef = ref<HTMLElement | null>(null);
const showColorDropdown = ref(false);
const openPlayers = ref<string[]>([]);

// Daten
const players = ref<any[]>([]);
const lastUpdated = ref<string | null>(null);

/**
 * Farbdefinitionen für Filter
 */
const COLORS = [
  { key: "W", label: "Weiß" },
  { key: "U", label: "Blau" },
  { key: "B", label: "Schwarz" },
  { key: "R", label: "Rot" },
  { key: "G", label: "Grün" },
];

/**
 * Prüft ob irgendein Filter aktiv ist
 */
const hasActiveFilters = computed(() => {
  return (
      filterLegal.value !== "all" ||
      filterPlayer.value !== "all" ||
      filterColors.value.length > 0
  );
});

/**
 * -----------------------------
 * UI HELFER
 * -----------------------------
 */

/**
 * Öffnet / schließt Spieler-Akkordeon
 */
function togglePlayer(name: string) {
  if (openPlayers.value.includes(name)) {
    openPlayers.value = openPlayers.value.filter(p => p !== name);
  } else {
    openPlayers.value.push(name);
  }
}

/**
 * Schließt Dropdown bei Klick außerhalb
 */
function handleClickOutside(event: MouseEvent) {
  if (!dropdownRef.value) return;

  if (!dropdownRef.value.contains(event.target as Node)) {
    showColorDropdown.value = false;
  }
}

/**
 * -----------------------------
 * BUSINESS LOGIK
 * -----------------------------
 */

/**
 * Prüft ob ein Deck den Regeln entspricht
 */
function isDeckLegal(deck: any) {
  return !deck.hasInstantWin && !deck.hasGameChanger && deck.price <= 125;
}

/**
 * Filtert einzelne Decks anhand der gesetzten Filter
 */
function filterDeck(deck: any, playerName: string) {
  if (deck.isIdeasDeck) return false;

  // 🔥 Editing Filter (höchste Priorität)
  if (filterLegal.value === "editing") {
    return deck.isEditing === true;
  }

  // 🔹 Legal Filter
  if (filterLegal.value === "legal" && !isDeckLegal(deck)) return false;
  if (filterLegal.value === "illegal" && isDeckLegal(deck)) return false;

  // 🔹 Spieler Filter
  if (filterPlayer.value !== "all" && playerName !== filterPlayer.value) return false;

  // 🔹 Farbfilter
  if (filterColors.value.length > 0) {
    const hasAllColors = filterColors.value.every(color =>
        deck.colors.includes(color)
    );
    if (!hasAllColors) return false;
  }

  return true;
}

/**
 * Hauptberechnung der angezeigten Spieler + Decks
 */
const filteredPlayers = computed(() => {
  return players.value
      .map((player) => {
        // Normale Decks filtern
        const activeDecks = player.decks.filter((deck: any) =>
            filterDeck(deck, player.name)
        );

        // Ideen-Deck extrahieren (max. eins)
        const ideasDeck = player.decks.find((deck: any) => deck.isIdeasDeck);

        return {
          ...player,
          // Im Ideen-Modus keine normalen Decks anzeigen
          decks: filterIdeasOnly.value ? [] : activeDecks,
          ideasDeck,
        };
      })

      .filter((player) => {
        // Nur Ideen anzeigen
        if (filterIdeasOnly.value) {
          return !!player.ideasDeck;
        }

        // Filter aktiv → nur Spieler mit Treffern
        if (hasActiveFilters.value) {
          return player.decks.length > 0;
        }

        // Standard → alles anzeigen
        return player.decks.length > 0 || player.ideasDeck;
      });
});

/**
 * Berechnet den Status eines Spielers basierend auf seinen Decks
 */
function getPlayerStatus(player: any) {
  let hasInstantWin = false;
  let hasGameChanger = false;
  let hasOverBudget = false;

  player.decks.forEach((deck: any) => {
    // 🔥 Bearbeitungs-Decks ignorieren
    if (deck.isEditing) return;

    if (deck.hasInstantWin) hasInstantWin = true;
    if (deck.hasGameChanger) hasGameChanger = true;
    if (deck.price > 125) hasOverBudget = true;
  });

  return {
    isClean: !hasInstantWin && !hasGameChanger && !hasOverBudget,
  };
}

/**
 * Formatiert das Datum für die Anzeige
 */
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

/**
 * -----------------------------
 * LIFECYCLE
 * -----------------------------
 */

// Klick außerhalb überwachen
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

// Cleanup
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Daten laden
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
        <option value="editing">In Bearbeitung</option>
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

      <label class="ideas-toggle">
        <input type="checkbox" v-model="filterIdeasOnly" />
        Nur Deck Ideen anzeigen
      </label>
    </div>


    <div v-for="player in filteredPlayers" :key="player.name" class="player-section">

      <!-- Spieler Name -->
      <h2 class="player-name" @click="togglePlayer(player.name)">
        <span class="player-name__name">{{ player.name }}
          <span class="count">
            {{
                filterIdeasOnly
                    ? (player.ideasDeck?.ideaCards.length || 0) + " Ideen"
                    : player.decks.length + " Decks"
            }}
          </span>
        </span>

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

      <!-- Deck Grid -->
      <div v-if="openPlayers.includes(player.name)" class="player-decks grid">
        <DeckCard
            v-for="deck in player.decks"
            :key="deck.id"
            :deck="deck"
        />

        <div v-if="player.ideasDeck && (!hasActiveFilters || filterIdeasOnly)" class="ideas-section">
          <div class="ideas-title">Ideen</div>
          <div class="ideas-list">
            <a v-for="card in player.ideasDeck.ideaCards" :key="card.scryfall_id" class="ideas-item" :href="player.ideasDeck.url" target="_blank">
              <img class="ideas-image" :src="`https://cards.scryfall.io/normal/front/${card.scryfall_id?.slice(0,1)}/${card.scryfall_id?.slice(1,2)}/${card.scryfall_id}.jpg`"/>
              <span class="ideas-name">{{ card.name }}</span>
            </a>
          </div>
        </div>
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

.ideas-section {
  background: rgba(255,255,255,0.04);
  padding: 12px;
  margin-top: 10px;
  border-radius: 10px;
}

.ideas-title {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 20px;
  text-align: center;
  display: block;
}

.ideas-name {
  display: block;
  font-size: 12px;
}

.ideas-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.ideas-item {
  text-align: center;
  text-decoration: none;
  color: white;
  opacity: 0.8;
  margin-right: 15px;
}

.ideas-item:hover {
  opacity: 1;
  transform: translateY(-3px);
}

.ideas-image {
  width: 160px;
  border-radius: 8px;
}

.ideas-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  cursor: pointer;
  font-size: 12px;
}

.status-editing {
  background: rgba(255, 180, 50, 0.2);
  color: #ffb347;
}

</style>
