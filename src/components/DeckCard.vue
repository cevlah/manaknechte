<script setup lang="ts">
import { getColorGradient } from "../utils/colors";
import { getPriceStatus } from "../utils/price";

const props = defineProps<{
  deck: any;
}>();

const priceStatus = getPriceStatus(props.deck.price);
</script>

<template>
<div
  class="card"
  :class="{ 'card--illegal': deck.hasInstantWin || deck.hasGameChanger || deck.price > 125  }"
  :style="{
    background: getColorGradient(deck.colors),
  }"
>


    <a
      class="card__link"
      :href="deck.url"
      target="_blank"
    >


    <div class="card__inner">
      <img class="card__image" :src="deck.commander.image" />

      <div class="card__content">
        <h3 class="card__title">{{ deck.name }}</h3>
        <span class="card__commander">{{ deck.commander.name }}</span>

        <div class="card__price" :class="priceStatus">
          {{ deck.price }} €
          <span class="card__price-percent">
            ({{ Math.round((deck.price / 125) * 100) }}%)
          </span>
        </div>



        <div class="card__footer">

          <div v-if="deck.price > 125" class="card__warning">
            € Budget
          </div>

          <div v-if="deck.hasInstantWin" class="card__warning">
                ⚠ Instant-Win Mechanik <br>
                <span class="cards">{{ deck.instantWinCards.join(", ") }}</span>
            </div>

            <div v-if="deck.hasGameChanger" class="card__warning card__gamechanger">
                ⚡ Gamechanger: <br>
                <span>{{ deck.gameChangerCards.join(", ") }}</span>
            </div>
        </div>


      </div>
    </div>
    </a>
  </div>
</template>




<style lang="css">


.card {
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: inherit;
}

.card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}


.card--illegal {
   border: 5px solid #ff4444;
  box-shadow: 0 0 15px rgba(255, 68, 68, 0.6);
}


.card__link {
    text-decoration: none;
}


.card__inner {
    position: relative;
    height: 100%;
  background: linear-gradient(
    rgba(0,0,0,0.6),
    rgba(0,0,0,0.8)
  );
}


.card__image {
  width: 100%;
  height: auto;
  object-fit: cover;
}


.card__content {
  padding: 12px;
  color: white;
  padding-bottom: 70px;
}

.card__title {
  margin: 0;
  font-size: 16px;
}

.card__commander {
  font-size: 13px;
  opacity: 0.8;
}



.card__price {
      background: rgba(0,0,0,0.6);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
      width: 80%;
  padding: 6px 10px;
  border-radius: 10px;
  font-weight: bold;

      margin: 0 auto;
    margin-top: 10px;

        position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0px);
}



.card__price.low {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}


.card__price.mid {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}


.card__price.high {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}






.card__price-percent {
      margin-left: 6px;
  font-size: 11px;
  opacity: 0.7;
}




.card__footer {
  margin-top: 8px;
  font-weight: bold;
}


.card__warning {
background: rgba(255, 68, 68, 0.15);
  color: #ff4444;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  margin-top: 6px;
  font-weight: bold;
}

.card__gamechanger {

}






@media (max-width: 800px) {
    .card__inner {
        display: flex;
        flex-direction: row;
    }

    .card__image {
        width: 50%;
    }

    .card__content {
        position: relative;
    }

}







</style>
