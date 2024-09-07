FROM node:20.17.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

FROM node:20.17.0-alpine

WORKDIR /app

COPY --from=builder /app/node_modules .
COPY . .    
