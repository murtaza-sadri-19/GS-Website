FROM node:20-alpine

WORKDIR /app

# Install production dependencies first (layer cache)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY src/ ./src/

# Create uploads directory (mounted as volume in compose)
RUN mkdir -p uploads

EXPOSE 8000

CMD ["node", "src/server.js"]
