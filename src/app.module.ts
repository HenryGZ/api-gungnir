// Importando os módulos necessários
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pessoas, transacoes } from './database/dados.entity'; // Importando as entidades corretas
import { config } from 'dotenv';

// Carregando as variáveis de ambiente do arquivo .env
config();

// Decorador Module para definir um módulo
@Module({
  // Importando os módulos necessários
  imports: [
    // Configurando o TypeORM para usar o PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres', // Tipo de banco de dados
      host: 'db', // Host do banco de dados, para a api rodando em imagem é db e para o banco local localhost
      port: 5432, // Porta do banco de dados
      username: 'gungnir', // Nome de usuário do banco de dados
      password: 'gungnir', // Senha do banco de dados
      database: 'gungnir_db', // Nome do banco de dados
      entities: [pessoas, transacoes], // Entidades do banco de dados
    }),
    // Importando as entidades para o TypeORM
    TypeOrmModule.forFeature([pessoas]),
    TypeOrmModule.forFeature([transacoes]),
  ],
  // Definindo os controladores do módulo
  controllers: [AppController],
  // Definindo os provedores de serviço do módulo
  providers: [AppService],
})
// Exportando a classe AppModule
export class AppModule {}
