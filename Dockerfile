# Use a lightweight nginx image
FROM nginx:alpine

# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy frontend files into the Nginx container
COPY . /usr/share/nginx/html

# Expose the port used by Nginx
EXPOSE 80
