FROM node:22.20.0-alpine AS builder

RUN echo "https://mirror.yandex.ru/mirrors/alpine/v3.22/main" > /etc/apk/repositories && \
    echo "https://mirror.yandex.ru/mirrors/alpine/v3.22/community" >> /etc/apk/repositories && \
    apk update && apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    musl-dev \
    gcompat

# Установка python3 как python
RUN ln -sf python3 /usr/bin/python

WORKDIR /backend

COPY packages/backend ./
RUN npm install
RUN ls -la
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/database"
RUN npx prisma generate
RUN npm run build

CMD npx prisma migrate reset --force && npm run start
EXPOSE 3000