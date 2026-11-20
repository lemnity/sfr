#!/bin/sh
# One-time server setup for safaroff.agency: nginx virtual host + Let's Encrypt HTTPS.
# Safe to re-run. Touches only this site's vhost and leaves other sites on the server alone.
# Usage: sh scripts/setup-server.sh            (needs ssh access to $DEPLOY_HOST; DNS must already point here)
set -eu

DEPLOY_HOST="${DEPLOY_HOST:-root@82.146.52.154}"
# The server (FirstVDS, ISPmanager installed but unused) accepts key auth only.
DEPLOY_SSH_KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/prostyle_deploy}"
DOMAIN="${DOMAIN:-safaroff.agency}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/$DOMAIN}"
CERT_EMAIL="${CERT_EMAIL:-safarovshow@yandex.ru}"

ssh -o IdentitiesOnly=yes -i "$DEPLOY_SSH_KEY" "$DEPLOY_HOST" "DOMAIN='$DOMAIN' DEPLOY_DIR='$DEPLOY_DIR' CERT_EMAIL='$CERT_EMAIL' sh -s" <<'REMOTE'
set -eu
export DEBIAN_FRONTEND=noninteractive

if ! command -v nginx >/dev/null 2>&1 || ! command -v certbot >/dev/null 2>&1 || ! dpkg -s python3-certbot-nginx >/dev/null 2>&1; then
  apt-get update -q
  apt-get install -y -q nginx certbot python3-certbot-nginx
fi
# nginx ships disabled on this box; start it now and on every boot.
systemctl enable --now nginx

mkdir -p "$DEPLOY_DIR"
[ -f "$DEPLOY_DIR/index.html" ] || echo '<!doctype html><title>SAFAROFF</title>' > "$DEPLOY_DIR/index.html"
chown -R www-data:www-data "$DEPLOY_DIR"

VHOST="/etc/nginx/sites-available/$DOMAIN"
cat > "$VHOST" <<NGINX
# $DOMAIN — static Vite build uploaded by scripts/deploy.sh
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    root $DEPLOY_DIR;
    index index.html;

    # Hashed build assets never change: cache them for a year.
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    location ~* \.(?:woff2|webp|png|jpe?g|svg|ico)\$ {
        expires 30d;
        add_header Cache-Control "public";
        try_files \$uri =404;
    }

    # Case pages are real folders (cases/<slug>/index.html); anything unknown falls back to the app.
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml text/plain;
}
NGINX
ln -sf "$VHOST" "/etc/nginx/sites-enabled/$DOMAIN"
nginx -t
systemctl reload nginx

# HTTPS for both names; certbot edits only this vhost and adds the HTTP→HTTPS redirect.
certbot --nginx --non-interactive --agree-tos --redirect -m "$CERT_EMAIL" -d "$DOMAIN" -d "www.$DOMAIN"
systemctl reload nginx
echo "nginx + HTTPS ready for $DOMAIN"
REMOTE
