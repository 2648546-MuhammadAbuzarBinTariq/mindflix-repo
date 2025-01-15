#!/bin/bash
echo "Stopping services..."
docker-compose -f /home/ec2-user/mindflix/docker-compose.yml down
