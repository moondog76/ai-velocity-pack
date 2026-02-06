#!/bin/sh
set -e

echo "=== Starting deployment script ==="

echo "=== Running Prisma migrations ==="
./node_modules/.bin/prisma db push --skip-generate

echo "=== Migrations complete ==="

echo "=== Checking server.js ==="
if [ -f server.js ]; then
  echo "server.js exists:"
  ls -la server.js
else
  echo "ERROR: server.js not found!"
  ls -la
  exit 1
fi

echo "=== Starting Next.js server ==="
echo "PORT=$PORT"
echo "HOSTNAME=$HOSTNAME"

exec node server.js
