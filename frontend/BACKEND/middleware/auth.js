const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'vapebay_secret_2024'

// ================================================
// MIDDLEWARE VERIFIKASI TOKEN
// Dipanggil sebelum endpoint yang butuh login
// Analogi: satpam yang cek wristband sebelum masuk
// ================================================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  // Cek apakah header Authorization ada
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Akses ditolak. Token tidak ditemukan'
    })
  }

  // Ambil tokennya — format: "Bearer TOKEN_NYA"
  const token = authHeader.split(' ')[1]

  try {
    // Verifikasi token — kalau palsu atau expired, langsung error
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded  // simpan data user ke request
    next()              // lanjut ke handler berikutnya
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token kadaluarsa, silakan login ulang'
      })
    }
    return res.status(401).json({
      success: false,
      error: 'Token tidak valid'
    })
  }
}

// ================================================
// MIDDLEWARE CEK ROLE
// Contoh: requireRole('admin') — hanya admin boleh
// ================================================
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Akses ditolak. Role '${req.user.role}' tidak punya izin`
      })
    }
    next()
  }
}

module.exports = { authMiddleware, requireRole, JWT_SECRET }