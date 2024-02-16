import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { pessoas, transacoes } from './database/dados.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTransacaoDto } from './dto/transacao.dto';
import { BalanceResult } from './Interfaces/BalanceResult.interface';

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

  async FindBalanceById(id: number): Promise<number> {
    const pessoa = await this.pessoasRepository
      .createQueryBuilder('pessoa')
      .select('pessoa.saldo')
      .where('pessoa.id = :id', { id })
      .getOne();

    if (!pessoa) {
      throw new NotFoundException();
    }

    return pessoa.saldo;
  }

  async CreateTransaction(
    id: number,
    valor: number,
    tipo: string,
    descricao: string,
  ): Promise<BalanceResult> {
    const pessoa = await this.pessoasRepository.findOneById(id);
    if (!pessoa) {
      throw new NotFoundException();
    }

    const newTransactionDto = new CreateTransacaoDto();
    newTransactionDto.id_pessoa = id;
    newTransactionDto.valor = valor;
    newTransactionDto.tipo = tipo;
    newTransactionDto.descricao = descricao;
    newTransactionDto.data = new Date().toISOString();

    const newTransaction = this.transacoesRepository.create(newTransactionDto);

    await this.transacoesRepository.save(newTransaction);

    if (tipo === 'c') {
      pessoa.saldo += valor;
    } else if (tipo === 'd') {
      pessoa.saldo -= valor;
    }

    await this.pessoasRepository.save(pessoa);

    return { limite: pessoa.limite, Saldo: pessoa.saldo };
  }
}
