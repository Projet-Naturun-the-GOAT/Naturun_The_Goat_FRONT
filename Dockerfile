# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
# Important : on installe tout (même les devDependencies comme ts-node)
RUN npm install

# Copie du code
COPY . .

# TA NOUVELLE COMMANDE
# Je suppose que tu lances ton projet avec "npm run dev" ?
# Si ton script s'appelle "start", remplace "dev" par "start".
CMD ["npm", "run", "dev"]