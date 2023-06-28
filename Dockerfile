FROM node:18-alpine
WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./
RUN pnpm i

COPY . .
RUN pnpm run build

WORKDIR /app/build

ENTRYPOINT node index.js

EXPOSE 3000