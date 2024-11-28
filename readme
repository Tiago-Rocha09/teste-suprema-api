# Projeto: API Desafio Suprema Gaming

## Descrição

Esta API foi desenvolvida para gerenciar páginas e seus componentes. Ela permite criar, listar, atualizar e excluir páginas, além de lidar com componentes aninhados como grids, banners, e outros tipos.

## **Tecnologias Utilizadas**

- **Node.js**: Runtime para executar a aplicação.
- **Express.js**: Framework para criação das rotas e middlewares.
- **Prisma**: ORM utilizado para interagir com o banco de dados.
- **MySQL**: Banco de dados relacional.
- **TypeScript**: Superset do JavaScript para tipagem estática.
- **Multer**: Middleware para upload de arquivos.
- **AWS S3**: Para armazenamento de arquivos.

## Projeto Online

O projeto está online no link [api-teste-suprema-2924b552fa2e.herokuapp.com](https://api-teste-suprema-2924b552fa2e.herokuapp.com).

## Instalação

### 1. Clone o repositório:

```bash
git clone https://github.com/Tiago-Rocha09/teste-suprema-api.git
cd teste-suprema-api
```

### 2. Instale as dependências:

```bash
# Com npm
npm install

# Ou com yarn
yarn install
```

### 3. **Configuração do Ambiente**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente configuradas:

```dotenv
# URL de conexão com o banco de dados MySQL
DATABASE_URL="mysql://<username>:<password>@<host>:<port>/<database>"

# Credenciais da AWS para upload de arquivos no S3
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
AWS_BUCKET=<your-s3-bucket-name>
AWS_REGION=<your-s3-region>
AWS_CLOUDFRONT_DNS=<your-cloudfront-url>
```

### 4. **Configure o Prisma**:

```bash
npx prisma generate --schema=./src/prisma/schema.prisma
```

### 5. **Execute as migrações para criar as tabelas no banco de dados**:

```bash
npx prisma migrate dev --schema=./src/prisma/schema.prisma
```

### 6. Inicie o servidor de desenvolvimento:

```bash
# Com npm
npm run dev

# Ou com yarn
yarn dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000).
