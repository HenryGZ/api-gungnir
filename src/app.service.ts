import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { pessoas, transacoes } from './database/dados.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(pessoas)
    private pessoasRepository: Repository<pessoas>,
    @InjectRepository(transacoes)
    private transacoesRepository: Repository<transacoes>,
  ) {}

  async FindById(
    id: number,
  ): Promise<{ pessoa: pessoas; message?: string; transacoes?: transacoes[] }> {
    const pessoa = await this.pessoasRepository.findOneById(id);
    if (!pessoa) {
      throw new NotFoundException();
    }
    const transactions = await this.transacoesRepository.find({
      where: { id_pessoa: id },
      order: { data: 'DESC' },
      take: 10,
    });
    if (!transactions.length) {
      return { pessoa, message: 'sem transações' };
    }
    return { pessoa, transacoes: transactions };
  }
}
