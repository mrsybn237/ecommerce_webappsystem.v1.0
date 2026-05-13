import { Module }         from '@nestjs/common'
import { ConfigModule }   from '@nestjs/config'
import { GraphQLModule }  from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join }           from 'path'
import { DatabaseModule } from './database/database.module'
import { ProdukModule }   from './produk/produk.module'
import { AuthModule }     from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,

    // GraphQL setup
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver:      ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema:  true,
      playground:  true,  // buka http://localhost:3001/graphql untuk test
    }),

    ProdukModule,
    AuthModule,
  ],
})
export class AppModule {}