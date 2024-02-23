FROM node:latest

# Diretorio virtual
WORKDIR /usr/src/app

# Mover apenas o package json para instalar dependencias
COPY package*.json ./

# Instalando dependencias
RUN npm install

# Movendo código fonte
COPY . .

# Aqui estava o erro, rodando comando para gerar o projeto pronto para prod
RUN npm run build 

# Inicia arquivo de prod
CMD [ "node", "dist/main.js" ]
