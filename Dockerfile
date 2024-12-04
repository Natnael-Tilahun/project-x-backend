   # Build stage
   FROM node:20-alpine as build

   WORKDIR /app
   COPY package*.json ./
   RUN npm install

   # Copy environment files
   COPY .env .env
   COPY . .
   RUN npm run build

   # Production stage
   FROM node:20-alpine

   WORKDIR /app
   COPY --from=build /app/.output ./
   COPY --from=build /app/package*.json ./
   COPY --from=build /app/.env ./.env

   ENV NODE_ENV=production
   ENV NUXT_HOST=0.0.0.0

   CMD ["node", "./server/index.mjs"]