const express = require('express')
const router  = express.Router()
const pool    = require('../database/db')

function createError(message, statusCode) {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

// GET semua produk
router.get('/', async (req, res, next) => {
  try {
    const { brand, kategori, search, minHarga, maxHarga } = req.query
    let query  = 'SELECT * FROM produk WHERE aktif = TRUE'
    let params = []
    let i      = 1

    if (brand) {
      query += ` AND LOWER(brand) = LOWER($${i++})`
      params.push(brand)
    }
    if (kategori) {
      query += ` AND LOWER(kategori) = LOWER($${i++})`
      params.push(kategori)
    }
    if (search) {
      query += ` AND (LOWER(nama) LIKE $${i} OR LOWER(deskripsi) LIKE $${i})`
      params.push(`%${search.toLowerCase()}%`)
      i++
    }
    if (minHarga) { query += ` AND harga >= $${i++}`; params.push(parseInt(minHarga)) }
    if (maxHarga) { query += ` AND harga <= $${i++}`; params.push(parseInt(maxHarga)) }

    query += ' ORDER BY created_at DESC'

    const hasil = await pool.query(query, params)
    res.json({ success: true, total: hasil.rows.length, data: hasil.rows })
  } catch (err) {
    next(err)
  }
})

// GET satu produk by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const produkResult = await pool.query(
      'SELECT * FROM produk WHERE id = $1 AND aktif = TRUE', [id]
    )
    if (produkResult.rows.length === 0) {
      return next(createError(`Produk ID ${id} tidak ditemukan`, 404))
    }

    const stokResult = await pool.query(`
      SELECT s.jumlah, c.nama as cabang, c.kota,
        CASE
          WHEN s.jumlah = 0 THEN 'habis'
          WHEN s.jumlah < 3 THEN 'hampir habis'
          ELSE 'tersedia'
        END as status
      FROM stok s
      JOIN cabang c ON s.cabang_id = c.id
      WHERE s.produk_id = $1
      ORDER BY c.nama
    `, [id])

    res.json({
      success: true,
      data: { ...produkResult.rows[0], stokPerCabang: stokResult.rows }
    })
  } catch (err) {
    next(err)
  }
})

// POST tambah produk
router.post('/', async (req, res, next) => {
  try {
    const { nama, brand, kategori, harga, deskripsi, gambar, badge } = req.body
    if (!nama || !brand || !kategori || !harga) {
      return next(createError('nama, brand, kategori, harga wajib diisi', 400))
    }
    const result = await pool.query(`
      INSERT INTO produk (nama, brand, kategori, harga, deskripsi, gambar, badge)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [nama, brand, kategori, harga, deskripsi, gambar, badge])

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: result.rows[0]
    })
  } catch (err) {
    next(err)
  }
})

// PUT update produk
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { nama, brand, kategori, harga, deskripsi, gambar, badge } = req.body
    const result = await pool.query(`
      UPDATE produk
      SET nama      = COALESCE($1, nama),
          brand     = COALESCE($2, brand),
          kategori  = COALESCE($3, kategori),
          harga     = COALESCE($4, harga),
          deskripsi = COALESCE($5, deskripsi),
          gambar    = COALESCE($6, gambar),
          badge     = COALESCE($7, badge),
          updated_at = NOW()
      WHERE id = $8 AND aktif = TRUE
      RETURNING *
    `, [nama, brand, kategori, harga, deskripsi, gambar, badge, id])

    if (result.rows.length === 0) {
      return next(createError(`Produk ID ${id} tidak ditemukan`, 404))
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    next(err)
  }
})

// DELETE soft delete
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
      UPDATE produk SET aktif = FALSE, updated_at = NOW()
      WHERE id = $1 AND aktif = TRUE
      RETURNING id, nama
    `, [id])
    if (result.rows.length === 0) {
      return next(createError(`Produk ID ${id} tidak ditemukan`, 404))
    }
    res.json({ success: true, message: 'Produk berhasil dihapus', data: result.rows[0] })
  } catch (err) {
    next(err)
  }
})

module.exports = router