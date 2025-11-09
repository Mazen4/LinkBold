# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose app port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
