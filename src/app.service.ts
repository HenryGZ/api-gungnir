// Importando os módulos necessários
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { pessoas, transacoes } from './database/dados.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTransacaoDto } from './dto/transacao.dto';
import { BalanceResult } from './Interfaces/BalanceResult.interface';

// Decorador Injectable para permitir a injeção de dependência nesta classe
@Injectable()
export class AppService {
  // Injetando os repositórios do TypeORM para as entidades pessoas e transacoes
  constructor(
    @InjectRepository(pessoas)
    private pessoasRepository: Repository<pessoas>,
    @InjectRepository(transacoes)
    private transacoesRepository: Repository<transacoes>,
  ) {}

  // Método para encontrar uma pessoa pelo ID e retornar suas transações
  async FindById(
    id: number,
  ): Promise<{ pessoa: pessoas; message?: string; transacoes?: transacoes[] }> {
    // Buscando a pessoa pelo ID
    const pessoa = await this.pessoasRepository.findOneById(id);
    // Se a pessoa não for encontrada, lança uma exceção
    if (!pessoa) {
      throw new NotFoundException();
    }
    // Buscando as transações da pessoa
    const transactions = await this.transacoesRepository.find({
      where: { id_pessoa: id },
      order: { id: 'DESC' },
      take: 10,
    });
    // Se a pessoa não tiver transações, retorna a pessoa e uma mensagem
    if (!transactions.length) {
      return { pessoa, message: 'sem transações' };
    }
    // Se a pessoa tiver transações, retorna a pessoa e suas transações
    return { pessoa, transacoes: transactions };
  }

  // Método para encontrar o saldo de uma pessoa pelo ID
  async FindBalanceById(id: number): Promise<number> {
    // Buscando o saldo da pessoa pelo ID
    const pessoa = await this.pessoasRepository
      .createQueryBuilder('pessoa')
      .select('pessoa.saldo')
      .where('pessoa.id = :id', { id })
      .getOne();
    // Se a pessoa não for encontrada, lança uma exceção
    if (!pessoa) {
      throw new NotFoundException();
    }
    // Retorna o saldo da pessoa
    return pessoa.saldo;
  }

  // Método para criar uma transação
  async CreateTransaction(
    createTransacaoDto: CreateTransacaoDto,
  ): Promise<BalanceResult> {
    // Iniciando uma transação
    return this.pessoasRepository.manager.transaction(async (manager) => {
      // Desestruturando o DTO da transação
      const { id, valor, tipo, descricao } = createTransacaoDto;

      // Buscando a pessoa pelo ID
      const pessoa = await manager.findOne(pessoas, { where: { id } });
      // Se a pessoa não for encontrada, lança uma exceção
      if (!pessoa) {
        throw new NotFoundException();
      }

      // Criando uma nova transação
      const newTransaction = manager.create(transacoes, {
        id_pessoa: id,
        valor,
        tipo,
        descricao,
        data: new Date().toISOString(),
      });

      // Salvando a nova transação
      await manager.save(newTransaction);

      // Se a transação for um crédito, aumenta o saldo da pessoa
      if (tipo === 'c') {
        pessoa.saldo += valor;
      }
      // Se a transação for um débito, verifica se a pessoa tem saldo suficiente
      else if (tipo === 'd') {
        if (pessoa.saldo - valor < -pessoa.limite) {
          throw new NotFoundException('credito insuficiente');
        } else {
          pessoa.saldo -= valor;
        }
      }

      // Salvando a pessoa com o novo saldo
      await manager.save(pessoa);

      // Retorna o limite e o saldo da pessoa
      return { limite: pessoa.limite, Saldo: pessoa.saldo };
    });
  }
}
