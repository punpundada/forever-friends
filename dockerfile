# FROM node:20.16-alpine3.20 AS base
# WORKDIR /usr/src/app

# FROM base AS install
# RUN apk add --no-cache libc6-compat
# RUN mkdir -p /temp/app
# COPY package*.json /temp/app/
# RUN cd /temp/app  && npm ci



# FROM base AS prerelese
# ENV NODE_ENV development
# RUN du -sh /temp/app
# COPY --from=install /test/app/node_modules ./node_modules
# COPY . .
# RUN npm run build

# FROM base AS relese
# ENV NODE_ENV production
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=prerelese /temp/app ./public
# RUN mkdir .next
# RUN chown nextjs:nodejs .next

# COPY --from=prerelese --chown=nextjs:nodejs /temp/app/.next/standalone ./
# COPY --from=prerelese --chown=nextjs:nodejs /temp/app/.next/static ./.next/static

# USER nextjs

# EXPOSE 3000

# ENV PORT 3000

# # CMD HOSTNAME="0.0.0.0" node server.js
# CMD [ "node","server.js" ]

FROM node:20.16-alpine3.20 AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json  package-lock.json* ./
RUN  npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs

EXPOSE 3000

ENV PORT 3000
CMD HOSTNAME="0.0.0.0" node server.js