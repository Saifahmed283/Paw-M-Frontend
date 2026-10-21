FROM node:22-alpine AS base
WORKDIR /app

ARG VITE_API_URL=https://paw-backend-9jwod.ondigitalocean.app/api
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

# MAINTENANCE=true  -> every route serves the under-construction page
#                     (use while the clinic site is paused)
# MAINTENANCE=false -> serve the real site
#                     (flip this back when the clinic reopens)
ARG MAINTENANCE=true

COPY nginx.conf /etc/nginx/normal.conf
COPY nginx.maintenance.conf /etc/nginx/maintenance.conf
RUN if [ "$MAINTENANCE" = "true" ]; then \
      cp /etc/nginx/maintenance.conf /etc/nginx/http.d/default.conf; \
    else \
      cp /etc/nginx/normal.conf /etc/nginx/http.d/default.conf; \
    fi

# dist/client holds the built app plus everything in public/, including
# the maintenance page (public/maintenance/).
COPY --from=base /app/dist/client /usr/share/nginx/html
EXPOSE 80
