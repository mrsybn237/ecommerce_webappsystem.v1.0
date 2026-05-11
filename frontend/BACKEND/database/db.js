require('dotenv').config();
const { Pool } = require('pg');

// Konfigurasi koneksi menggunakan variabel dari file .env
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD), // Memastikan password terbaca sebagai string
});

// Fungsi untuk mengetes koneksi
pool.connect((err, client, done) => {
  if (err) {
    console.error('❌ Gagal koneksi ke database:', err.message);
  } else {
    console.log('✅ Terhubung ke PostgreSQL - Database:', process.env.DB_NAME);
    done(); // Melepaskan koneksi kembali ke pool
  }
});

module.exports = pool;