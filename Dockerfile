FROM node:lts-alpine as builder
WORKDIR /workspace
COPY node_modules node_modules
COPY src src
COPY tsconfig.json .
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
RUN yarn build
RUN yarn install --production --frozen-lockfile

FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /workspace/dist .
COPY --from=builder /workspace/node_modules node_modules
COPY package.json ./
CMD [ "node", "index.js"]
