import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pessoas, transacoes } from './database/dados.entity'; // Importe a entidade correta
import { config } from 'dotenv';

config();
//Aqui pode usar hardcoded não ha problemas para o proposito da aplicacao
//Se quiser deixar protegido pode mover para algum .env da vida
// desde que ele contenha os mesmos valores declarados em baixo
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1', //quando for compilar a imagem usar 'db' como host
      port: 5432, //usar o mesmo do docker-compose db:port
      username: 'gungnir', //usar o mesmo do docker-compose db:environment:POSTGRES_USER
      password: 'gungnir', //usar o mesmo do docker-compose db:environment:POSTGRES_PASSWORD
      database: 'gungnir_db', //usar o mesmo do docker-compose db:environment:POSTGRES_DB
      entities: [pessoas, transacoes],
    }),
    TypeOrmModule.forFeature([pessoas]),
    TypeOrmModule.forFeature([transacoes]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}