FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20 AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

RUN npm install --only=production

EXPOSE 8080

CMD ["node", "dist/main.js"]
