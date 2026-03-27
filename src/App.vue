<script setup lang="ts">

</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="page">
      <component :is="Component" />
    </transition>
  </router-view>
</template>




<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');

.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}



.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 8px 14px;
  border-radius: 8px;

  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);

  color: white;
  text-decoration: none;
  font-size: 14px;

  transition: all 0.2s ease;

  position: relative;
  left: 20px;
  top: 20px;
}

.back-link:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(-4px);
}



</style>
