<script setup lang="ts">
import logo from "../assets/logo.png";
import { BACKGROUNDS } from "@/config";

const randomBg =
    BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
</script>



<template>
  <div class="home" :style="{ backgroundImage: `url(${randomBg})` }">
    <div class="overlay"></div>

    <div class="content">

      <img class="logo" :src="logo" alt="Logo" width="250px" />

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
  height: 100vh;
  position: relative;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  overflow: hidden;

}



.overlay {
  position: absolute;
  inset: 0;

  background:
      radial-gradient(circle at center, rgba(189,219,227, 0.2), rgba(0,0,0,0.8)),
      linear-gradient(180deg, rgba(82,144,155, 0.4), rgba(0,0,0,0.9));
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
  background: rgba(255,255,255,0.15);
  transform: translateY(-2px);
}

.home {
  //animation: bgZoom 20s ease infinite alternate;
}

@keyframes bgZoom {
  from {
    background-size: 100%;
  }
  to {
    background-size: 110%;
  }
}


</style>
