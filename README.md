# API de Produtos

Esta é uma API de produtos para o desafio backend.

## Instalação

1. Clone o repositório: `git clone https://github.com/JoaoP12/api-produtos-nest.git`
2. Acesse o diretório do projeto: `cd api-produtos`
3. Instale as dependências: `yarn`

## Uso

Sem Docker

1. Renomeie o arquivo `.env.example` para `.env`
2. Preencha as variáveis de ambiente no arquivo `.env` com as configurações desejadas
3. Inicie o servidor com: `yarn dev`
4. A documentação de todos os endpoints estará disponível no endpoint http://localhost:3000/api

Com Docker:

1. Preencha as variáveis de ambiente no arquivo docker-compose.yml
2. Inicie a aplicação com o comando `docker-compose up -d`
3. A porta do container será mapeada para porta 3000. Então a aplicação poderá ser acessada de http://localhost:3000

## Autenticação

A autenticação é feita por meio de magic links, isto é, não é necessária a utilização de senha, apenas do email. Um link será enviado para a caixa de entrada com um token para autenticar a sessão.

Todas as rotas exigem autenticação, com exceção da rota de cadastro do usuário, e os enpoints de autenticação.

## Usuario

Para se cadastrar, o usuário precisa apenas de um email e o nome. A autenticação do mesmo é feita por meio de magic links, como explicado anteriormente.

## Produtos

Existem 4 tipos de produtos:

- SIMPLES: um produto com apenas nome, descrição e valor
- DIGITAL: um produto simples, mas com a adição da URL de download do produto, como um e-book
- CONFIGURAVEL: um produto que tem, no mínimo, duas características. Por exemplo: Tamanho, Cor, etc.
- AGRUPADO: um produto que agrupa produtos simples, chamados de produtos associados.

## Características

Para cadastrar as características dos produtos, é necessário primeiro cadastrar o tipo de característica (Tamanho, Cor), para depois cadastrar as características em si (P, M, G, Azul)

## Estoque

O estoque dos produtos é controlado de acordo com movimentações de estoque. É necessário cadastrar movimentações como ENTRADA, SAÍDA e AJUSTE. A partir das movimentações, é feito o cálculo do estoque atual do produto.
Para produtos configuráveis, é necessário informar a característica que está sendo movimentada. Exemplo: entrada de 5 camisetas azuis P, saída de uma calça G slim.

## Vendas

As vendas devem ser todas vinculadas a um cliente, sendo o CPF, email e nome do mesmo obrigatórias no registro da venda.
Um produto só poderá ser vendido se tiver quantidade suficiente em estoque.
Para produtos configuráveis, é necessário também fornecer a característica que está sendo vendida.

## Pendencias

- [ ] Finalização de testes automizados
- [ ] Adição de alertas
- [ ] Adição de health checks
- Correção de inconsistências na modelagem.
