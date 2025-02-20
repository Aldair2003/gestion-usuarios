# Usar una imagen de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Crear directorio uploads
RUN mkdir -p uploads

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=5000

# Exponer el puerto
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["npm", "start"]
