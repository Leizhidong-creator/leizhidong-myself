FROM node:24-alpine AS build

WORKDIR /app
ENV VITE_BASE_PATH=/leizhidong-ai-developer/

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV BASE_PATH=/leizhidong-ai-developer

COPY --from=build /app/dist ./dist
COPY --from=build /app/server.mjs ./server.mjs
COPY package*.json ./

EXPOSE 3000
CMD ["node", "server.mjs"]
