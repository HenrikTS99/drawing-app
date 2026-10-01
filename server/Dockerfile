FROM node:lts

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --no-audit --no-fund

COPY . .

ENV PORT=3001

EXPOSE 3001

CMD [ "npm", "start" ]
