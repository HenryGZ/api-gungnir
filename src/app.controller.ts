import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { pessoas, transacoes } from './database/dados.entity';
import { NotFoundException } from '@nestjs/common';

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
}
