# Dockerfile

# Use the official Node.js image as the base image
FROM node:22.5.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Copy the .env file
COPY .env ./

# Expose the port your application runs on
EXPOSE 3009

# Command to run your application
CMD ["npm", "start"]