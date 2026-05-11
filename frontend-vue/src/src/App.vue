<template>
  <div id="app">
    <AppHeader v-if="!isAdminRoute" />
    <RouterView />
    <CartSidebar v-if="!isAdminRoute" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader  from '@/components/AppHeader.vue'
import CartSidebar from '@/components/CartSidebar.vue'

const route        = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  background: #0a0a0a;
  color: white;
  min-height: 100vh;
}
</style>