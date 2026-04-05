#!/bin/bash

# IaC Simulator - Smoke Test
# Verifies that all Docker Compose services are running and accessible

echo "========================================"
echo "IaC Simulator - Smoke Test"
echo "========================================"
echo ""

# Test Nginx
echo "Testing Nginx..."
RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:8081)

if [ "$RESPONSE" = "200" ]; then
    echo "Nginx is running (HTTP $RESPONSE)"
else
    echo "Nginx failed (HTTP $RESPONSE)"
    exit 1
fi

# Test PostgreSQL
echo "Testing PostgreSQL..."
if nc -z -w2 localhost 5432 2>/dev/null; then
    echo "PostgreSQL is accessible"
else
    echo "PostgreSQL is not responding"
    exit 1
fi

# Test Redis
echo "Testing Redis..."
if nc -z -w2 localhost 6379 2>/dev/null; then
    echo "Redis is accessible"
else
    echo "Redis is not responding"
    exit 1
fi

echo ""
echo "========================================"
echo "All services are running!"
echo "========================================"

