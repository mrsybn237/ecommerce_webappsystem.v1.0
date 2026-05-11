// Middleware = fungsi yang jalan ANTARA request dan response
// Error handler = middleware khusus untuk tangkap semua error
// Analogi: security guard di pintu masuk toko

function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message)

  // Tentukan status code yang tepat
  const statusCode = err.statusCode || 500

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Terjadi kesalahan di server',
      // Hanya tampilkan stack trace saat development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
}

// Helper: buat error dengan status code custom
function createError(message, statusCode) {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

module.exports = { errorHandler, createError }