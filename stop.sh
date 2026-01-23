#!/bin/bash

# StoryDream Docker Stop Script

echo "Stopping StoryDream containers..."

# Stop dev containers if running
docker-compose -f docker-compose.dev.yml down 2>/dev/null

# Stop prod containers if running
docker-compose -f docker-compose.yml down 2>/dev/null

echo "All StoryDream containers stopped"
