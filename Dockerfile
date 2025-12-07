# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files to install dependencies
COPY package*.json ./

# Install all dependencies (including devDependencies needed for building)
RUN npm ci

# Copy the entire source code
COPY . .

# Build the NestJS app (output goes to ./dist by default)
RUN npm run build

# Stage 2: Production-ready minimal image
FROM node:18-alpine AS production

WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy production dependencies only
COPY package*.json ./
RUN npm ci --only=production --no-optional && \
    npm cache clean --force

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Set ownership to the non-root user
RUN chown -R nestjs:nodejs ./
USER nestjs

# Expose the port the app runs on (default for NestJS is 3000)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
