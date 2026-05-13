import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common'
import { Pool } from 'pg'
import { CreateProdukDto } from './dto/create-produk.dto'
import { UpdateProdukDto } from './dto/update-produk.dto'

// @Injectable() = class ini bisa di-inject ke class lain
@Injectable()
export class ProdukService {

  // Inject pool database lewat constructor
  constructor(@Inject('DB_POOL') private readonly pool: Pool) {}

  // Ambil semua produk dengan filter opsional
  async findAll(query: {
    brand?: string
    kategori?: string
    search?: string
    minHarga?: number
    maxHarga?: number
  }) {
    let sql    = 'SELECT * FROM produk WHERE aktif = TRUE'
    const params: any[] = []
    let i = 1

    if (query.brand) {
      sql += ` AND LOWER(brand) = LOWER($${i++})`
      params.push(query.brand)
    }
    if (query.kategori) {
      sql += ` AND LOWER(kategori) = LOWER($${i++})`
      params.push(query.kategori)
    }
    if (query.search) {
      sql += ` AND (LOWER(nama) LIKE $${i} OR LOWER(deskripsi) LIKE $${i})`
      params.push(`%${query.search.toLowerCase()}%`)
      i++
    }
    if (query.minHarga) {
      sql += ` AND harga >= $${i++}`
      params.push(Number(query.minHarga))
    }
    if (query.maxHarga) {
      sql += ` AND harga <= $${i++}`
      params.push(Number(query.maxHarga))
    }

    sql += ' ORDER BY created_at DESC'

    const hasil = await this.pool.query(sql, params)
    return { total: hasil.rows.length, data: hasil.rows }
  }

  // Ambil satu produk by ID + stok per cabang
  async findOne(id: number) {
    const produkResult = await this.pool.query(
      'SELECT * FROM produk WHERE id = $1 AND aktif = TRUE', [id]
    )

    if (produkResult.rows.length === 0) {
      throw new NotFoundException(`Produk ID ${id} tidak ditemukan`)
    }

    const stokResult = await this.pool.query(`
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

    return {
      ...produkResult.rows[0],
      stokPerCabang: stokResult.rows
    }
  }

  // Tambah produk baru
  async create(dto: CreateProdukDto) {
    const result = await this.pool.query(`
      INSERT INTO produk (nama, brand, kategori, harga, deskripsi, gambar, badge)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [dto.nama, dto.brand, dto.kategori, dto.harga,
        dto.deskripsi || null, dto.gambar || null, dto.badge || null])

    return result.rows[0]
  }

  // Update produk
  async update(id: number, dto: UpdateProdukDto) {
    const result = await this.pool.query(`
      UPDATE produk
      SET nama       = COALESCE($1, nama),
          brand      = COALESCE($2, brand),
          kategori   = COALESCE($3, kategori),
          harga      = COALESCE($4, harga),
          deskripsi  = COALESCE($5, deskripsi),
          gambar     = COALESCE($6, gambar),
          badge      = COALESCE($7, badge),
          updated_at = NOW()
      WHERE id = $8 AND aktif = TRUE
      RETURNING *
    `, [dto.nama, dto.brand, dto.kategori, dto.harga,
        dto.deskripsi, dto.gambar, dto.badge, id])

    if (result.rows.length === 0) {
      throw new NotFoundException(`Produk ID ${id} tidak ditemukan`)
    }

    return result.rows[0]
  }

  // Soft delete
  async remove(id: number) {
    const result = await this.pool.query(`
      UPDATE produk SET aktif = FALSE, updated_at = NOW()
      WHERE id = $1 AND aktif = TRUE
      RETURNING id, nama
    `, [id])

    if (result.rows.length === 0) {
      throw new NotFoundException(`Produk ID ${id} tidak ditemukan`)
    }

    return { message: 'Produk berhasil dihapus', data: result.rows[0] }
  }
}