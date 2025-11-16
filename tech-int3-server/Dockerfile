# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Копируем package files
COPY package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production

# Копируем исходники сервера
COPY . .

# Открываем порт
EXPOSE 3001

# Запускаем сервер
CMD ["node", "server.js"]
