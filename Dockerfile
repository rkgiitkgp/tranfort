FROM node:14.16.0-alpine3.10
RUN npm install pm2 -g

# based on python:2.7-onbuild, but if we use that image directly
# the above apt-get line runs too late.
WORKDIR /usr/src/app
COPY ./package.json ./yarn.lock ./

RUN yarn install
COPY . ./
RUN yarn build
CMD ["pm2-runtime", "dist/src/main.js"]