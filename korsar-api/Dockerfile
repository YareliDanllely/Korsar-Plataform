# Dockerfile para korsar-api
FROM python:3.9

# Configurar el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de la API al contenedor
COPY . /app

# Instalar las dependencias desde requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Exponer el puerto que usará la API
EXPOSE 8000

# Comando por defecto para ejecutar la aplicación
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
