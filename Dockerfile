# Use the official Node.js 14.17.1 image from Docker Hub
FROM node:14.17.1

# Create a new directory for the application
RUN mkdir -p /app

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the new working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose port 8000 (or the port your app runs on)
EXPOSE 8000

# Start the application
CMD [ "npm", "start" ]