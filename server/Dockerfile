# Use an official Node.js runtime as the base image
FROM node:18-alpine3.17

# Set the working directory in the container
WORKDIR /server

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the server application code to the container
COPY . .

# Expose the port on which the server app will run
EXPOSE 3000

# Define the command to start the server app
CMD ["npm", "run", "dev"]
