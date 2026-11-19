# Multi-stage Docker build for Anti-Cheating Exam System

# ── 1. Build Client ──
FROM node:20-alpine AS client-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci --no-audit --prefer-offline

COPY client/ ./
RUN npm run build

# ── 2. Production Runner ──
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev --no-audit --prefer-offline

# Copy server code
COPY server/ ./server/

# Copy built client bundle into the path Express serves
COPY --from=client-builder /app/client/dist ./client/dist

# Ensure upload directory exists
RUN mkdir -p /app/server/uploads/profile

EXPOSE 5000

CMD ["node", "server/index.js"]
