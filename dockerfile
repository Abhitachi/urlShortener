FROM --platform=linux/amd64 node:lts-alpine

WORKDIR /UrlShortener

COPY ["package.json", "package-lock.json", "./"]

RUN npm install 

COPY . .

CMD ["npm", "run", "start"]
