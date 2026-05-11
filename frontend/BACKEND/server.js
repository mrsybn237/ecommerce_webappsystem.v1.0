require('dotenv').config()

const express = require('express')
const cors    = require('cors')
const app     = express()
const PORT    = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

const produkRoutes = require('./routes/produk')
const stokRoutes   = require('./routes/stok')
const authRoutes   = require('./routes/auth')

// Public routes — bebas diakses tanpa token
app.use('/api/auth',  authRoutes)
app.use('/api/stok',  stokRoutes)

// Produk GET — public, POST/PUT/DELETE — butuh token admin
app.use('/api/produk', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const { authMiddleware, requireRole } = require('./middleware/auth')
    return authMiddleware(req, res, () => {
      requireRole('admin')(req, res, next)
    })
  }
  next()
}, produkRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', server: 'VapeBay API' })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' })
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Terjadi kesalahan di server'
  })
})

app.listen(PORT, () => {
  console.log(`\n✅ VapeBay API jalan di http://localhost:${PORT}`)
  console.log(`\n📡 Auth endpoints:`)
  console.log(`   POST /api/auth/register`)
  console.log(`   POST /api/auth/login`)
  console.log(`   GET  /api/auth/me`)
})