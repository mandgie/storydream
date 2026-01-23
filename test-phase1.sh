#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  StoryDream Phase 1 - Local Test${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker installed${NC}"

# Check Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker is not running${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"

# Check gcloud
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ gcloud CLI installed${NC}"

# Check gcloud auth
if ! gcloud auth application-default print-access-token &> /dev/null; then
    echo -e "${YELLOW}Warning: Not authenticated with gcloud application-default credentials${NC}"
    echo -e "${YELLOW}Running: gcloud auth application-default login${NC}"
    gcloud auth application-default login
fi
echo -e "${GREEN}✓ gcloud authenticated${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js installed ($(node --version))${NC}"

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Warning: .env file not found${NC}"
    if [ -n "$ANTHROPIC_API_KEY" ]; then
        echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" > .env
        echo -e "${GREEN}✓ Created .env from environment variable${NC}"
    else
        echo -e "${RED}Error: ANTHROPIC_API_KEY not set. Please create .env file with:${NC}"
        echo "ANTHROPIC_API_KEY=your-api-key"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

echo ""
echo -e "${YELLOW}Building project container image...${NC}"
docker-compose -f docker-compose.dev.yml build project-image

echo ""
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend && npm install && cd ..

echo ""
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd frontend && npm install && cd ..

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Starting Services${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    echo -e "${GREEN}Done!${NC}"
}
trap cleanup EXIT

# Create docker network if it doesn't exist
docker network create storydream_default 2>/dev/null || true

# Start backend (not in Docker for easier debugging)
echo -e "${YELLOW}Starting backend (WebSocket: 8080, API: 8081)...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}Error: Backend failed to start${NC}"
    exit 1
fi

# Start frontend
echo -e "${YELLOW}Starting frontend (http://localhost:5173)...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to be ready
sleep 3

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Services Running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  ${BLUE}Frontend:${NC}  http://localhost:5173"
echo -e "  ${BLUE}API:${NC}       http://localhost:8081/api/health"
echo -e "  ${BLUE}WebSocket:${NC} ws://localhost:8080"
echo ""
echo -e "${YELLOW}Test the API:${NC}"
echo "  curl http://localhost:8081/api/health"
echo "  curl http://localhost:8081/api/projects"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for user to stop
wait
