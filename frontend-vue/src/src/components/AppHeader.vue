<template>
  <header class="header">
    <div class="logo" @click="$router.push('/')">VapeBay</div>

    <div class="search-wrap">
      <span class="search-icon">🔍</span>
      <input
        class="search-input"
        type="text"
        placeholder="Cari produk, brand..."
        :value="produkStore.searchQuery"
        @input="produkStore.setSearch($event.target.value)"
      />
    </div>

    <nav>
      <RouterLink to="/">Produk</RouterLink>
      <RouterLink v-if="auth.isAdmin" to="/admin">Admin</RouterLink>
      <button v-if="auth.isLoggedIn" class="btn-logout" @click="handleLogout">Logout</button>
      <RouterLink v-else to="/login" class="btn-login">Login</RouterLink>
      <button class="cart-btn" @click="cartStore.buka()">
        🛒 Cart
        <span class="cart-badge">{{ cartStore.totalItem }}</span>
      </button>
    </nav>
  </header>
</template>

<script setup>
import { useProdukStore } from '@/stores/produk'
import { useCartStore }   from '@/stores/cart'
import { useAuthStore }   from '@/stores/auth'
import { useRouter }      from 'vue-router'

const produkStore = useProdukStore()
const cartStore   = useCartStore()
const auth        = useAuthStore()
const router      = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10,10,10,0.97);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #2a2a2a;
  padding: 0 40px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.logo {
  font-size: 1.6rem;
  font-weight: 700;
  color: #f32e4a;
  cursor: pointer;
  flex-shrink: 0;
}
.search-wrap {
  flex: 1;
  max-width: 420px;
  position: relative;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
}
.search-input {
  width: 100%;
  background: #141414;
  border: 1px solid #2a2a2a;
  color: white;
  padding: 10px 16px 10px 42px;
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #f32e4a; }
nav {
  display: flex;
  gap: 16px;
  align-items: center;
}
nav a {
  color: #888;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}
nav a:hover, nav a.router-link-active { color: white; }
.cart-btn {
  background: #141414;
  border: 1px solid #2a2a2a;
  color: white;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.cart-btn:hover { border-color: #f32e4a; color: #f32e4a; }
.cart-badge {
  background: #f32e4a;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.btn-login {
  background: #f32e4a;
  color: white !important;
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: 600;
}
.btn-logout {
  background: transparent;
  border: 1px solid #2a2a2a;
  color: #888;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.btn-logout:hover { border-color: #f32e4a; color: #f32e4a; }
</style>