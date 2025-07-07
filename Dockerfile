# Use official Node.js LTS version as the base image
FROM node:18

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose the port your app runs on (change if needed)
EXPOSE 4000

# Command to run your app
CMD ["npm", "run" , "start"]
