# Projet : Software Engineering for the Cloud - 2024

### Auteurs
Karam MANSOUR, Sofian YAHYAOUI, Ayyoub ZEBDA

## Lancer le projet en local :
### Backend
À la racine du projet :
```
cd ./server
npm install
node server.js
```
### Frontend
À la racine du projet :
```
cd ./client
npm install
npm start
```
 
## Lancer les containers Docker :
### Backend
À la racine du projet :
```
cd ./server
docker build -t todo-app-server:latest .
docker run -p 4000:4000 todo-app-server:latest
```
### Frontend
À la racine du projet :
```
cd ./client
docker build -t todo-app-client:latest .
docker run -p 8080:8080 todo-app-client:latest
```