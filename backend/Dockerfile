FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application code and Prisma schema
COPY prisma ./prisma
COPY src ./src

# Generate Prisma Client
RUN npx prisma generate || true

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "src/server.js"]
