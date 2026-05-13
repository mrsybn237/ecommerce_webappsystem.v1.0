<template>
  <div class="product-detail">

    <!-- Loading -->
    <div v-if="loading" class="loading">⏳ Memuat produk...</div>

    <!-- Error -->
    <div v-else-if="error" class="error">
      ⚠️ {{ error }}
      <button @click="$router.push('/')">Kembali</button>
    </div>

    <!-- Konten -->
    <div v-else-if="produk" class="detail-wrap">

      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span @click="$router.push('/')">Produk</span>
        <span>/</span>
        <span>{{ produk.brand }}</span>
        <span>/</span>
        <span>{{ produk.nama }}</span>
      </div>

      <div class="detail-grid">

        <!-- Gambar -->
        <div class="detail-image">
          <img
            :src="produk.gambar || `https://placehold.co/300x300/111/f32e4a?text=${produk.nama}`"
            :alt="produk.nama"
          />
        </div>

        <!-- Info -->
        <div class="detail-info">
          <div class="detail-brand">{{ produk.brand }}</div>
          <h1 class="detail-name">{{ produk.nama }}</h1>
          <div class="detail-category">{{ produk.kategori }}</div>
          <div class="detail-price">{{ formatHarga(produk.harga) }}</div>

          <p class="detail-desc">{{ produk.deskripsi }}</p>

          <!-- Stok per cabang -->
          <div v-if="produk.stokPerCabang?.length" class="stok-section">
            <h3>Stok Per Cabang</h3>
            <div class="stok-grid">
              <div v-for="s in produk.stokPerCabang" :key="s.cabang" class="stok-item">
                <span class="stok-cabang">{{ s.cabang }}</span>
                <span :class="['stok-status', s.status.replace(' ', '-')]">
                  {{ s.jumlah }} — {{ s.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Qty + Cart -->
          <div class="qty-row">
            <label>Jumlah:</label>
            <div class="qty-controls">
              <button @click="qty = Math.max(1, qty - 1)">−</button>
              <span>{{ qty }}</span>
              <button @click="qty++">+</button>
            </div>
          </div>

          <div class="action-btns">
            <button class="btn-cart" @click="tambahCart()">Tambah ke Cart 🛒</button>
            <button class="btn-back" @click="$router.push('/')">← Kembali</button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import api from '@/api/axios'

const route     = useRoute()
const cartStore = useCartStore()

const produk  = ref(null)
const loading = ref(true)
const error   = ref(null)
const qty     = ref(1)

onMounted(async () => {
  try {
    const res = await api.get(`/produk/${route.params.id}`)
    produk.value = res.data.data
  } catch (err) {
    error.value = 'Produk tidak ditemukan'
  } finally {
    loading.value = false
  }
})

function formatHarga(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID')
}

function tambahCart() {
  cartStore.tambah(produk.value, qty.value)
}
</script>

<style scoped>
.product-detail { padding: 40px; max-width: 1100px; margin: 0 auto; }
.loading, .error { text-align: center; padding: 80px; color: #888; }
.error button { margin-top: 16px; background: #f32e4a; color: white; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; }
.breadcrumb { display: flex; gap: 8px; color: #888; font-size: 0.85rem; margin-bottom: 32px; }
.breadcrumb span:first-child { color: #f32e4a; cursor: pointer; }
.breadcrumb span:first-child:hover { text-decoration: underline; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
.detail-image { background: #141414; border: 1px solid #2a2a2a; border-radius: 20px; padding: 48px; display: flex; align-items: center; justify-content: center; }
.detail-image img { width: 280px; height: 280px; object-fit: cover; border-radius: 16px; }
.detail-brand { font-size: 0.8rem; font-weight: 700; color: #f32e4a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.detail-name { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 6px; line-height: 1.3; }
.detail-category { font-size: 0.9rem; color: #888; margin-bottom: 20px; }
.detail-price { font-size: 2.2rem; font-weight: 700; color: #f32e4a; margin-bottom: 20px; }
.detail-desc { color: #888; font-size: 0.95rem; line-height: 1.7; margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid #2a2a2a; }
.stok-section { margin-bottom: 28px; }
.stok-section h3 { font-size: 0.85rem; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
.stok-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.stok-item { display: flex; justify-content: space-between; padding: 10px 14px; background: #141414; border: 1px solid #2a2a2a; border-radius: 8px; }
.stok-cabang { color: white; font-size: 0.85rem; font-weight: 600; }
.stok-status { font-size: 0.8rem; font-weight: 600; }
.stok-status.tersedia { color: #22c55e; }
.stok-status.habis { color: #f32e4a; }
.stok-status.hampir-habis { color: #eab308; }
.qty-row { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.qty-row label { color: #888; font-size: 0.9rem; }
.qty-controls { display: flex; align-items: center; gap: 12px; background: #141414; border: 1px solid #2a2a2a; border-radius: 10px; padding: 4px 12px; }
.qty-controls button { background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
.qty-controls button:hover { color: #f32e4a; }
.qty-controls span { color: white; font-weight: 700; min-width: 24px; text-align: center; }
.action-btns { display: flex; gap: 12px; }
.btn-cart { background: #f32e4a; color: white; border: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.3s; flex: 1; }
.btn-cart:hover { background: #ff5570; transform: translateY(-2px); }
.btn-back { background: transparent; color: #888; border: 1px solid #2a2a2a; padding: 14px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-back:hover { border-color: #888; color: white; }
@media (max-width: 768px) {
  .detail-grid { grid-template-columns: 1fr; }
  .product-detail { padding: 20px; }
}
</style>