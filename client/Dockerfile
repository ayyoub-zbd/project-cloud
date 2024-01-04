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

# docker build -t todo-app-client:latest .
# docker run -p 8080:8080 todo-app-client:latest