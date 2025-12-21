#!/bin/bash
set -e

git pull origin main

if docker ps -a --format '{{.Names}}' | grep -q '^frontend-workify$'; then
  docker system prune -f

  docker stop frontend_workify_frontend_1

  docker rm frontend_workify_frontend_1

  docker rmi frontend-workify:latest
else
  echo "Container frontend-workify does not exist, skip stop/remove"
fi

docker compose up -d --build
