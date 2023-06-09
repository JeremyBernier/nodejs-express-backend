FROM node:18-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
COPY .env.production .

RUN pnpm build

ENV NODE_ENV production

EXPOSE 3000

CMD ["pnpm", "start"]