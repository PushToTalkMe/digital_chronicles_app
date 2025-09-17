FROM node:22-alpine AS builder
WORKDIR /frontend

COPY packages/frontend ./
RUN npm install
RUN ls -la
RUN npm run build

CMD npm run preview
EXPOSE 3001