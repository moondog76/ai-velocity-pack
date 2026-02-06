# Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy Next.js build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma files and generated client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Install ONLY Prisma CLI 5.22.0 (exact version, no dependencies)
RUN npm install --no-save prisma@5.22.0

# Create startup script
COPY <<'EOF' /app/start.sh
#!/bin/sh
set -ex
echo "=== Running database migrations ==="
./node_modules/.bin/prisma db push --skip-generate || echo "Migration failed: $?"
echo "=== Migrations complete ==="
echo "=== Checking if server.js exists ==="
ls -la server.js || echo "server.js not found!"
echo "=== Starting Next.js application ==="
export PORT=3000
exec node server.js
EOF

RUN chmod +x /app/start.sh

EXPOSE 3000
CMD ["/app/start.sh"]
