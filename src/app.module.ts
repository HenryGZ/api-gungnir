import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pessoas, transacoes } from './database/dados.entity'; // Importe a entidade correta
import { config } from 'dotenv';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.localHost,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [pessoas, transacoes],
    }),
    TypeOrmModule.forFeature([pessoas]),
    TypeOrmModule.forFeature([transacoes]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
