cd client
npm run build
sudo cp -r /root/msaconnect/client/build/* /var/www/ilmapp/
cd ..
pm2 restart ecosystem.config.js
sudo systemctl restart nginx