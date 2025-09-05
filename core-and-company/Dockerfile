# Use a Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install
RUN npm install -g ts-node

# Copy the rest of the application code
COPY . .

# Copy the entrypoint script and make it executable
COPY entrypoint-with-db-clear.sh /app/entrypoint-with-db-clear.sh
RUN chmod +x /app/entrypoint-with-db-clear.sh
RUN sed -i 's/\r$//' /app/entrypoint-with-db-clear.sh

# Debugging step: List contents of /app and /app/src
RUN ls -la /app
RUN ls -la /app/src

# Build the Payload CMS application
RUN yarn build:payload
RUN yarn generate:types
RUN ls -la /app/src
RUN cat /app/src/payload-types.ts
RUN yarn build:server

# Expose the port Payload runs on
EXPOSE 3000
