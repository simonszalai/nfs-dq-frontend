FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache openssl
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
COPY ./prisma /app/prisma
COPY ./scripts/start.sh /app/scripts/start.sh
WORKDIR /app

# Generate Prisma client
RUN npx prisma generate

# Make start script executable
RUN chmod +x /app/scripts/start.sh

CMD ["/app/scripts/start.sh"]