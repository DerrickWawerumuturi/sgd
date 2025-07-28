FROM node:18-bullseye

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install -g nodemon && npm install

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 4000

# Use nodemon for hot reload
CMD ["nodemon", "server.js"]
