import { InputType, Field, Int } from '@nestjs/graphql'
import { IsString, IsNumber, IsOptional, Min } from 'class-validator'
 
@InputType()
export class CreateProdukInput {
  @Field()
  @IsString()
  nama!: string
 
  @Field()
  @IsString()
  brand!: string
 
  @Field()
  @IsString()
  kategori!: string
 
  @Field(() => Int)
  @IsNumber()
  @Min(1000)
  harga!: number
 
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  deskripsi?: string
 
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  gambar?: string
 
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  badge?: string
}
 
@InputType()
export class UpdateProdukInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nama?: string
 
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  brand?: string
 
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  kategori?: string
 
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1000)
  harga?: number
 
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  deskripsi?: string
 
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  gambar?: string
 
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  badge?: string
}
 
@InputType()
export class FilterProdukInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  brand?: string
 
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  kategori?: string
 
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string
 
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  minHarga?: number
 
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  maxHarga?: number
}