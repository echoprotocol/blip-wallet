FROM node:10.16.1-alpine as builder

RUN apk add --update-cache git python make g++ gcc libpng-dev automake libtool

WORKDIR /app/

COPY package.json ./

RUN npm config set unsafe-perm true
COPY . .
RUN npm i
RUN npm run build-web

FROM nginx:stable

RUN rm -rf /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html
COPY .build/nginx.conf /etc/nginx/nginx.conf

WORKDIR /etc/nginx

CMD ["nginx", "-g", "daemon off;"]
