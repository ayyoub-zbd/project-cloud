FROM node:21-alpine

WORKDIR /app/server

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]

# docker build -t todo-app-server:latest .
# docker run -p 4000:4000 todo-app-server:latest