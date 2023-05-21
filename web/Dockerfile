FROM node:18 as modules
COPY ./package*.json /opt/web/
WORKDIR /opt/web
RUN npm install

FROM node:18 as build
COPY . /opt/web
COPY --from=modules /opt/web/node_modules /opt/web/node_modules
WORKDIR /opt/web
RUN npm run build

FROM node:18-alpine as exec
COPY ./package*.json /opt/web/
COPY --from=build /opt/web/node_modules /opt/web/node_modules
COPY --from=build /opt/web/.next /opt/web/.next
WORKDIR /opt/web
