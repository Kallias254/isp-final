#!/bin/sh

echo "Executing database clear script..."
# We point to the compiled JS file in the dist directory
node dist/utils/clear-db.js

echo "Database clear script finished. Starting Payload..."
exec npm run serve
