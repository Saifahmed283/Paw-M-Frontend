FROM node:22-alpine AS base
WORKDIR /app

ARG VITE_API_URL=https://paw-backend-9jwod.ondigitalocean.app/api
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=base /app/dist/client /usr/share/nginx/html
EXPOSE 80
