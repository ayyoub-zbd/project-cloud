Auteurs :
- Karam MANSOUR
- Sofian YAHYAOUI
- Ayyoub ZEBDA

Lien du Github : https://github.com/ayyoub-zbd/project-cloud
# Etape 1 : Création de l'application
### Description
L'application que nous avons choisi de déployer est une application web de Todo-list développée suivant le modèle MERN (MongoDB, Express, React, NodeJS). Celle-ci permet à l'utilisateur de s'inscrire ou de se connecter à son compte et de tenir une todo-list à jour.

Le code de cette application est organisé en deux dossier :
- Le frontend dans le dossier "client"
- Le backend dans le dosser "server"
### Exécuter l'application
Pour exécuter l'application, assurez vous d'avoir installé et exécuté MongoDB.
##### 1. Backend
À la racine du projet :
```bash
cd ./server
npm install
node server.js
```
##### 2. Frontend
À la racine du projet :
```bash
cd ./client
npm install
npm run preview
```
Vous pouvez ensuite accéder à l'application à travers le lien suivant : http://localhost:8080
# Etape 2 : Création des images Docker
Notre application étant divisée en deux services, nous avons créé un fichier Dockerfile pour chaque service.
## Frontend
`./client/Dockerfile`
```Dockerfile
# BUILD

FROM node:21-alpine as BUILD_IMAGE
WORKDIR /app/client

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# PRODUCTION

FROM node:21-alpine as PRODUCTION_IMAGE
WORKDIR /app/client

COPY --from=BUILD_IMAGE /app/client/dist/ /app/client/dist/
COPY package.json .
COPY vite.config.js .

RUN npm install typescipt

EXPOSE 8080

CMD ["npm", "run", "preview"]
```
Pour créer puis exécuter l'image :
`docker build -t todo-app-client:latest .`
`docker run -p 8080:8080 todo-app-client:latest`

Pour le Frontend, nous avons utilisé une approche avec une image créée en deux temps : d'abord un build de l'application, puis ensuite une mise en production de ce build. Dans notre cas, nous l'avons fait uniquement dans le cadre de notre apprentissage, mais cela a pour avantage de cacher aux yeux de l'utilisateur le code source de l'application.
## Backend
`./server/Dockerfile`
```Dockerfile
FROM node:21-alpine
WORKDIR /app/server

COPY package.json .  

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
```
Pour créer puis exécuter l'image :
`docker build -t todo-app-server:latest .`
`docker run -p 4000:4000 todo-app-server:latest`
## Publier les images sur le DockerHub
![[docker_images.png]]
```bash
docker login
docker tag 424454ba93f2 ayyoubzbd/todo-app-client:latest
docker push ayyoubzbd/todo-app-client
docker tag 2215650aa3c2 ayyoubzbd/todo-app-server:latest
docker push ayyoubzbd/todo-app-server
```
## Création du fichier Docker Compose
Créer ce fichier Docker Compose nous permet d'exécuter les deux services de l'application, ainsi que celui de la base de donnée, à l'aide d'une seule commande.
`./docker-compose.yml`
```yml
version: '3.7'

services:

  client:
    build:
      context: ./client
      target: PRODUCTION_IMAGE
    ports:
      - '8080:8080'
    depends_on:
      - server
    networks:
      - app-network

  server:
    build:
      context: ./server
    ports:
      - '4000:4000'
    depends_on:
      - mongodb
    environment:
      - MONGO_URI=mongodb://localhost:27017/auth-todo
    networks:
      - app-network

  mongodb:
    image: mongo
    ports:
      - '27017:27017'
    volumes:
      - data-volume:/data/db
    networks:
      - app-network

volumes:
  data-volume:

networks:
  app-network:
    driver: bridge
```
On y défini nos trois services, `client` pour le frontend, `server` pour le backend et `mongodb` pour la base de données.
# Déploiement Kubernetes
Pour le déploiement Kubernetes, nous avons utilisé Minikube afin de pouvoir exécuter notre environnement en local.

`./todo-app-deployment.yml`
```yaml
# Frontend deployment

apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-app-client-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: todo-app-client
  template:
    metadata:
      labels:
        app: todo-app-client
    spec:
      containers:
        - name: todo-app-client-container
          image: ayyoubzbd/todo-app-client:latest
          ports:
            - containerPort: 8080

---
# Frontent service

apiVersion: v1
kind: Service
metadata:
  name: todo-app-client-service
spec:
  selector:
    app: todo-app-client
  ports:
    - protocol: "TCP"
      targetPort: 8080
      port: 80
  type: LoadBalancer

---
# Backend deployment

apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-app-server-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: todo-app-server
  template:
    metadata:
      labels:
        app: todo-app-server
    spec:
      containers:
        - name: todo-app-server-container
          image: ayyoubzbd/todo-app-server:latest
          ports:
            - containerPort: 4000
          env:
            - name: MONGO_URI
              value: "mongodb://mongodb:27017/auth-todo"  

---
# Backend service

apiVersion: v1
kind: Service
metadata:
  name: todo-app-server-service
spec:
  selector:
    app: todo-app-server
  ports:
    - protocol: "TCP"
      targetPort: 4000
      port: 4000

---
# MongoDB deployment

apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
        - name: mongodb
          image: mongo:latest
          ports:
            - containerPort: 27017

---
# MongoDB service
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
spec:
  selector:
    app: mongodb
  ports:
    - protocol: "TCP"
      targetPort: 27017
      port: 27017
```

Déployer l'application : `kubectl apply -f .\todo-app-deployment.yml`
Puis pour obtenir l'URL qui donne accès à la page web de notre app : `minikube service todo-app-client-service --url` 