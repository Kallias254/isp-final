# Use a Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Debugging step: List contents of /app and /app/src
RUN ls -la /app
RUN ls -la /app/src

# Build the Payload CMS application
RUN yarn build

# Expose the port Payload runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "serve"]