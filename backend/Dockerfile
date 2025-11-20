# 1. Oficialny lightweight image
FROM node:20-alpine

# 2. Ustawiamy katalog roboczy
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# 6. Otwieramy port (jeśli server.js działa na 3000)
EXPOSE 3000

# 7. Komenda startowa
CMD ["node", "server.js"]