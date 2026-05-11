const express  = require('express')
const router   = express.Router()
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const pool     = require('../database/db')
const { authMiddleware, JWT_SECRET } = require('../middleware/auth')

// ================================================
// POST /api/auth/register
// Daftar akun baru
// ================================================
router.post('/register', async (req, res, next) => {
  try {
    const { nama, email, password, role, cabangId } = req.body

    // Validasi input
    if (!nama || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'nama, email, password wajib diisi'
      })
    }

    // Cek email sudah terdaftar belum
    const cekEmail = await pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    )
    if (cekEmail.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email sudah terdaftar'
      })
    }

    // Hash password — JANGAN simpan plain text
    // 12 = saltRounds, semakin tinggi semakin aman
    const hashedPassword = await bcrypt.hash(password, 12)

    // Simpan user ke database
    const result = await pool.query(`
      INSERT INTO users (nama, email, password, role, cabang_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nama, email, role, cabang_id, created_at
    `, [nama, email, hashedPassword, role || 'staff', cabangId || null])

    const user = result.rows[0]

    // Buat JWT token
    const token = jwt.sign(
      {
        id:       user.id,
        email:    user.email,
        role:     user.role,
        cabangId: user.cabang_id
      },
      JWT_SECRET,
      { expiresIn: '7d' }  // token valid 7 hari
    )

    res.status(201).json({
      success: true,
      message: `Selamat datang, ${user.nama}!`,
      token,
      user: {
        id:    user.id,
        nama:  user.nama,
        email: user.email,
        role:  user.role
      }
    })
  } catch (err) {
    next(err)
  }
})

// ================================================
// POST /api/auth/login
// Login dan dapat token
// ================================================
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email dan password wajib diisi'
      })
    }

    // Cari user berdasarkan email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND aktif = TRUE', [email]
    )

    if (result.rows.length === 0) {
      // Jangan bilang "email tidak ditemukan" — security
      return res.status(401).json({
        success: false,
        error: 'Email atau password salah'
      })
    }

    const user = result.rows[0]

    // Bandingkan password dengan hash di database
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: 'Email atau password salah'
      })
    }

    // Buat token JWT
    const token = jwt.sign(
      {
        id:       user.id,
        email:    user.email,
        role:     user.role,
        cabangId: user.cabang_id
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: `Selamat datang kembali, ${user.nama}!`,
      token,
      user: {
        id:       user.id,
        nama:     user.nama,
        email:    user.email,
        role:     user.role,
        cabangId: user.cabang_id
      }
    })
  } catch (err) {
    next(err)
  }
})

// ================================================
// GET /api/auth/me
// Cek siapa yang sedang login
// Butuh token — contoh pakai authMiddleware
// ================================================
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, nama, email, role, cabang_id, created_at FROM users WHERE id = $1',
      [req.user.id]
    )
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    next(err)
  }
})

// ================================================
// POST /api/auth/logout
// Di JWT tidak ada logout server-side
// Client yang hapus tokennya sendiri
// ================================================
router.post('/logout', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Logout berhasil. Hapus token di client.'
  })
})

module.exports = router