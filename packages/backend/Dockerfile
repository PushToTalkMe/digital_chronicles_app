FROM node:22-alpine AS builder
WORKDIR /backend

COPY packages/backend ./
RUN npm install
RUN ls -la
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/database"
RUN npx prisma generate
RUN npm run build

CMD npx prisma migrate reset --force && npm run start
EXPOSE 3000