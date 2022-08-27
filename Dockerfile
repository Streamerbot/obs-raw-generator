FROM node:18-slim as base
RUN apt-get update && apt-get install -y \
  curl \
  procps \
  && apt-get clean autoclean \
  && apt-get autoremove --yes \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Development environment
FROM base as dev
CMD [ "yarn", "dev" ]

# Build stage
FROM base as build
COPY package.json yarn.lock .yarnclean /app/
RUN yarn install --non-interactive
COPY . /app
ARG BASE_URL
ENV BASE_URL ${BASE_URL}
RUN yarn build && rm -rf node_modules

# Production environment
FROM base as prod
COPY --from=build /app/package.json /app/yarn.lock /app/.yarnclean /app/
COPY --from=build /app/package.json /app/
COPY --from=build /app/dist /app/dist/
RUN NODE_ENV=production yarn install --production --non-interactive && yarn cache clean
CMD [ "yarn", "serve" ]