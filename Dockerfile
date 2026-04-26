FROM node:22-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package files from the backend folder
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY backend/ .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
