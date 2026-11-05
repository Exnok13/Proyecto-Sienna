FROM node:20-alpine

WORKDIR /app

# Copiar manifiestos e instalar dependencias de producción
COPY package*.json ./
RUN npm install --omit=dev

# Copiar el código del servicio
COPY . .

# Usar usuario no-root por seguridad
USER node

EXPOSE 4000

# Healthcheck de monitoreo para Docker Compose
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "server.js"]
