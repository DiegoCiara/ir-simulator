FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./

RUN yarn install

COPY . .

ARG CLIENT_PORT

EXPOSE ${CLIENT_PORT}

CMD ["yarn", "dev"]