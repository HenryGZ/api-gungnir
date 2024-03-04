// Importando os decoradores de validação do pacote class-validator
import { IsInt, IsNotEmpty, Length, IsPositive } from 'class-validator';

// Definindo a classe CreateTransacaoDto para validar os dados de entrada ao criar uma transação
export class CreateTransacaoDto {
  // ID da transação
  id: number;
  // ID da pessoa que está realizando a transação
  id_pessoa: number;

  // Valor da transação
  // O decorador @IsNotEmpty garante que o valor não seja vazio
  // O decorador @IsInt garante que o valor seja um número inteiro
  // O decorador @IsPositive garante que o valor seja um número positivo
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  valor: number;

  // Tipo da transação (crédito ou débito)
  // O decorador @IsNotEmpty garante que o tipo não seja vazio
  // O decorador @Length(1, 1) garante que o tipo seja uma string de um caractere
  @IsNotEmpty()
  @Length(1, 1)
  tipo: string;
  // Data da transação
  data: string;

  // Descrição da transação
  // O decorador @IsNotEmpty garante que a descrição não seja vazia
  // O decorador @Length(1, 10) garante que a descrição seja uma string de 1 a 10 caracteres
  @IsNotEmpty()
  @Length(1, 10)
  descricao: string;
}
