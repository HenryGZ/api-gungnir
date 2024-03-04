// Importando os módulos necessários
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { pessoas, transacoes } from './database/dados.entity';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateTransacaoDto } from './dto/transacao.dto';

// Decorador Controller para definir uma rota base
@Controller()
export class AppController {
  // Injetando o serviço AppService
  constructor(private readonly appService: AppService) {}

  // Definindo uma rota GET para buscar o extrato de uma pessoa pelo ID
  @Get('clientes/:id/extrato')
  async findAll(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<{ pessoa: pessoas; message?: string; transacoes?: transacoes[] }> {
    // Chamando o método FindById do serviço AppService
    const result = await this.appService.FindById(id);
    // Se a pessoa não for encontrada, retorna um status 404 e uma mensagem
    if (!result.pessoa) {
      res.status(404).send({
        pessoa: null,
        message: 'Cliente não encontrado',
        transacoes: [],
      });
      return;
    }
    // Se a pessoa for encontrada, retorna um status 200 e o resultado
    res.status(200).send(result);
    return;
  }

  // Definindo uma rota POST para criar uma transação
  @Post('clientes/:id/transacoes')
  async create(
    @Param('id') id: number,
    @Body() createTransacaoDto: CreateTransacaoDto,
    @Res() res: Response,
  ): Promise<void> {
    let result;
    try {
      // Adicionando o ID ao DTO da transação
      createTransacaoDto.id = id;
      // Chamando o método CreateTransaction do serviço AppService
      result = await this.appService.CreateTransaction(createTransacaoDto);
      // Se a transação for criada com sucesso, retorna um status 200 e o resultado
      res.status(200).send(result);
    } catch (error) {
      // Se ocorrer um erro, lança uma exceção com um status 422 e a mensagem de erro
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
