const express = require('express')
const router  = express.Router()
const { produk, cabang, stok } = require('../data/mockData')
const { createError }          = require('../middleware/errorHandler')

// GET /api/stok — semua stok semua cabang
router.get('/', (req, res) => {
  // Gabungkan data stok dengan nama produk dan cabang
  const hasil = stok.map(s => {
    const p = produk.find(x => x.id === s.produkId)
    const c = cabang.find(x => x.id === s.cabangId)
    return {
      produkId:    s.produkId,
      namaProduk:  p?.nama,
      brandProduk: p?.brand,
      cabangId:    s.cabangId,
      namaCabang:  c?.nama,
      kotaCabang:  c?.kota,
      jumlah:      s.jumlah,
      status:      s.jumlah === 0 ? 'habis' : s.jumlah < 3 ? 'hampir habis' : 'tersedia'
    }
  })

  res.json({ success: true, total: hasil.length, data: hasil })
})

// GET /api/stok/cabang/:cabangId — stok di satu cabang
router.get('/cabang/:cabangId', (req, res, next) => {
  const cabangId = parseInt(req.params.cabangId)
  const cabangDipilih = cabang.find(c => c.id === cabangId)

  if (!cabangDipilih) {
    return next(createError('Cabang tidak ditemukan', 404))
  }

  const stokCabang = stok
    .filter(s => s.cabangId === cabangId)
    .map(s => {
      const p = produk.find(x => x.id === s.produkId)
      return {
        produkId:   s.produkId,
        namaProduk: p?.nama,
        brand:      p?.brand,
        harga:      p?.harga,
        jumlah:     s.jumlah,
        status:     s.jumlah === 0 ? 'habis' : s.jumlah < 3 ? 'hampir habis' : 'tersedia'
      }
    })

  res.json({
    success: true,
    cabang:  cabangDipilih,
    total:   stokCabang.length,
    data:    stokCabang
  })
})

// PATCH /api/stok/update — update jumlah stok
router.patch('/update', (req, res, next) => {
  const { produkId, cabangId, jumlah } = req.body

  if (!produkId || !cabangId || jumlah === undefined) {
    return next(createError('produkId, cabangId, dan jumlah wajib diisi', 400))
  }

  const stokItem = stok.find(
    s => s.produkId === produkId && s.cabangId === cabangId
  )

  if (!stokItem) {
    // Kalau belum ada, tambahkan entry baru
    stok.push({ produkId, cabangId, jumlah })
  } else {
    stokItem.jumlah = jumlah
  }

  res.json({
    success: true,
    message: `Stok berhasil diupdate`,
    data:    { produkId, cabangId, jumlahBaru: jumlah }
  })
})

module.exports = router