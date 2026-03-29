import fs from "fs";
import puppeteer from "puppeteer";
import { players } from "./config/players.js";

// nur die wichtigen Informationen speichern
function simplifyCard(card) {
  if (!card) return null;

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


async function fetchDeck(page, id) {
  console.log(`➡️ Lade Deck via API: ${id}`);

  const data = await page.evaluate(async (deckId) => {
    const res = await fetch(`https://api2.moxfield.com/v2/decks/all/${deckId}`, {
      credentials: "include",
    });

    if (!res.ok) {
      return { error: true, status: res.status };
    }

    return res.json();
  }, id);

  if (!data || data.error) {
    console.error("❌ API Fehler bei:", id, data);
    return null;
  }

  console.log(`✅ Deck geladen: ${data.name}`);

  return {
    id,
    name: data.name,
    commanders: Object.fromEntries(
        Object.entries(data.commanders).map(([key, entry]) => [
          key,
          {
            quantity: entry.quantity,
            card: simplifyCard(entry.card),
          },
        ])
    ),
    colors: data.colors,
    mainboard: Object.fromEntries(
        Object.entries(data.mainboard).map(([key, entry]) => [
          key,
          {
            quantity: entry.quantity,
            isFoil: entry.isFoil,
            card: simplifyCard(entry.card),
          },
        ])
    ),
  };
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  await page.setViewport({
    width: 1280,
    height: 800,
  });

  // 🔥 WICHTIG: Session aufbauen
  await page.goto("https://moxfield.com", {
    waitUntil: "networkidle2",
  });

  const result = [];

for (const player of players) {
  console.log(`\n👤 Spieler: ${player.name}`);

  const playerDecks = [];

  for (const id of player.decks) {
    const data = await fetchDeck(page, id);

    if (data) {
      playerDecks.push(data);
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  result.push({
    name: player.name,
    decks: playerDecks,
  });
}

  const output = {
    updatedAt: new Date().toISOString(),
    players: result,
  };

  fs.writeFileSync(
      "public/data/decks.json",
      JSON.stringify(output, null, 2)
  );

  console.log("🎉 Alle Decks gespeichert!");

  await browser.close();
process.exit(0);

}

main();
