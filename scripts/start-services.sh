#!/bin/bash
echo "Starting Docker services..."
cd /home/ec2-user/mindflix
if [ -f docker-compose.yml ]; then
  docker-compose up -d
else
  echo "No docker-compose.yml found in deployment directory!"
fi
