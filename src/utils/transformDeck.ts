import { GAMECHANGER_CARDS } from "../config";


export function transformDeck(deck: any) {
    
    


    
    
  const commanderEntry = Object.values(deck.commanders)[0] as any
  const commanderCard = commanderEntry?.card

  let totalPrice = 0
  let instantWinCards: string[] = [];
  let gameChangerCards: string[] = [];

  const addEntries = (entries: Record<string, any>, options?: { excludeBasicLands?: boolean }) => {
Object.values(entries).forEach((entry: any) => {
  const card = entry.card
  if (!card) return
  


  // 🔥 Instant Win Detection (HIER!)
  const text = card.oracle_text?.toLowerCase() || "";

if (
  text.includes("win the game") ||
  text.includes("lose the game")
) {
  instantWinCards.push(card.name);
}



// 🔥 Gamechanger
if (GAMECHANGER_CARDS.includes(card.name)) {
  if (!gameChangerCards.includes(card.name)) {
    gameChangerCards.push(card.name);
  }
}



  if (options?.excludeBasicLands && card.type_line?.includes("Basic Land")) {
    return
  }

  const prices = card.prices ?? {}

  const unitPrice =
    entry.isFoil && prices.eur_foil != null
      ? prices.eur_foil
      : prices.eur ?? 0

  totalPrice += unitPrice * (entry.quantity ?? 1)
})
  }

addEntries(deck.commanders)
addEntries(deck.mainboard, { excludeBasicLands: true })

const colorIdentity = commanderCard?.color_identity || [];


const hasInstantWin = instantWinCards.length > 0;
const hasGameChanger = gameChangerCards.length > 0;

return {
  id: deck.id,
  name: deck.name,
  commander: {
    name: commanderCard?.name,
    image: `https://cards.scryfall.io/normal/front/${commanderCard?.scryfall_id?.slice(0,1)}/${commanderCard?.scryfall_id?.slice(1,2)}/${commanderCard?.scryfall_id}.jpg`,
  },
  colors: colorIdentity,
  price: Number(totalPrice.toFixed(2)),
  cardCount: Object.keys(deck.mainboard).length,
  url: `https://moxfield.com/decks/${deck.id}`,
  hasInstantWin,
  instantWinCards, // 👈 gleich mit rein, brauchst du im UI
  hasGameChanger,
  gameChangerCards,
}
}

export function transformPlayer(player: any) {
  return {
    name: player.name,
    decks: player.decks.map(transformDeck),
  };
}