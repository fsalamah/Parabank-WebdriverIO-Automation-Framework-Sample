
# Base image for Node.js environment
FROM node:20.13.1-alpine3.20

# Update package index and install Python3 with pip
RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake


# Set working directory in the container
WORKDIR /usr/app

# Copy project files from current directory
COPY ./ .

# Install dependencies
RUN npm install

# Clean up the npm cache to reduce image size
RUN npm cache clean --force

# Specify the command to run the application, if applicable
 CMD ["npx", "wdio","wdio.conf.ts" ]
