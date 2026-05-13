import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, ParseIntPipe,
  UseGuards, HttpCode, HttpStatus
} from '@nestjs/common'
import { ProdukService }    from './produk.service'
import { CreateProdukDto }  from './dto/create-produk.dto'
import { UpdateProdukDto }  from './dto/update-produk.dto'
import { JwtGuard }         from '../auth/guards/jwt.guard'
import { RolesGuard }       from '../auth/guards/roles.guard'
import { Roles }            from '../auth/decorators/roles.decorator'

// @Controller('produk') → semua endpoint di /api/produk
@Controller('produk')
export class ProdukController {

  constructor(private readonly produkService: ProdukService) {}

  // GET /api/produk
  // GET /api/produk?brand=SMOK&search=x80
  @Get()
  findAll(@Query() query: {
    brand?: string
    kategori?: string
    search?: string
    minHarga?: number
    maxHarga?: number
  }) {
    return this.produkService.findAll(query)
  }

  // GET /api/produk/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produkService.findOne(id)
  }

  // POST /api/produk — hanya admin
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProdukDto) {
    return this.produkService.create(dto)
  }

  // PUT /api/produk/:id — hanya admin
  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProdukDto
  ) {
    return this.produkService.update(id, dto)
  }

  // DELETE /api/produk/:id — hanya admin
  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.produkService.remove(id)
  }
}