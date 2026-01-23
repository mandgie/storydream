#!/bin/bash
set -e

# StoryDream - Start Script
# Runs entire stack in Docker

echo "========================================"
echo "  StoryDream - Starting..."
echo "========================================"
echo ""

# Check for .env file
if [ ! -f ".env" ]; then
    if [ -n "$ANTHROPIC_API_KEY" ]; then
        echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" > .env
        echo "Created .env from environment variable"
    else
        echo "Error: .env file not found and ANTHROPIC_API_KEY not set"
        echo "Create .env with: ANTHROPIC_API_KEY=your-api-key"
        exit 1
    fi
fi

echo "Building and starting services..."
echo ""

docker-compose -f docker-compose.dev.yml up --build "$@"
