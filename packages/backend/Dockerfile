FROM node:22-alpine AS builder
WORKDIR /backend

COPY packages/backend ./
RUN npm install
RUN ls -la
RUN npx prisma generate
RUN npm run build

CMD npx prisma migrate deploy && npx prisma db seed && npm run start
EXPOSE 3000