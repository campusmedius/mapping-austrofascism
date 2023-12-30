# Stage 1: Build the application
FROM node:14 AS build-stage

WORKDIR /app

# Copy package.json
COPY package.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . /app/

# Build the application
RUN npm run build:ssr

# Stage 2: Run the application
FROM node:14

WORKDIR /app

# Copy built assets and necessary files from build-stage
COPY --from=build-stage /app/dist ./dist

# Expose the port on which your app runs
EXPOSE 4000

# Command to run your application
CMD ["node", "./dist/campusmedius/server/main.js"]
