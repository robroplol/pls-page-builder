#!/bin/bash

# Fix nginx root to point to Laravel public folder
sed -i 's|root /home/site/wwwroot;|root /home/site/wwwroot/public;|g' /etc/nginx/sites-available/default
sed -i 's|index  index.php index.html index.htm hostingstart.html;|index  index.php index.html index.htm;|g' /etc/nginx/sites-available/default
sed -i 's|index  index.php index.html index.htm;|index  index.php index.html index.htm;\n    try_files $uri $uri/ /index.php?$query_string;|g' /etc/nginx/sites-available/default

# Fix storage permissions
chmod -R 775 /home/site/wwwroot/storage
chmod -R 775 /home/site/wwwroot/bootstrap/cache

# Reload nginx
nginx -s reload