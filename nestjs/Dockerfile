# Set the base image to use for subsequent instructions
FROM node:19-alpine3.16

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port that the application will listen on
EXPOSE 5050

# Start the application
CMD ["npm", "start"]