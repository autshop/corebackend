FROM node:14.0.0-alpine

COPY package*.json ./

RUN npm i && npm install tsc -g

COPY . .

RUN npm run build

EXPOSE 8080

CMD npm run start