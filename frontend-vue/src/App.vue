<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import CartSidebar from '@/components/CartSidebar.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <div id="app">
    <AppHeader v-if="!isAdminRoute" />
    <RouterView /> <CartSidebar v-if="!isAdminRoute" />
  </div>
</template>