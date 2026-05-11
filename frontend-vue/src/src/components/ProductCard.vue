<template>
  <div class="product-card" @click="$router.push(`/produk/${produk.id}`)">
    <div class="product-image-wrap">
      <span v-if="produk.badge" class="product-badge">{{ produk.badge }}</span>
      <img :src="produk.gambar || 'https://placehold.co/160x160/111/f32e4a?text=' + produk.nama" :alt="produk.nama" loading="lazy" />
    </div>
    <div class="product-info">
      <div class="product-brand">{{ produk.brand }}</div>
      <div class="product-name">{{ produk.nama }}</div>
      <div class="product-category">{{ produk.kategori }}</div>
      <div class="product-footer">
        <div class="product-price">{{ formatHarga(produk.harga) }}</div>
        <button class="add-btn" @click.stop="cartStore.tambah(produk, 1)">+</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const props    = defineProps({ produk: Object })
const cartStore = useCartStore()

function formatHarga(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID')
}
</script>

<style scoped>
.product-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.product-card:hover {
  border-color: #f32e4a;
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(243,46,74,0.12);
}
.product-image-wrap {
  background: #111;
  padding: 24px;
  text-align: center;
  position: relative;
}
.product-image-wrap img { width: 160px; height: 160px; object-fit: cover; border-radius: 10px; }
.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #f32e4a;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
}
.product-info { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.product-brand { font-size: 0.75rem; font-weight: 700; color: #f32e4a; text-transform: uppercase; margin-bottom: 6px; }
.product-name { font-size: 0.95rem; font-weight: 600; margin-bottom: 4px; color: white; }
.product-category { font-size: 0.8rem; color: #888; margin-bottom: 14px; }
.product-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.product-price { font-size: 1.1rem; font-weight: 700; color: white; }
.add-btn {
  background: #f32e4a;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-btn:hover { background: #ff5570; transform: scale(1.1); }
</style>