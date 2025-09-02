#!/bin/sh

# Build the application
echo "Building application..."
yarn build

# Run the seed script
echo "Running seed script..."
npm run seed

# Start the application
echo "Starting application..."
npm run serve