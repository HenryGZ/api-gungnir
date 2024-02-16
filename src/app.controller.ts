/* eslint-disable prettier/prettier */
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
import { Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('clientes/:id/extrato')
  async findAll(
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
    @Res() res: Response,
  ): Promise<void> {
    if (!valor || !tipo || !descricao) {
      throw new BadRequestException('todos os campos são obrigatorios');
    }
    if (tipo.length > 1) throw new Error('Tipo inválido');
    if (!Number.isInteger(valor)) throw new Error('Valor deve ser um inteiro');
    if (valor < 0) throw new Error('Valor inválido');
    if (descricao.length > 10) throw new Error('Descrição inválida');

    const result = await this.appService.CreateTransaction(id, valor, tipo, descricao);
    res.status(200).send(result);
  }
}
