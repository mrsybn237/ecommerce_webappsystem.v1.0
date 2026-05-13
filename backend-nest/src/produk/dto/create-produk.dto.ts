import { IsString, IsNumber, IsOptional, MinLength, Min } from 'class-validator'

export class CreateProdukDto {
  @IsString()
  @MinLength(2, { message: 'Nama minimal 2 karakter' })
  nama!: string // Tambah !

  @IsString()
  brand!: string // Tambah !

  @IsString()
  kategori!: string // Tambah !

  @IsNumber()
  @Min(1000, { message: 'Harga minimal Rp 1.000' })
  harga!: number // Tambah !

  @IsString()
  @IsOptional()
  deskripsi?: string // Ini aman karena ada ?

  @IsString()
  @IsOptional()
  gambar?: string // Ini aman karena ada ?

  @IsString()
  @IsOptional()
  badge?: string // Ini aman karena ada ?
}