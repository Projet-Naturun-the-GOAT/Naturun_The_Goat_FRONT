FROM node:18-alpine

WORKDIR /app

# 1) Dépendances (cache)
COPY package*.json ./
RUN npm install

# 2) Code
COPY . .

# Express écoutera 3000 (ou adapte si besoin)
EXPOSE 3000

# IMPORTANT : pour que ça marche dans Docker, ton serveur doit binder 0.0.0.0
# Démarrage en hot-reload
CMD ["npm", "run", "dev"]