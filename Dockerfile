# Imagen base
FROM node:20.11.1

# Absolute path
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm i --legacy-peer-deps

# Bundle app source
COPY . .

# Copy the .env and .env.development files
COPY .env .env.sample ./

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Start sever using the production build
CMD ["npm", "run", "start:prod"]
