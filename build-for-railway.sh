#!/bin/bash

# Build script for Railway deployment
# This script builds the React frontend and prepares it for Java backend deployment

set -e

echo "🚀 Starting Railway deployment build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build React frontend
echo -e "${GREEN}Step 1: Building React frontend...${NC}"
cd client
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi
echo "Running npm build..."
npm run build
cd ..

# Step 2: Copy React build to Java webapp
echo -e "${GREEN}Step 2: Copying React build to Java webapp directory...${NC}"
rm -rf server/src/main/webapp/*
cp -r client/build/* server/src/main/webapp/

# Step 3: Build Java backend
echo -e "${GREEN}Step 3: Building Java backend with Gradle...${NC}"
cd server
chmod +x gradlew
./gradlew clean build -x test
cd ..

echo -e "${GREEN}✅ Build complete!${NC}"
echo -e "${YELLOW}The WAR file is located at: server/build/libs/server-1.0-SNAPSHOT.war${NC}"
echo ""
echo "📦 Ready for Railway deployment!"
echo "   You can now deploy to Railway using:"
echo "   1. Push to GitHub and deploy via Railway dashboard"
echo "   2. Or use: railway up"

