FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript ts-node

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build || tsc

# Expose port 3000
EXPOSE 3000

# Set user permissions
RUN chown -R node:node /app
USER node

# Start the application using the compiled JavaScript
CMD ["node", "build/index.js"]
