FROM node:24.11.1

WORKDIR /biteback/api/

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]