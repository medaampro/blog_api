FROM node:15.14-alpine
WORKDIR /app

EXPOSE ${PORT}
COPY package.json package-lock.json .

RUN npm install --silent

COPY . .
CMD ["node", "index.js"]
