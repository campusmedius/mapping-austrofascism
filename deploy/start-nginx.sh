#!/bin/sh

# Replace the placeholder with the value of the SECRET environment variable
envsubst '$PHAIDRA_CREDENTIALS' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start Nginx
nginx -g 'daemon off;'