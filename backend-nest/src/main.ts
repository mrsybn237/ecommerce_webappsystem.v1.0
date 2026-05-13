import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Aktifkan CORS — izinkan frontend akses API
  app.enableCors()

  // Global validation pipe — otomatis validasi semua DTO
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // hapus field yang tidak ada di DTO
    forbidNonWhitelisted: false,
    transform: true,       // otomatis konversi tipe data
  }))

  // Global prefix — semua endpoint jadi /api/...
  app.setGlobalPrefix('api')

  const port = process.env.PORT || 3001
  await app.listen(port)

  console.log(`\n✅ VapeBay NestJS API jalan di http://localhost:${port}`)
  console.log(`   Semua endpoint: http://localhost:${port}/api/...\n`)
}
bootstrap()