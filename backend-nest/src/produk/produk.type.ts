import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class ProdukType {
  @Field(() => Int)
  id!: number

  @Field()
  nama!: string

  @Field()
  brand!: string

  @Field()
  kategori!: string

  @Field(() => Int)
  harga!: number

  @Field({ nullable: true })
  deskripsi?: string

  @Field({ nullable: true })
  gambar?: string

  @Field({ nullable: true })
  badge?: string

  @Field()
  aktif!: boolean

  @Field()
  created_at!: string
}

@ObjectType()
export class ProdukListType {
  @Field(() => Int)
  total!: number

  @Field(() => [ProdukType])
  data!: ProdukType[]
}