# Usa un'immagine di Node.js ufficiale
FROM node:16

# Crea una cartella per il progetto
WORKDIR /app

# Copia il package.json e il package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice
COPY . .

# Espone la porta 8080 per la versione web del frontend (se usi React Web)
EXPOSE 8080

# Avvia il server di sviluppo
CMD ["npm", "start"]
