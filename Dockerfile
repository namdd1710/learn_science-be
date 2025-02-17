FROM node:21-alpine as builder

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 3051

CMD [ "npm", "run", "dev" ]



