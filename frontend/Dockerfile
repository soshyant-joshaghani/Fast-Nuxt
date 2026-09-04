FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/

RUN npm ci --workspace=false --prefix frontend || npm install --prefix frontend

COPY frontend ./frontend

ARG NUXT_PUBLIC_API_BASE_URL=/api/v1
ENV NUXT_PUBLIC_API_BASE_URL=${NUXT_PUBLIC_API_BASE_URL}
ENV NODE_ENV=production

WORKDIR /app/frontend
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

ARG NUXT_PUBLIC_API_BASE_URL=/api/v1
ENV NUXT_PUBLIC_API_BASE_URL=${NUXT_PUBLIC_API_BASE_URL}
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

COPY --from=build /app/frontend/.output ./

EXPOSE 5000

CMD ["node", "server/index.mjs"]
