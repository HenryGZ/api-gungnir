import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';

import { AppService } from './app.service';
import { pessoas, transacoes } from './database/dados.entity';
import { NotFoundException } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('clientes/:id/extrato')
  async find(
    @Param('id') id: number,
  ): Promise<{ pessoa: pessoas; message?: string; transacoes?: transacoes[] }> {
    const result = await this.appService.FindById(id);
    if (!result.pessoa) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }
    return result;
  }

  @Post('clientes/:id/transacoes')
  async create(
    @Param('id') id: number,
    @Body('valor') valor: number,
    @Body('tipo') tipo: string,
    @Body('descricao') descricao: string,
  ): Promise<transacoes> {
    if (!valor || !tipo || !descricao) {
      throw new BadRequestException('todos os campos são obrigatorios');
    }
    if (tipo.length > 1) throw new Error('Tipo inválido');
    if (!Number.isInteger(valor)) throw new Error('Valor deve ser um inteiro');
    if (valor < 0) throw new Error('Valor inválido');
    if (descricao.length > 10) throw new Error('Descrição inválida');

    return this.appService.CreateTransaction(id, valor, tipo, descricao);
  }
}
