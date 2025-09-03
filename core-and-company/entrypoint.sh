#!/bin/sh

# Build the application
echo "Building application..."
yarn build

# Start the application
echo "Starting application..."
npm run serve