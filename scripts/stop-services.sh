#!/bin/bash
echo "Stopping existing Docker services..."
cd /home/ec2-user/mindflix
docker-compose down || true
