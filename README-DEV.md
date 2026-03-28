# 🧠 Manaknechte App – Developer Documentation

## 📦 Projektüberblick

Die **Manaknechte App** ist eine Vue 3 Webanwendung zur Darstellung und Analyse von Magic: The Gathering Commander-Decks innerhalb einer privaten Spielgruppe.

Ziel:

* Übersicht über alle Decks der Spieler
* Einhaltung von Hausregeln prüfen (Budget, Instant-Win, Gamechanger)
* Optisch ansprechende, mobile-first UI

---

## ⚙️ Tech Stack

* Vue 3 + TypeScript
* Vite
* Pinia (optional / je nach Ausbau)
* CSS (custom, kein Framework)
* Node.js Script (Puppeteer) für Datenbeschaffung

---

## 📁 Projektstruktur (relevant)

```
src/
  components/
    DeckCard.vue
  views/
    Home.vue
    Commander.vue
    Rules.vue
  utils/
    transformDeck.ts
  config/
    config.ts (z. B. GAMECHANGER_CARDS, BACKGROUNDS)
public/
  data/
    decks.json  ← generierte Datenbasis
scripts/
  fetchDecks.js ← Datenfetch Script
```

---

## 🔄 Datenfluss (sehr wichtig)

### 1. Datenquelle (Moxfield API)

Decks werden über folgende API geladen:

```
https://api2.moxfield.com/v2/decks/all/{id}
```

---

### 2. Fetch Script (`fetchDecks.js`)

* nutzt Puppeteer (wegen CORS/Auth)
* lädt Deckdaten pro Spieler
* reduziert Datenmenge via `simplifyCard()`

```js
function simplifyCard(card) {
  return {
    name: card.name,
    type_line: card.type_line,
    oracle_text: card.oracle_text,
    color_identity: card.color_identity,
    scryfall_id: card.scryfall_id,
    prices: {
      eur: card.prices?.eur,
      eur_foil: card.prices?.eur_foil,
    },
  };
}
```

---

### 3. Output

Wird gespeichert in:

```
public/data/decks.json
```

👉 Diese Datei wird im Frontend via `fetch()` geladen

---

## 🧮 Preisberechnung (kritischer Teil)

### ⚠️ Wichtig: Moxfield Verhalten

* Preise kommen von Scryfall (`eur`, `eur_foil`)
* Commander haben oft **nur `eur_foil`**
* Moxfield nutzt interne Fallbacks

---

### ✅ Aktuelle korrekte Logik

```ts
const unitPrice =
  entry.isFoil
    ? prices.eur_foil ?? prices.eur ?? 0
    : prices.eur ?? prices.eur_foil ?? 0;
```

👉 Wichtig:

* fallback auf jeweils anderen Preis
* verhindert 0€ Commander Bug

---

### 🧠 Kartenquellen

Preis wird berechnet aus:

```ts
addEntries(deck.commanders)
addEntries(deck.mainboard, { excludeBasicLands: true })
```

👉 Commander wird aktiv mitgerechnet

---

## 🚫 Hausregeln Logik

### Instant Win Detection

```ts
text.includes("win the game") ||
text.includes("lose the game")
```

---

### Gamechanger Detection

```ts
GAMECHANGER_CARDS.includes(card.name)
```

→ definiert in `config.ts`

---

### Budget

* Ziel: ~100€
* Toleranz: bis 125€
* UI zeigt:

    * grün = ok
    * rot = over budget

---

## 🎨 UI Features

### Home

* Random Background (aus `BACKGROUNDS`)
* Entry Animation (Logo + Nav)
* Sparks Effekt (Partikel)

---

### Commander View

* Collapsible Player Sections
* Status Badge:

    * `legal` / `illegal`

---

### DeckCard

* Gradient basierend auf Color Identity
* Preisanzeige mit Prozent
* Warnings:

    * Instant Win
    * Gamechanger

---

## 🔥 Visual Effects

### Sparks (Particle System)

* JS generiert Partikel
* CSS animiert:

    * Aufstieg
    * Drift (links/rechts)
    * Skalierung
    * Flicker

---

## ⚠️ Bekannte Stolpersteine

### 1. Commander Pricing Bug (gelöst)

Problem:

* `eur` oft null
* `eur_foil` vorhanden
* falsche Logik → 0€

Fix:
→ fallback verwenden

---

### 2. Große JSON Datei

Lösung:

* Reduktion via `simplifyCard`
* Speicherung in `/public`
* Laden via fetch statt import

---

### 3. Vite Build Fehler

* keine `//` Kommentare in CSS
* keine `<uniquifier>` Klassen aus Google Fonts

---

### 4. CORS Fehler nach Build

* `dist/index.html` nicht direkt öffnen
* nutzen:

  ```
  npm run preview
  ```

  oder Deployment (z. B. Render)

---

## 🚀 Deployment

Empfohlen:

* Render (Static Site)

Settings:

```
Build Command: npm run build
Publish Directory: dist
```

---

## 💡 Erweiterungsideen

* Filter / Sortierung
* Spielerstatistiken
* Deckvergleich
* Powerlevel-Indikator
* Favoriten / Tags
* Suche

---

## 🧠 Philosophie des Projekts

* Minimal Backend (nur Fetch Script)
* Frontend-first
* Daten statisch + performant
* Fokus auf UX & Übersicht

---

## 🤝 Zusammenarbeit

Für schnelle Hilfe:

👉 relevante Dateien posten:

* transformDeck.ts
* DeckCard.vue
* fetchDecks.js

👉 konkrete Frage stellen

---

## 🏁 TL;DR

* Daten kommen von Moxfield API
* werden reduziert gespeichert
* im Frontend transformiert
* Preislogik basiert auf eur/eur_foil fallback
* Commander wird mitgerechnet
* UI zeigt Regelverstöße

---

🔥 Status: Stabil & Erweiterbar
