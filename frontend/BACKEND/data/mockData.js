// Data sementara — akan diganti PostgreSQL di Session 2
// Anggap ini sebagai "database palsu" untuk latihan

const produk = [
  {
    id: 1,
    nama: "SMOK X80 Mod Kit",
    brand: "SMOK",
    kategori: "Mod Kit",
    harga: 450000,
    deskripsi: "Mod flagship dengan output hingga 80W, layar OLED 0.96 inci",
    gambar: "https://placehold.co/200x200/111/f32e4a?text=SMOK+X80",
    aktif: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    nama: "Vaporesso XROS 4",
    brand: "Vaporesso",
    kategori: "Pod System",
    harga: 380000,
    deskripsi: "Pod system generasi terbaru dengan IQ-X Chipset, baterai 1000mAh",
    gambar: "https://placehold.co/200x200/111/f32e4a?text=XROS+4",
    aktif: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    nama: "Oxva Xlim Pro 2",
    brand: "Oxva",
    kategori: "Pod System",
    harga: 420000,
    deskripsi: "Pod system dengan layar OLED dan airflow adjustable",
    gambar: "https://placehold.co/200x200/111/f32e4a?text=Xlim+Pro+2",
    aktif: true,
    createdAt: new Date().toISOString()
  }
]

const cabang = [
  { id: 1, nama: "Tebet",   kota: "Jakarta Selatan", telp: "0811111111" },
  { id: 2, nama: "Bandung", kota: "Bandung",          telp: "0822222222" },
  { id: 3, nama: "Bekasi",  kota: "Bekasi",           telp: "0833333333" }
]

// Stok = relasi antara produk dan cabang
// Di database nanti ini jadi tabel tersendiri
const stok = [
  { produkId: 1, cabangId: 1, jumlah: 5  },  // SMOK X80 di Tebet: 5
  { produkId: 1, cabangId: 2, jumlah: 3  },  // SMOK X80 di Bandung: 3
  { produkId: 1, cabangId: 3, jumlah: 8  },  // SMOK X80 di Bekasi: 8
  { produkId: 2, cabangId: 1, jumlah: 12 },  // XROS 4 di Tebet: 12
  { produkId: 2, cabangId: 2, jumlah: 0  },  // XROS 4 di Bandung: habis
  { produkId: 2, cabangId: 3, jumlah: 4  },  // XROS 4 di Bekasi: 4
  { produkId: 3, cabangId: 1, jumlah: 7  },
  { produkId: 3, cabangId: 2, jumlah: 9  },
  { produkId: 3, cabangId: 3, jumlah: 2  }
]

let nextId = 4  // auto-increment ID untuk produk baru

module.exports = { produk, cabang, stok, get nextId() { return nextId++ } }