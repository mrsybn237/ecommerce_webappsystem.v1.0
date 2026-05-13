<template>
  <!-- Overlay -->
  <div v-if="cart.isOpen" class="cart-overlay" @click="cart.tutup()"></div>

  <!-- Sidebar -->
  <div class="cart-sidebar" :class="{ open: cart.isOpen }">
    <div class="cart-header">
      <h3>🛒 Keranjang</h3>
      <button @click="cart.tutup()">✕</button>
    </div>

    <div class="cart-items">
      <!-- Kosong -->
      <div v-if="cart.items.length === 0" class="cart-empty">
        <p>🛒</p>
        <p>Keranjang kosong</p>
      </div>

      <!-- List item -->
      <div v-for="item in cart.items" :key="item.produk.id" class="cart-item">
        <img :src="item.produk.gambar || 'https://placehold.co/60x60/111/f32e4a?text=P'" :alt="item.produk.nama" />
        <div class="cart-item-info">
          <div class="cart-item-name">{{ item.produk.nama }}</div>
          <div class="cart-item-price">{{ formatHarga(item.produk.harga * item.qty) }}</div>
          <div class="cart-item-qty">
            <button @click="cart.updateQty(item.produk.id, -1)">−</button>
            <span>{{ item.qty }}</span>
            <button @click="cart.updateQty(item.produk.id, 1)">+</button>
          </div>
        </div>
        <button class="remove-btn" @click="cart.hapus(item.produk.id)">🗑</button>
      </div>
    </div>

    <!-- Footer total -->
    <div v-if="cart.items.length > 0" class="cart-footer">
      <div class="cart-total">
        <span>Total</span>
        <span>{{ formatHarga(cart.totalHarga) }}</span>
      </div>
      <button class="checkout-btn">Checkout →</button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
function formatHarga(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID')
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 200;
}
.cart-sidebar {
  position: fixed;
  top: 0;
  right: -420px;
  width: 420px;
  height: 100vh;
  background: #141414;
  border-left: 1px solid #2a2a2a;
  z-index: 201;
  transition: right 0.35s cubic-bezier(0.4,0,0.2,1);
  display: flex;
  flex-direction: column;
}
.cart-sidebar.open { right: 0; }
.cart-header {
  padding: 24px;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}
.cart-header button {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
}
.cart-items { flex: 1; overflow-y: auto; padding: 20px 24px; }
.cart-empty { text-align: center; padding: 60px 20px; color: #888; }
.cart-item {
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid #2a2a2a;
  align-items: center;
}
.cart-item img { width: 60px; height: 60px; border-radius: 10px; object-fit: cover; }
.cart-item-info { flex: 1; }
.cart-item-name { font-size: 0.88rem; font-weight: 600; color: white; margin-bottom: 4px; }
.cart-item-price { font-size: 0.88rem; color: #f32e4a; font-weight: 600; }
.cart-item-qty { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.cart-item-qty button {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
}
.cart-item-qty span { color: white; font-weight: 700; }
.remove-btn { background: transparent; border: none; color: #444; cursor: pointer; font-size: 1.1rem; }
.remove-btn:hover { color: #f32e4a; }
.cart-footer { padding: 24px; border-top: 1px solid #2a2a2a; }
.cart-total { display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 700; color: white; margin-bottom: 16px; }
.checkout-btn {
  width: 100%;
  background: #f32e4a;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}
</style>