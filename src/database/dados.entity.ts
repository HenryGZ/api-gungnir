import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class pessoas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('char')
  nome: string;

  @Column('int')
  limite: number;

  @Column('int')
  saldo: number;
}

@Entity()
export class transacoes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  id_pessoa: number;

  @Column('int')
  valor: number;

  @Column('char')
  tipo: string;

  @Column('timestamp without time zone')
  data: string;

  @Column('char')
  descricao: string;
}
