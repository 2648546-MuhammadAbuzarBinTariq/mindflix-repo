#!/bin/bash
echo "Starting services..."
docker-compose -f /home/ec2-user/mindflix/docker-compose.yml up -d
