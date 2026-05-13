<template>
  <div class="admin">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-logo">VapeBay Admin</div>
      <nav class="sidebar-nav">
        <button
          v-for="menu in menus"
          :key="menu.id"
          class="sidebar-item"
          :class="{ active: activeMenu === menu.id }"
          @click="activeMenu = menu.id"
        >
          {{ menu.icon }} {{ menu.label }}
        </button>
      </nav>
      <button class="sidebar-logout" @click="handleLogout">↩ Logout</button>
    </aside>

    <!-- MAIN -->
    <main class="admin-main">

      <!-- ====== MANAJEMEN PRODUK ====== -->
      <div v-if="activeMenu === 'produk'">
        <div class="page-header">
          <h1>Manajemen Produk</h1>
          <button class="btn-primary" @click="bukaFormTambah">+ Tambah Produk</button>
        </div>

        <div v-if="produkStore.loading" class="loading">⏳ Memuat data...</div>

        <div v-else class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Brand</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="produkStore.produkList.length === 0">
                <td colspan="7" style="text-align:center; padding:40px; color:#888">
                  Belum ada produk
                </td>
              </tr>
              <tr v-for="p in produkStore.produkList" :key="p.id">
                <td>#{{ p.id }}</td>
                <td>{{ p.nama }}</td>
                <td><span class="badge-brand">{{ p.brand }}</span></td>
                <td>{{ p.kategori }}</td>
                <td>{{ formatHarga(p.harga) }}</td>
                <td><span class="badge-aktif">Aktif</span></td>
                <td>
                  <button class="btn-edit" @click="bukaFormEdit(p)">Edit</button>
                  <button class="btn-hapus" @click="konfirmasiHapus(p)">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ====== STOK CABANG ====== -->
      <div v-if="activeMenu === 'stok'">
        <div class="page-header">
          <h1>Stok Per Cabang</h1>
          <button class="btn-primary" @click="loadStok">↻ Refresh</button>
        </div>

        <div v-if="stokLoading" class="loading">⏳ Memuat stok...</div>

        <div v-else class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Brand</th>
                <th>Cabang</th>
                <th>Kota</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="stokList.length === 0">
                <td colspan="7" style="text-align:center; padding:40px; color:#888">
                  Belum ada data stok
                </td>
              </tr>
              <tr v-for="(s, i) in stokList" :key="i">
                <td>{{ s.produk }}</td>
                <td><span class="badge-brand">{{ s.brand }}</span></td>
                <td>{{ s.cabang }}</td>
                <td>{{ s.kota }}</td>
                <td>{{ s.jumlah }}</td>
                <td>
                  <span :class="['badge-stok', s.status === 'hampir habis' ? 'hampir-habis' : s.status]">
                    {{ s.status }}
                  </span>
                </td>
                <td>
                  <button class="btn-edit" @click="bukaFormUpdateStok(s)">Update</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <!-- ====== MODAL FORM PRODUK ====== -->
    <div v-if="showForm" class="modal-backdrop" @click.self="tutupForm">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}</h3>
          <button class="modal-close" @click="tutupForm">✕</button>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Nama Produk *</label>
            <input v-model="form.nama" placeholder="SMOK X80 Mod Kit" />
          </div>

          <div class="form-group">
            <label>Brand *</label>
            <input v-model="form.brand" placeholder="SMOK" />
          </div>

          <div class="form-group">
            <label>Kategori *</label>
            <select v-model="form.kategori">
              <option value="">Pilih Kategori</option>
              <option value="Mod Kit">Mod Kit</option>
              <option value="Pod System">Pod System</option>
              <option value="Liquid">Liquid</option>
              <option value="Aksesoris">Aksesoris</option>
            </select>
          </div>

          <div class="form-group">
            <label>Harga *</label>
            <input v-model.number="form.harga" type="number" placeholder="450000" />
          </div>

          <div class="form-group full">
            <label>Deskripsi</label>
            <textarea v-model="form.deskripsi" placeholder="Deskripsi produk..." rows="3"></textarea>
          </div>

          <div class="form-group full">
            <label>URL Gambar</label>
            <input v-model="form.gambar" placeholder="https://..." />
          </div>

          <div class="form-group">
            <label>Badge</label>
            <select v-model="form.badge">
              <option value="">Tidak ada</option>
              <option value="New">New</option>
              <option value="Bestseller">Bestseller</option>
              <option value="Official">Official</option>
              <option value="Top Flavor">Top Flavor</option>
            </select>
          </div>
        </div>

        <div v-if="formError" class="form-error">⚠️ {{ formError }}</div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="tutupForm">Batal</button>
          <button class="btn-save" :disabled="formLoading" @click="simpanProduk">
            {{ formLoading ? 'Menyimpan...' : (isEditing ? 'Update Produk' : 'Tambah Produk') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ====== MODAL UPDATE STOK ====== -->
    <div v-if="showFormStok" class="modal-backdrop" @click.self="tutupFormStok">
      <div class="modal-box" style="max-width: 420px">
        <div class="modal-header">
          <h3>Update Stok</h3>
          <button class="modal-close" @click="tutupFormStok">✕</button>
        </div>

        <div class="form-grid" style="grid-template-columns: 1fr">
          <div class="form-group">
            <label>Produk</label>
            <input :value="stokForm.produk" disabled style="opacity:0.5" />
          </div>
          <div class="form-group">
            <label>Cabang</label>
            <input :value="stokForm.cabang" disabled style="opacity:0.5" />
          </div>
          <div class="form-group">
            <label>Jumlah Stok Baru *</label>
            <input v-model.number="stokForm.jumlah" type="number" min="0" placeholder="0" />
          </div>
        </div>

        <div v-if="stokFormError" class="form-error">⚠️ {{ stokFormError }}</div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="tutupFormStok">Batal</button>
          <button class="btn-save" :disabled="stokFormLoading" @click="simpanStok">
            {{ stokFormLoading ? 'Menyimpan...' : 'Update Stok' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ====== MODAL KONFIRMASI HAPUS ====== -->
    <div v-if="showConfirm" class="modal-backdrop" @click.self="showConfirm = false">
      <div class="modal-box" style="max-width: 420px">
        <div class="modal-header">
          <h3>Hapus Produk?</h3>
          <button class="modal-close" @click="showConfirm = false">✕</button>
        </div>
        <div style="padding: 24px">
          <p style="color: #888; line-height: 1.6">
            Produk <strong style="color: white">{{ produkDipilih?.nama }}</strong>
            akan dihapus. Tindakan ini tidak bisa dibatalkan.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showConfirm = false">Batal</button>
          <button class="btn-hapus-confirm" :disabled="hapusLoading" @click="eksekusiHapus">
            {{ hapusLoading ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ====== TOAST NOTIFIKASI ====== -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProdukStore } from '@/stores/produk'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const router      = useRouter()
const produkStore = useProdukStore()
const auth        = useAuthStore()

// Menu sidebar
const activeMenu = ref('produk')
const menus = [
  { id: 'produk', icon: '📦', label: 'Produk' },
  { id: 'stok',   icon: '📊', label: 'Stok Cabang' },
]

// ============ PRODUK ============
const showForm    = ref(false)
const isEditing   = ref(false)
const formLoading = ref(false)
const formError   = ref(null)

const form = reactive({
  id: null, nama: '', brand: '', kategori: '',
  harga: '', deskripsi: '', gambar: '', badge: ''
})

function resetForm() {
  form.id = null; form.nama = ''; form.brand = ''
  form.kategori = ''; form.harga = ''; form.deskripsi = ''
  form.gambar = ''; form.badge = ''
}

function bukaFormTambah() {
  isEditing.value = false
  resetForm()
  formError.value = null
  showForm.value  = true
}

function bukaFormEdit(produk) {
  isEditing.value = true
  formError.value = null
  Object.assign(form, {
    id:        produk.id,
    nama:      produk.nama      || '',
    brand:     produk.brand     || '',
    kategori:  produk.kategori  || '',
    harga:     produk.harga     || '',
    deskripsi: produk.deskripsi || '',
    gambar:    produk.gambar    || '',
    badge:     produk.badge     || ''
  })
  showForm.value = true
}

function tutupForm() {
  showForm.value = false
  formError.value = null
}

async function simpanProduk() {
  if (!form.nama || !form.brand || !form.kategori || !form.harga) {
    formError.value = 'Nama, brand, kategori, dan harga wajib diisi'
    return
  }

  formLoading.value = true
  formError.value   = null

  try {
    const payload = {
      nama:      form.nama,
      brand:     form.brand,
      kategori:  form.kategori,
      harga:     Number(form.harga),
      deskripsi: form.deskripsi || null,
      gambar:    form.gambar    || null,
      badge:     form.badge     || null,
    }

    if (isEditing.value) {
      await produkStore.updateProduk(form.id, payload)
      tampilToast('Produk berhasil diupdate', 'success')
    } else {
      await produkStore.tambahProduk(payload)
      tampilToast('Produk berhasil ditambahkan', 'success')
    }
    tutupForm()
  } catch (err) {
    formError.value = err.response?.data?.error || 'Gagal menyimpan produk'
  } finally {
    formLoading.value = false
  }
}

// ============ HAPUS PRODUK ============
const showConfirm    = ref(false)
const produkDipilih  = ref(null)
const hapusLoading   = ref(false)

function konfirmasiHapus(produk) {
  produkDipilih.value = produk
  showConfirm.value   = true
}

async function eksekusiHapus() {
  hapusLoading.value = true
  try {
    await produkStore.hapusProduk(produkDipilih.value.id)
    showConfirm.value = false
    tampilToast('Produk berhasil dihapus', 'success')
  } catch (err) {
    tampilToast('Gagal menghapus produk', 'error')
  } finally {
    hapusLoading.value = false
  }
}

// ============ STOK ============
const stokList    = ref([])
const stokLoading = ref(false)

const showFormStok    = ref(false)
const stokFormLoading = ref(false)
const stokFormError   = ref(null)
const stokForm = reactive({
  produkId: null, cabangId: null,
  produk: '', cabang: '', jumlah: 0
})

async function loadStok() {
  stokLoading.value = true
  try {
    const res = await api.get('/stok')
    stokList.value = res.data.data
  } catch (err) {
    tampilToast('Gagal memuat data stok', 'error')
  } finally {
    stokLoading.value = false
  }
}

function bukaFormUpdateStok(s) {
  stokForm.produkId = s.produk_id || null
  stokForm.cabangId = s.cabang_id || null
  stokForm.produk   = s.produk
  stokForm.cabang   = s.cabang
  stokForm.jumlah   = s.jumlah
  stokFormError.value = null
  showFormStok.value  = true
}

function tutupFormStok() {
  showFormStok.value = false
  stokFormError.value = null
}

async function simpanStok() {
  if (stokForm.jumlah === '' || stokForm.jumlah < 0) {
    stokFormError.value = 'Jumlah stok tidak boleh kosong atau negatif'
    return
  }
  stokFormLoading.value = true
  stokFormError.value   = null
  try {
    await api.patch('/stok/update', {
      produkId: stokForm.produkId,
      cabangId: stokForm.cabangId,
      jumlah:   Number(stokForm.jumlah)
    })
    await loadStok()
    tutupFormStok()
    tampilToast('Stok berhasil diupdate', 'success')
  } catch (err) {
    stokFormError.value = err.response?.data?.error || 'Gagal update stok'
  } finally {
    stokFormLoading.value = false
  }
}

// ============ TOAST ============
const toast = reactive({ show: false, message: '', type: 'success' })
let toastTimer = null

function tampilToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.message = message
  toast.type    = type
  toast.show    = true
  toastTimer = setTimeout(() => { toast.show = false }, 3000)
}

// ============ HELPER ============
function formatHarga(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID')
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}

// ============ INIT ============
onMounted(async () => {
  await produkStore.fetchProduk()
  await loadStok()
})
</script>

<style scoped>
.admin { display: flex; min-height: 100vh; background: #0a0a0a; }

/* SIDEBAR */
.sidebar { width: 220px; background: #141414; border-right: 1px solid #2a2a2a; display: flex; flex-direction: column; padding: 24px 16px; flex-shrink: 0; }
.sidebar-logo { font-size: 1.1rem; font-weight: 700; color: #f32e4a; margin-bottom: 32px; padding: 0 8px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.sidebar-item { background: transparent; border: none; color: #888; padding: 12px 16px; border-radius: 10px; text-align: left; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; font-family: inherit; }
.sidebar-item:hover { background: #1e1e1e; color: white; }
.sidebar-item.active { background: rgba(243,46,74,0.15); color: #f32e4a; }
.sidebar-logout { background: transparent; border: 1px solid #2a2a2a; color: #888; padding: 10px 16px; border-radius: 10px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; font-family: inherit; }
.sidebar-logout:hover { border-color: #f32e4a; color: #f32e4a; }

/* MAIN */
.admin-main { flex: 1; padding: 40px; overflow-y: auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.page-header h1 { font-size: 1.8rem; font-weight: 700; color: white; }
.loading { text-align: center; padding: 80px; color: #888; }

/* BUTTONS */
.btn-primary { background: #f32e4a; color: white; border: none; padding: 10px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.9rem; transition: background 0.2s; font-family: inherit; }
.btn-primary:hover { background: #ff5570; }
.btn-edit { background: rgba(59,130,246,0.15); color: #3b82f6; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600; margin-right: 8px; transition: background 0.2s; font-family: inherit; }
.btn-edit:hover { background: rgba(59,130,246,0.3); }
.btn-hapus { background: rgba(243,46,74,0.15); color: #f32e4a; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: background 0.2s; font-family: inherit; }
.btn-hapus:hover { background: rgba(243,46,74,0.3); }
.btn-cancel { background: transparent; border: 1px solid #2a2a2a; color: #888; padding: 10px 24px; border-radius: 10px; cursor: pointer; font-weight: 600; font-family: inherit; transition: all 0.2s; }
.btn-cancel:hover { border-color: #888; color: white; }
.btn-save { background: #f32e4a; color: white; border: none; padding: 10px 24px; border-radius: 10px; cursor: pointer; font-weight: 700; transition: background 0.2s; font-family: inherit; }
.btn-save:hover { background: #ff5570; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-hapus-confirm { background: #f32e4a; color: white; border: none; padding: 10px 24px; border-radius: 10px; cursor: pointer; font-weight: 700; font-family: inherit; }
.btn-hapus-confirm:disabled { opacity: 0.6; cursor: not-allowed; }

/* TABLE */
.table-wrap { background: #141414; border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden; }
.table { width: 100%; border-collapse: collapse; }
.table th { padding: 14px 20px; text-align: left; font-size: 0.78rem; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #2a2a2a; }
.table td { padding: 14px 20px; font-size: 0.88rem; color: #ccc; border-bottom: 1px solid #1a1a1a; }
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: #1a1a1a; }

/* BADGES */
.badge-brand { background: rgba(243,46,74,0.15); color: #f32e4a; padding: 2px 8px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; }
.badge-aktif { background: rgba(34,197,94,0.15); color: #22c55e; padding: 2px 8px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; }
.badge-stok { padding: 3px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; }
.badge-stok.tersedia { background: rgba(34,197,94,0.15); color: #22c55e; }
.badge-stok.habis { background: rgba(243,46,74,0.15); color: #f32e4a; }
.badge-stok.hampir-habis { background: rgba(234,179,8,0.15); color: #eab308; }

/* MODAL */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-box { background: #141414; border: 1px solid #2a2a2a; border-radius: 20px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #2a2a2a; }
.modal-header h3 { font-size: 1.05rem; font-weight: 700; color: white; }
.modal-close { background: #1e1e1e; border: 1px solid #2a2a2a; color: #888; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.modal-close:hover { border-color: #f32e4a; color: #f32e4a; }
.modal-footer { display: flex; gap: 12px; justify-content: flex-end; padding: 20px 24px; border-top: 1px solid #2a2a2a; }

/* FORM */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 24px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group.full { grid-column: 1 / -1; }
.form-group label { font-size: 0.82rem; font-weight: 600; color: #888; }
.form-group input,
.form-group select,
.form-group textarea {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  color: white;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  width: 100%;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { border-color: #f32e4a; }
.form-group select option { background: #141414; color: white; }
.form-group textarea { resize: vertical; }
.form-error { margin: 0 24px 16px; padding: 12px 16px; background: rgba(243,46,74,0.1); border: 1px solid rgba(243,46,74,0.3); color: #f32e4a; border-radius: 8px; font-size: 0.88rem; }

/* TOAST */
.toast { position: fixed; bottom: 32px; right: 32px; padding: 14px 24px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; z-index: 500; animation: slideIn 0.3s ease; }
.toast.success { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); color: #22c55e; }
.toast.error { background: rgba(243,46,74,0.15); border: 1px solid rgba(243,46,74,0.4); color: #f32e4a; }
@keyframes slideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
</style>