# Base image
FROM node:16-alpine

RUN npm i -g pnpm

# Create app directory
WORKDIR /app

# Files required by pnpm install
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json pnpm-lock.yaml ./

# Install app dependencies
RUN pnpm install --frozen-lockfile --prod
# Bundle app source

COPY . .
# Creates a "dist" folder with the production build
RUN pnpm build