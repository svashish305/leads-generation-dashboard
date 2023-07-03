# Use an official Node.js runtime as the base image
FROM node:18-alpine3.17

# Set the working directory in the container
WORKDIR /client

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the client application code to the container
COPY . .

# Expose the port on which the React app will run
EXPOSE 5173

# Define the command to start the React app
CMD ["npm", "run", "dev", "--", "--host"]
