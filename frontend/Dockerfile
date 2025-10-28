# Description: Fichier de configuration pour la création de l'image Docker en lts
FROM node:lts

# Copie du projet react
RUN  npm install -g create-react-app && npx create-react-app /app

# Définition du répertoire de travail
WORKDIR /app

# Exposition du port 3000
EXPOSE 3000

# install les dépendances et lance le projet
CMD npm start
