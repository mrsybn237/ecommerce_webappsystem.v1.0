import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios'

export const useProdukStore = defineStore('produk', () => {
  // STATE — data yang disimpan
  const produkList    = ref([])
  const loading       = ref(false)
  const error         = ref(null)
  const filterBrand   = ref('semua')
  const searchQuery   = ref('')

  // GETTERS — data yang dihitung dari state
  const produkTampil = computed(() => {
    return produkList.value.filter(p => {
      const lolosFilter = filterBrand.value === 'semua' || p.brand === filterBrand.value
      const query       = searchQuery.value.toLowerCase().trim()
      const lolosSearch = query === ''
        || p.nama.toLowerCase().includes(query)
        || p.brand.toLowerCase().includes(query)
        || p.kategori.toLowerCase().includes(query)
      return lolosFilter && lolosSearch
    })
  })

  const brands = computed(() => {
    const semuaBrand = produkList.value.map(p => p.brand)
    return ['semua', ...new Set(semuaBrand)]
  })

  // ACTIONS — fungsi untuk ubah state
  async function fetchProduk(params = {}) {
    loading.value = true
    error.value   = null
    try {
      const res       = await api.get('/produk', { params })
      produkList.value = res.data.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Gagal load produk'
    } finally {
      loading.value = false
    }
  }

  async function tambahProduk(data) {
    const res = await api.post('/produk', data)
    produkList.value.unshift(res.data.data)  // tambah ke awal array
    return res.data
  }

  async function updateProduk(id, data) {
    const res = await api.put(`/produk/${id}`, data)
    const index = produkList.value.findIndex(p => p.id === id)
    if (index !== -1) produkList.value[index] = res.data.data
    return res.data
  }

  async function hapusProduk(id) {
    await api.delete(`/produk/${id}`)
    produkList.value = produkList.value.filter(p => p.id !== id)
  }

  function setFilter(brand) { filterBrand.value = brand }
  function setSearch(query) { searchQuery.value = query }

  return {
    produkList, loading, error,
    filterBrand, searchQuery,
    produkTampil, brands,
    fetchProduk, tambahProduk, updateProduk, hapusProduk,
    setFilter, setSearch
  }
})