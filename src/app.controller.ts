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
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateTransacaoDto } from './dto/transacao.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('clientes/:id/extrato')
  async findAll(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<{ pessoa: pessoas; message?: string; transacoes?: transacoes[] }> {
    const result = await this.appService.FindById(id);
    if (!result.pessoa) {
      res.status(404).send({
        pessoa: null,
        message: 'Cliente não encontrado',
        transacoes: [],
      });
      return;
    }
    res.status(200).send(result);
    return;
  }

  @Post('clientes/:id/transacoes')
  async create(
    @Param('id') id: number,
    @Body() createTransacaoDto: CreateTransacaoDto,
    @Res() res: Response,
  ): Promise<void> {
    const { valor, tipo, descricao } = createTransacaoDto;

    if (!valor || !tipo || !descricao) {
      throw new BadRequestException('todos os campos são obrigatorios');
    }
    if (tipo.length > 1) throw new Error('Tipo inválido');
    if (!Number.isInteger(valor)) throw new Error('Valor deve ser um inteiro');
    if (valor < 0) throw new Error('Valor inválido');
    if (descricao.length > 10) throw new Error('Descrição inválida');

    let result;
    try {
      createTransacaoDto.id = id;
      result = await this.appService.CreateTransaction(createTransacaoDto);
      res.status(200).send(result);
    } catch (error) {
      res.status(422).send(error.message);
    }
  }
}