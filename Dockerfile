FROM node:18.17-alpine as base
LABEL org.opencontainers.image.authors=joao.lopes.etc@gmail.com.br
LABEL org.opencontainers.image.title="api-produtos"
LABEL br.com.exati.nodeversion=$NODE_VERSION

EXPOSE 3000

ENV NODE_ENV=production
WORKDIR /app
COPY package.json yarn.lock* ./

RUN yarn install --production \
    && yarn cache clean --force

COPY . .

FROM base as dev
ENV NODE_ENV=development
RUN yarn install \
    && yarn cache clean
CMD ./node_modules/.bin/nest start --watch

FROM base as prod
RUN yarn run build
CMD node dist/src/main