# English Trail — statische App im Container (für Coolify / Docker), übernommen aus GeoQuest.
# Coolify-Proxy (Traefik) routet z. B. english.arndt-software.de -> diesen Container:80 und macht HTTPS.
FROM nginx:alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/nginx-container.conf /etc/nginx/conf.d/english.conf
WORKDIR /usr/share/nginx/html
COPY index.html impressum.html datenschutz.html sw.js manifest.json icon.svg icon-192.png icon-512.png icon-maskable-512.png apple-touch-icon.png robots.txt sitemap.xml ./
COPY fonts ./fonts
EXPOSE 80
