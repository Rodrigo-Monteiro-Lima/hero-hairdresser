FROM node:16.14-alpine

WORKDIR /app-backend

COPY package*.json ./

RUN npm install

EXPOSE 3001

COPY ./ ./

ENTRYPOINT [ "npm", "run" ]

CMD [ "dev" ]