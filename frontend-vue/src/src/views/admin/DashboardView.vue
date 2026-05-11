<template>
  <div class="admin">

    <!-- Sidebar -->
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

    <!-- Main content -->
    <main class="admin-main">

      <!-- ============ PRODUK MANAGEMENT ============ -->
      <div v-if="activeMenu === 'produk'">
        <div class="page-header">
          <h1>Manajemen Produk</h1>
          <button class="btn-primary" @click="bukaFormTambah()">+ Tambah Produk</button>
        </div>

        <!-- Tabel produk -->
        <div class="table-wrap">
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
              <tr v-if="produkStore.loading">
                <td colspan="7" style="text-align:center; padding: 40px; color: #888">⏳ Memuat...</td>
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

      <!-- ============ STOK MANAGEMENT ============ -->
      <div v-if="activeMenu === 'stok'">
        <div class="page-header">
          <h1>Stok Per Cabang</h1>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Brand</th>
                <th>Cabang</th>
                <th>Kota</th>
                <th>Jumlah</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(s, i) in stokList" :key="i">
                <td>{{ s.produk }}</td>
                <td>{{ s.brand }}</td>
                <td>{{ s.cabang }}</td>
                <td>{{ s.kota }}</td>
                <td>{{ s.jumlah }}</td>
                <td>
                  <span :class="['badge-stok', s.status]">{{ s.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <!-- ============ MODAL FORM PRODUK ============ -->
    <div v-if="showForm" class="modal-overlay" @click.self="tutupForm()">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}</h3>
          <button @click="tutupForm()">✕</button>
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

        <div v-if="formError" class="form-error">{{ formError }}</div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="tutupForm()">Batal</button>
          <button class="btn-save" :disabled="formLoading" @click="simpanProduk()">
            {{ formLoading ? 'Menyimpan...' : (isEditing ? 'Update Produk' : 'Tambah Produk') }}
          </button>
        </div>
      </div>
    </div>

    <!-- CONFIRM HAPUS -->
    <div v-if="showConfirm" class="modal-overlay" @click.self="showConfirm = false">
      <div class="confirm-box">
        <h3>Hapus Produk?</h3>
        <p>Produk <strong>{{ produkDipilih?.nama }}</strong> akan dihapus. Tindakan ini tidak bisa dibatalkan.</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="showConfirm = false">Batal</button>
          <button class="btn-hapus-confirm" @click="eksekusiHapus()">Ya, Hapus</button>
        </div>
      </div>
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

const activeMenu = ref('produk')
const menus = [
  { id: 'produk', icon: '📦', label: 'Produk' },
  { id: 'stok',   icon: '📊', label: 'Stok Cabang' },
]

// Form state
const showForm   = ref(false)
const isEditing  = ref(false)
const formLoading = ref(false)
const formError  = ref(null)
const form = reactive({
  nama: '', brand: '', kategori: '', harga: '',
  deskripsi: '', gambar: '', badge: ''
})

// Hapus state
const showConfirm   = ref(false)
const produkDipilih = ref(null)

// Stok
const stokList = ref([])

onMounted(async () => {
  await produkStore.fetchProduk()
  await loadStok()
})

async function loadStok() {
  const res  = await api.get('/stok')
  stokList.value = res.data.data
}

function formatHarga(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID')
}

function bukaFormTambah() {
  isEditing.value = false
  Object.assign(form, { nama: '', brand: '', kategori: '', harga: '', deskripsi: '', gambar: '', badge: '' })
  formError.value = null
  showForm.value  = true
}

function bukaFormEdit(produk) {
  isEditing.value = true
  Object.assign(form, { ...produk })
  formError.value = null
  showForm.value  = true
}

function tutupForm() {
  showForm.value = false
}

async function simpanProduk() {
  if (!form.nama || !form.brand || !form.kategori || !form.harga) {
    formError.value = 'Nama, brand, kategori, harga wajib diisi'
    return
  }
  formLoading.value = true
  formError.value   = null
  try {
    if (isEditing.value) {
      await produkStore.updateProduk(form.id, form)
    } else {
      await produkStore.tambahProduk(form)
    }
    tutupForm()
  } catch (err) {
    formError.value = err.response?.data?.error || 'Gagal menyimpan produk'
  } finally {
    formLoading.value = false
  }
}

function konfirmasiHapus(produk) {
  produkDipilih.value = produk
  showConfirm.value   = true
}

async function eksekusiHapus() {
  await produkStore.hapusProduk(produkDipilih.value.id)
  showConfirm.value = false
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin { display: flex; min-height: 100vh; background: #0a0a0a; }
.sidebar { width: 240px; background: #141414; border-right: 1px solid #2a2a2a; display: flex; flex-direction: column; padding: 24px 16px; flex-shrink: 0; }
.sidebar-logo { font-size: 1.2rem; font-weight: 700; color: #f32e4a; margin-bottom: 32px; padding: 0 8px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.sidebar-item { background: transparent; border: none; color: #888; padding: 12px 16px; border-radius: 10px; text-align: left; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
.sidebar-item:hover { background: #1e1e1e; color: white; }
.sidebar-item.active { background: rgba(243,46,74,0.15); color: #f32e4a; }
.sidebar-logout { background: transparent; border: 1px solid #2a2a2a; color: #888; padding: 10px 16px; border-radius: 10px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
.sidebar-logout:hover { border-color: #f32e4a; color: #f32e4a; }
.admin-main { flex: 1; padding: 40px; overflow-y: auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.page-header h1 { font-size: 1.8rem; font-weight: 700; color: white; }
.btn-primary { background: #f32e4a; color: white; border: none; padding: 10px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.9rem; transition: background 0.2s; }
.btn-primary:hover { background: #ff5570; }
.table-wrap { background: #141414; border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden; }
.table { width: 100%; border-collapse: collapse; }
.table th { padding: 16px 20px; text-align: left; font-size: 0.8rem; font-weight: 700; color: #888; text-transform: uppercase; border-bottom: 1px solid #2a2a2a; }
.table td { padding: 16px 20px; font-size: 0.9rem; color: #ccc; border-bottom: 1px solid #1a1a1a; }
.table tr:last-child td { border-bottom: none; }
.badge-brand { background: rgba(243,46,74,0.15); color: #f32e4a; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; }
.badge-aktif { background: rgba(34,197,94,0.15); color: #22c55e; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; }
.badge-stok { padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; }
.badge-stok.tersedia { background: rgba(34,197,94,0.15); color: #22c55e; }
.badge-stok.habis { background: rgba(243,46,74,0.15); color: #f32e4a; }
.badge-stok.hampir\ habis { background: rgba(234,179,8,0.15); color: #eab308; }
.btn-edit { background: rgba(59,130,246,0.15); color: #3b82f6; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600; margin-right: 8px; transition: background 0.2s; }
.btn-edit:hover { background: rgba(59,130,246,0.3); }
.btn-hapus { background: rgba(243,46,74,0.15); color: #f32e4a; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: background 0.2s; }
.btn-hapus:hover { background: rgba(243,46,74,0.3); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-box { background: #141414; border: 1px solid #2a2a2a; border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 24px; border-bottom: 1px solid #2a2a2a; }
.modal-header h3 { font-size: 1.1rem; font-weight: 700; color: white; }
.modal-header button { background: #1e1e1e; border: 1px solid #2a2a2a; color: white; width: 36px; height: 36px; border-radius: 8px; cursor: pointer; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 24px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group.full { grid-column: 1 / -1; }
.form-group label { font-size: 0.85rem; color: #888; font-weight: 600; }
.form-group input, .form-group select, .form-group textarea {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  color: white;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #f32e4a; }
.form-group select option { background: #141414; }
.form-error { margin: 0 24px; padding: 12px; background: rgba(243,46,74,0.1); border: 1px solid rgba(243,46,74,0.3); color: #f32e4a; border-radius: 8px; font-size: 0.9rem; }
.modal-footer { display: flex; gap: 12px; justify-content: flex-end; padding: 24px; border-top: 1px solid #2a2a2a; }
.btn-cancel { background: transparent; border: 1px solid #2a2a2a; color: #888; padding: 10px 24px; border-radius: 10px; cursor: pointer; font-weight: 600; }
.btn-save { background: #f32e4a; color: white; border: none; padding: 10px 24px; border-radius: 10px; cursor: pointer; font-weight: 700; transition: background 0.2s; }
.btn-save:hover { background: #ff5570; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
.confirm-box { background: #141414; border: 1px solid #2a2a2a; border-radius: 16px; padding: 32px; max-width: 400px; width: 90%; }
.confirm-box h3 { font-size: 1.1rem; font-weight: 700; color: white; margin-bottom: 12px; }
.confirm-box p { color: #888; font-size: 0.9rem; margin-bottom: 24px; line-height: 1.6; }
.confirm-box strong { color: white; }
.confirm-actions { display: flex; gap: 12px; justify-content: flex-end; }
.btn-hapus-confirm { background: #f32e4a; color: white; border: none; padding: 10px 24px; border-radius: 10px; cursor: pointer; font-weight: 700; }
</style>