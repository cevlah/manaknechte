<script setup lang="ts">
import logo from "../assets/logo.png";
import {BACKGROUNDS} from "@/config";
import { ref, onMounted } from "vue";

const randomBg =
    BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];




type Spark = {
  id: number;
  style: Record<string, string>;
};

const sparks = ref<Spark[]>([]);

function createSpark(id: number): Spark {
  const left = Math.random() * 100;
  const size = Math.random() * 4 + 2; // 2–6px
  const duration = Math.random() * 6 + 10;
  const delay = Math.random() * 5;

  const drift = (Math.random() - 0.5) * 120;

  return {
    id,
    style: {
      left: `${left}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      "--drift": `${drift}px`,
    },
  };
}

onMounted(() => {
  sparks.value = Array.from({ length: 15 }, (_, i) => createSpark(i));
});




</script>


<template>
  <div class="home" :style="{ backgroundImage: `url(${randomBg})` }">
    <div class="overlay"></div>

    <!-- 🔥 SPARKS -->
    <div class="sparks">
      <span
          v-for="spark in sparks"
          :key="spark.id"
          class="spark"
          :style="spark.style"
      />
    </div>

    <div class="content">

      <img class="logo" :src="logo" alt="Logo" width="250px"/>

      <nav class="nav">
        <router-link to="/hausregeln">Hausregeln</router-link>
        <router-link to="/pflege">Deckpflege</router-link>
        <router-link to="/commander">Commander</router-link>
      </nav>
    </div>

  </div>
</template>


<style lang="css">

.home {
  height: 100dvh;
  position: relative;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  overflow: hidden;

}


.overlay {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(189, 219, 227, 0.2), rgba(0, 0, 0, 0.8)),
  linear-gradient(180deg, rgba(82, 144, 155, 0.4), rgba(0, 0, 0, 0.9));
}

.content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.logo {
  width: 180px;
  position: relative;
  top: 10px;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.7));
  transition: all 0.2s ease;

  opacity: 0;
  transform: translateY(-20px);
  animation: logoEnter 0.6s ease forwards;
  animation-delay: 0.7s; /* 👈 DAS IST DER FIX */
}

@keyframes logoEnter {
  to {
    opacity: 0.8;
    transform: translateY(0);
  }
}


.nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  top: -40px;
}

.nav a {
  padding: 13px 20px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
  text-decoration: none;
  color: white;
  font-weight: bold;
  transition: all 0.2s ease;
  margin-bottom: 5px;
  width: 220px;
  text-align: center;

  opacity: 0;
  transform: translateY(30px);
  animation: navEnter 0.5s ease forwards;
}

.nav a:nth-child(1) {
  animation-delay: 0.2s;
}

.nav a:nth-child(2) {
  animation-delay: 0.35s;
}

.nav a:nth-child(3) {
  animation-delay: 0.5s;
}

@keyframes navEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.nav a:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}


.sparks {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  opacity: 0.3;
}

.spark {
  position: absolute;
  bottom: -20px;


  border-radius: 50%;

  background: radial-gradient(
      circle,
      rgba(255, 200, 120, 1) 0%,
      rgba(255, 120, 50, 0.8) 40%,
      rgba(255, 80, 20, 0.2) 70%,
      transparent 100%
  );

  box-shadow:
      0 0 6px rgba(255, 150, 50, 0.8),
      0 0 12px rgba(255, 80, 20, 0.6);

  animation:
      sparkFloat linear infinite,
      flicker 0.3s infinite alternate;

}

@keyframes sparkFloat {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  25% {
    transform: translate(calc(var(--drift) * 0.3), -25vh) scale(1.05);
  }

  50% {
    transform: translate(calc(var(--drift) * -0.4), -55vh) scale(1.1);
  }

  75% {
    transform: translate(calc(var(--drift) * 0.2), -85vh) scale(0.9);
  }

  100% {
    transform: translate(calc(var(--drift) * -0.2), -120vh) scale(0.6);
    opacity: 0;
  }
}

@keyframes flicker {
  from { opacity: 0.8; }
  to { opacity: 1; }
}

</style>
