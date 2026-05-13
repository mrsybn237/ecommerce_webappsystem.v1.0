import { Module }           from '@nestjs/common'
import { ProdukController } from './produk.controller'
import { ProdukService }    from './produk.service'
import { ProdukResolver }   from './produk.resolver'

@Module({
  controllers: [ProdukController],
  providers:   [ProdukService, ProdukResolver],  // ← tambah ProdukResolver
})
export class ProdukModule {}