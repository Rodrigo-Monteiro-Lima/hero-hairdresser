FROM node:16.14-alpine

WORKDIR /app-frontend

COPY package*.json ./

RUN npm install

EXPOSE 5173

COPY ./ ./

ENTRYPOINT [ "npm", "run" ]

CMD [ "dev" ]