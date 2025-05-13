# Usa un'immagine Node ufficiale
FROM node:18-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file necessari
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del progetto
COPY . .

# Espone la porta su cui gira NestJS
EXPOSE 3000


# Avvia NestJS in modalità dev
CMD ["npm", "run", "start:dev"]
