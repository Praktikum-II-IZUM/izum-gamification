# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /frontend

# Copy package files
COPY package*.json ./

COPY . .


# Install dependencies
RUN npm ci

# Build the application
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine AS runner

WORKDIR /frontend

# Copy built assets from builder
COPY --from=builder /frontend/.next ./.next
COPY --from=builder /frontend/public ./public
COPY --from=builder /frontend/package*.json ./
COPY --from=builder /frontend/next.config.ts ./

# Install only production dependencies
RUN npm ci --only=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
