const express = require('express')
const router  = express.Router()
const pool    = require('../database/db')

function createError(message, statusCode) {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

// GET /api/stok — semua stok semua cabang
router.get('/', async (req, res, next) => {
  try {
    const hasil = await pool.query(`
      SELECT
        s.produk_id,
        s.cabang_id,
        p.nama    AS produk,
        p.brand   AS brand,
        c.nama    AS cabang,
        c.kota    AS kota,
        s.jumlah,
        CASE
          WHEN s.jumlah = 0     THEN 'habis'
          WHEN s.jumlah < 3     THEN 'hampir habis'
          ELSE                       'tersedia'
        END AS status
      FROM stok s
      JOIN produk  p ON s.produk_id = p.id
      JOIN cabang  c ON s.cabang_id = c.id
      WHERE p.aktif = TRUE
      ORDER BY c.nama, p.nama
    `)

    res.json({ success: true, total: hasil.rows.length, data: hasil.rows })
  } catch (err) {
    next(err)
  }
})

// GET /api/stok/cabang/:cabangId — stok di satu cabang
router.get('/cabang/:cabangId', async (req, res, next) => {
  try {
    const { cabangId } = req.params

    const cabangResult = await pool.query(
      'SELECT * FROM cabang WHERE id = $1', [cabangId]
    )
    if (cabangResult.rows.length === 0) {
      return next(createError('Cabang tidak ditemukan', 404))
    }

    const stokResult = await pool.query(`
      SELECT
        s.produk_id,
        s.cabang_id,
        p.nama    AS produk,
        p.brand,
        p.harga,
        p.gambar,
        s.jumlah,
        CASE
          WHEN s.jumlah = 0 THEN 'habis'
          WHEN s.jumlah < 3 THEN 'hampir habis'
          ELSE                   'tersedia'
        END AS status
      FROM stok s
      JOIN produk p ON s.produk_id = p.id
      WHERE s.cabang_id = $1 AND p.aktif = TRUE
      ORDER BY p.nama
    `, [cabangId])

    res.json({
      success: true,
      cabang:  cabangResult.rows[0],
      total:   stokResult.rows.length,
      data:    stokResult.rows
    })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/stok/update — update jumlah stok
router.patch('/update', async (req, res, next) => {
  try {
    const { produkId, cabangId, jumlah } = req.body

    if (!produkId || !cabangId || jumlah === undefined) {
      return next(createError('produkId, cabangId, jumlah wajib diisi', 400))
    }

    // INSERT kalau belum ada, UPDATE kalau sudah ada
    const result = await pool.query(`
      INSERT INTO stok (produk_id, cabang_id, jumlah)
      VALUES ($1, $2, $3)
      ON CONFLICT (produk_id, cabang_id)
      DO UPDATE SET jumlah = $3, updated_at = NOW()
      RETURNING *
    `, [produkId, cabangId, jumlah])

    res.json({
      success: true,
      message: 'Stok berhasil diupdate',
      data:    result.rows[0]
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router