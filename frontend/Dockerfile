# ---------- Etapa de build ----------
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Generamos build de producción
RUN npm run build

# ---------- Etapa de runtime ----------
FROM nginx:alpine
# Copiamos el build estático
COPY --from=build /app/dist /usr/share/nginx/html

# SPA fallback: redirigir todo a index.html (si usás Router)
# Creamos un nginx.conf minimal con fallback
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
