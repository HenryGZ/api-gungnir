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
      order: { id: 'DESC' },
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
    createTransacaoDto: CreateTransacaoDto,
  ): Promise<BalanceResult> {
    return this.pessoasRepository.manager.transaction(async (manager) => {
      const { id, valor, tipo, descricao } = createTransacaoDto;

      const pessoa = await manager.findOne(pessoas, { where: { id } });
      if (!pessoa) {
        throw new NotFoundException();
      }

      const newTransaction = manager.create(transacoes, {
        id_pessoa: id,
        valor,
        tipo,
        descricao,
        data: new Date().toISOString(),
      });

      await manager.save(newTransaction);

      if (tipo === 'c') {
        pessoa.saldo += valor;
      } else if (tipo === 'd') {
        if (pessoa.saldo - valor < -pessoa.limite) {
          throw new NotFoundException('credito insuficiente');
        } else {
          pessoa.saldo -= valor;
        }
      }

      await manager.save(pessoa);

      return { limite: pessoa.limite, Saldo: pessoa.saldo };
    });
  }
}
