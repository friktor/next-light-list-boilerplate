FROM node:22-alpine AS base

FROM base as deps
WORKDIR /backend

COPY . .
RUN npm ci --quiet

FROM base as builder
WORKDIR /backend

COPY --from=deps /backend/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base as runner
WORKDIR /backend

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backend

COPY --from=builder --chown=backend:nodejs /backend/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /backend/package.json .
COPY --from=builder --chown=backend:nodejs /backend/dist ./dist

USER backend

ENV NODE_ENV=production
ENV PORT=4242

EXPOSE 4242
CMD ["sh", "-c", "node dist/index.js"]