# Устанавливаем Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код приложения
COPY . .

# Указываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "start"]