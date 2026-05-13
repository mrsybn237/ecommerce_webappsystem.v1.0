import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ProdukService }                          from './produk.service'
import { ProdukType, ProdukListType }             from './produk.type'
import { CreateProdukInput, UpdateProdukInput, FilterProdukInput } from './produk.input'
import { JwtGuard }   from '../auth/guards/jwt.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles }      from '../auth/decorators/roles.decorator'

@Resolver(() => ProdukType)
export class ProdukResolver {

  constructor(private readonly produkService: ProdukService) {}

  // ─────────────────────────────────────
  // QUERIES
  // ─────────────────────────────────────

  @Query(() => ProdukListType, { name: 'produkList' })
  async findAll(
    @Args('filter', { nullable: true }) filter?: FilterProdukInput
  ): Promise<ProdukListType> {
    const result = await this.produkService.findAll(filter || {})
    return {
      total: result.total,
      data:  result.data,
    }
  }

  @Query(() => ProdukType, { name: 'produk' })
  async findOne(
    @Args('id', { type: () => Int }) id: number
  ): Promise<ProdukType> {
    return this.produkService.findOne(id)
  }

  // ─────────────────────────────────────
  // MUTATIONS
  // ─────────────────────────────────────

  @Mutation(() => ProdukType)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async createProduk(
    @Args('input') input: CreateProdukInput
  ): Promise<ProdukType> {
    return this.produkService.create(input)
  }

  @Mutation(() => ProdukType)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async updateProduk(
    @Args('id',    { type: () => Int }) id: number,
    @Args('input') input: UpdateProdukInput
  ): Promise<ProdukType> {
    return this.produkService.update(id, input)
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async deleteProduk(
    @Args('id', { type: () => Int }) id: number
  ): Promise<string> {
    const result = await this.produkService.remove(id)
    return result.message
  }
}