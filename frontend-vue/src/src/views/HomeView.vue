<template>
  <main>
    <!-- HERO -->
    <section class="hero">
      <div class="hero-tag">⚡ Oxva Official Reseller Indonesia</div>
      <h1>Toko Vape <span>Terpercaya</span><br/>di Indonesia</h1>
      <p>Produk original, pengiriman ke seluruh Indonesia, harga terbaik dijamin.</p>
      <button class="btn-primary" @click="scrollToProduk">Belanja Sekarang</button>
    </section>

    <!-- PRODUK -->
    <section class="section-produk" ref="produkSection">
      <div class="section-header">
        <h2>Produk <span>Unggulan</span></h2>
        <div class="brand-filters">
          <button
            v-for="brand in produkStore.brands"
            :key="brand"
            class="filter-btn"
            :class="{ active: produkStore.filterBrand === brand }"
            @click="produkStore.setFilter(brand)"
          >
            {{ brand === 'semua' ? 'Semua' : brand }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="produkStore.loading" class="loading">⏳ Memuat produk...</div>

      <!-- Error -->
      <div v-else-if="produkStore.error" class="error">
        ⚠️ {{ produkStore.error }}
        <button @click="produkStore.fetchProduk()">Coba Lagi</button>
      </div>

      <!-- Grid produk -->
      <div v-else class="product-grid">
        <ProductCard
          v-for="produk in produkStore.produkTampil"
          :key="produk.id"
          :produk="produk"
        />
        <div v-if="produkStore.produkTampil.length === 0" class="no-results">
          <p>🔍 Produk tidak ditemukan</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProdukStore } from '@/stores/produk'
import ProductCard from '@/components/ProductCard.vue'

const produkStore   = useProdukStore()
const produkSection = ref(null)

onMounted(() => {
  produkStore.fetchProduk()
})

function scrollToProduk() {
  produkSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero {
  padding: 90px 40px;
  text-align: center;
  background: radial-gradient(ellipse at center top, rgba(243,46,74,0.1) 0%, transparent 60%);
  color: white;
}
.hero-tag {
  display: inline-block;
  background: rgba(243,46,74,0.15);
  color: #f32e4a;
  border: 1px solid rgba(243,46,74,0.3);
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 24px;
}
.hero h1 { font-size: 3rem; font-weight: 700; margin-bottom: 20px; }
.hero h1 span { color: #f32e4a; }
.hero p { color: #888; font-size: 1.05rem; margin-bottom: 40px; }
.btn-primary {
  background: #f32e4a;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-primary:hover { background: #ff5570; transform: translateY(-2px); }
.section-produk { padding: 80px 40px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 20px; }
.section-header h2 { font-size: 1.8rem; font-weight: 700; color: white; }
.section-header h2 span { color: #f32e4a; }
.brand-filters { display: flex; gap: 10px; flex-wrap: wrap; }
.filter-btn { background: #141414; color: #888; border: 1px solid #2a2a2a; padding: 8px 18px; border-radius: 50px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.filter-btn:hover, .filter-btn.active { background: #f32e4a; color: white; border-color: #f32e4a; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; }
.loading, .no-results { text-align: center; padding: 60px; color: #888; }
.error { text-align: center; padding: 60px; color: #888; }
.error button { margin-top: 16px; background: #f32e4a; color: white; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; }
</style>