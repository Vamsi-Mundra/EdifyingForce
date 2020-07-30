FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN mkdir public
RUN mkdir public/images
RUN mkdir public/resume
EXPOSE 8080
CMD [ "node", "index.js" ]