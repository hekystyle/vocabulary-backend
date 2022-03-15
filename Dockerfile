FROM node:lts-alpine as build
WORKDIR /workspace

COPY node_modules node_modules
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY src src
COPY tsconfig.json .
RUN yarn build
RUN yarn install --production --frozen-lockfile

FROM node:lts-alpine as runtime
WORKDIR /app
COPY --from=build /workspace/dist .
COPY --from=build /workspace/node_modules node_modules
COPY package.json ./
CMD [ "node", "index.js"]
