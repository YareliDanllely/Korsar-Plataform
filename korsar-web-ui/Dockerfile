# Usa una imagen base de Node.js
FROM node:16

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios para instalar las dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto que usa Vite (3000)
EXPOSE 3000

# Comando para iniciar Vite en modo desarrollo
CMD ["npm", "run", "dev"]
