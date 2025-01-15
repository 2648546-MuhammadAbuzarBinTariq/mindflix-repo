#!/bin/bash
echo "Starting Docker services..."
cd /home/ec2-user/mindflix
docker-compose up -d --build
