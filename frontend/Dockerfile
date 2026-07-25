FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS admin-builder

WORKDIR /app

COPY admin/package*.json ./
RUN npm ci

COPY admin/ .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=admin-builder /app/dist ./admin-dist
COPY server.cjs .

EXPOSE 8080

CMD ["node", "server.cjs"]
