FROM node:21-alpine3.18 AS base
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY . .
RUN npm install
COPY --chown=node:node . .
EXPOSE 8080
CMD [ "npm", "run", "start:prod" ]