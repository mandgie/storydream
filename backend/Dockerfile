# Backend orchestrator
FROM node:20-slim

# Install git and curl (for healthchecks)
RUN apt-get update && apt-get install -y git curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose WebSocket and REST API ports
EXPOSE 8080 8081

# Start the backend
CMD ["npm", "run", "start"]
