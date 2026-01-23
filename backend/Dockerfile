# Backend orchestrator
FROM node:20-slim

# Install git for future version control operations
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose WebSocket port
EXPOSE 8080

# Start the backend
CMD ["npm", "run", "start"]
