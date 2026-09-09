FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install -g npm@12 && npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=base /app/dist/client /usr/share/nginx/html
EXPOSE 80
