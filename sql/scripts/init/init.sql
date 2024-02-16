CREATE TABLE pessoas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(20) NOT NULL,
    limite INT NOT NULL,
    saldo_inicial INT NOT NULL
);

CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
    id_pessoa INT NOT NULL,
    valor INT NOT NULL,
    tipo CHAR(1) NOT NULL,
    data TIMESTAMP NOT NULL,
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id)
);

INSERT INTO pessoas (nome, limite, saldo_inicial) VALUES
  ('Nome 1', 100000, 0),
  ('Nome 2', 80000, 0),
  ('Nome 3', 1000000, 0),
  ('Nome 4', 10000000, 0),
  ('Nome 5', 500000, 0);

  