import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items    = ref([])
  const isOpen   = ref(false)

  const totalItem  = computed(() => items.value.reduce((t, i) => t + i.qty, 0))
  const totalHarga = computed(() => items.value.reduce((t, i) => t + i.produk.harga * i.qty, 0))

  function tambah(produk, qty = 1) {
    const ada = items.value.find(i => i.produk.id === produk.id)
    if (ada) {
      ada.qty += qty
    } else {
      items.value.push({ produk, qty })
    }
    isOpen.value = true
  }

  function updateQty(produkId, perubahan) {
    const item = items.value.find(i => i.produk.id === produkId)
    if (!item) return
    item.qty += perubahan
    if (item.qty <= 0) hapus(produkId)
  }

  function hapus(produkId) {
    items.value = items.value.filter(i => i.produk.id !== produkId)
  }

  function buka()  { isOpen.value = true  }
  function tutup() { isOpen.value = false }

  return { items, isOpen, totalItem, totalHarga, tambah, updateQty, hapus, buka, tutup }
})