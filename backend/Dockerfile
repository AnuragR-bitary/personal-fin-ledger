FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Bind serverless-offline to 0.0.0.0 so it is accessible from outside the container
CMD ["npx", "serverless", "offline", "start", "--host", "0.0.0.0"]
