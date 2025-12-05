# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5001

# Start the server
CMD ["npm", "start"]
