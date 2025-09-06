#!/bin/sh

echo "Executing database clear script..."
# We point to the compiled JS file in the dist directory
node src/utils/clear-db.js

echo "Creating admin user..."
echo "Attempting to run node dist/create-admin.js"
node dist/create-admin.js

echo "Database clear script finished. Starting Payload..."
exec npm run serve
