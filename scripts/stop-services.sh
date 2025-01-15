#!/bin/bash
echo "Stopping existing Docker services..."
cd /home/ec2-user/mindflix
if [ -f docker-compose.yml ]; then
  docker-compose down
else
  echo "No docker-compose.yml found in deployment directory!"
fi
