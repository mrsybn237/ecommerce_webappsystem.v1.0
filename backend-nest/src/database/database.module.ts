import { Module, Global } from '@nestjs/common'
import { Pool } from 'pg'

@Global()
@Module({
  providers: [
    {
      provide: 'DB_POOL',
      useFactory: () => {
        const pool = new Pool({
          host:     process.env.DB_HOST,
          // Tambahkan || '5432' agar tidak error saat di-parse ke angka
          port:     parseInt(process.env.DB_PORT || '5432'),
          database: process.env.DB_NAME,
          user:     process.env.DB_USER,
          password: process.env.DB_PASSWORD,
        })

        pool.connect()
          .then(() => console.log('✅ Terhubung ke PostgreSQL — vapebay_db'))
          .catch(err => console.error('❌ Gagal koneksi DB:', err.message))

        return pool
      }
    }
  ],
  exports: ['DB_POOL'],
})
export class DatabaseModule {}