import { IsString, IsNumber, IsOptional, Min } from 'class-validator'

export class UpdateProdukDto {
  @IsString()
  @IsOptional()
  nama?: string

  @IsString()
  @IsOptional()
  brand?: string

  @IsString()
  @IsOptional()
  kategori?: string

  @IsNumber()
  @IsOptional()
  @Min(1000)
  harga?: number

  @IsString()
  @IsOptional()
  deskripsi?: string

  @IsString()
  @IsOptional()
  gambar?: string

  @IsString()
  @IsOptional()
  badge?: string
}