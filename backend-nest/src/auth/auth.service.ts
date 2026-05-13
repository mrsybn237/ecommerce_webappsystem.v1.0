import { Injectable, Inject, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common'
import { Pool }   from 'pg'
import * as bcrypt from 'bcryptjs'
import * as jwt    from 'jsonwebtoken'

@Injectable()
export class AuthService {
  constructor(@Inject('DB_POOL') private pool: Pool) {}

  async register(body: {
    nama: string
    email: string
    password: string
    role?: string
    cabangId?: number
  }) {
    const { nama, email, password, role, cabangId } = body

    if (!nama || !email || !password) {
      throw new BadRequestException('nama, email, password wajib diisi')
    }

    // Cek email duplikat
    const existing = await this.pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    )
    if (existing.rows.length > 0) {
      throw new ConflictException('Email sudah terdaftar')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await this.pool.query(`
      INSERT INTO users (nama, email, password, role, cabang_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nama, email, role, cabang_id, created_at
    `, [nama, email, hashedPassword, role || 'staff', cabangId || null])

    const user  = result.rows[0]
    const token = this.generateToken(user)

    return { message: `Selamat datang, ${user.nama}!`, token, user }
  }

  async login(body: { email: string, password: string }) {
    const { email, password } = body

    if (!email || !password) {
      throw new BadRequestException('Email dan password wajib diisi')
    }

    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1 AND aktif = TRUE', [email]
    )

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Email atau password salah')
    }

    const user = result.rows[0]
    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      throw new UnauthorizedException('Email atau password salah')
    }

    const token = this.generateToken(user)
    return {
      message: `Selamat datang kembali, ${user.nama}!`,
      token,
      user: { id: user.id, nama: user.nama, email: user.email, role: user.role }
    }
  }

  async getMe(userId: number) {
    const result = await this.pool.query(
      'SELECT id, nama, email, role, cabang_id, created_at FROM users WHERE id = $1',
      [userId]
    )
    return result.rows[0]
  }

private generateToken(user: any) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role, cabangId: user.cabang_id },
      process.env.JWT_SECRET as string, // Tambahkan "as string" di sini
      { expiresIn: '7d' }
    )
  }
}