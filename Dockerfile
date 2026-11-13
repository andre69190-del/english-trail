# English Trail — statische App im Container (für Coolify / Docker), übernommen aus GeoQuest.
# Coolify-Proxy (Traefik) routet z. B. english.arndt-software.de -> diesen Container:80 und macht HTTPS.
FROM nginx:alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/nginx-container.conf /etc/nginx/conf.d/english.conf
WORKDIR /usr/share/nginx/html
COPY index.html data-szlak.json data-school-*.json impressum.html datenschutz.html englisch-gymnasium-bw.html englisch-realschule-bw.html englisch-gymnasium-nrw.html englisch-gymnasium-bayern.html englisch-klasse-*.html sw.js manifest.json icon.svg icon-192.png icon-512.png icon-maskable-512.png apple-touch-icon.png robots.txt sitemap.xml ./
COPY fonts ./fonts
COPY ocr ./ocr
EXPOSE 80
