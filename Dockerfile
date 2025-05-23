# For linux systems (Ubuntu vs.), first build with ng build
FROM nginx:1.28.0-alpine

COPY /docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY /dist/seacotools-lib/browser /usr/share/nginx/html

EXPOSE 80



## For non linux systems (Mac)
## Stage 1: Build the Angular application
## Use a specific Node.js version, Node 16 in this case
#FROM node:20.13.0 as build
## Set the working directory inside the Docker container
#WORKDIR /app
## Copy package.json and package-lock.json to the working directory
#COPY package.json package-lock.json ./
## Install all dependencies
#RUN npm ci
## Copy the rest of the Angular app to the Docker container
#COPY . .
#
## Build the Angular app for production with optimization
#RUN npm run build --omit=dev
## Stage 2: Serve the app with Nginx
#FROM nginx:1.25.4-alpine
## Copy custom Nginx configuration
#COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
## Copy the built Angular app from the 'build' stage to Nginx's serve directory
#COPY --from=build /app/dist/seacollect-angular /usr/share/nginx/html
## Expose port 80 to be accessible from the outside
#EXPOSE 80

