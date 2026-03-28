#!/bin/bash

echo "=================================="
echo "TMS - Transportation Management System"
echo "=================================="
echo ""

# Check if Docker is installed
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "Uruchamianie za pomocą Docker Compose..."
    echo ""
    docker-compose up -d
    echo ""
    echo "=================================="
    echo "Aplikacja została uruchomiona!"
    echo "=================================="
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8080/api"
    echo ""
    echo "Domyślne dane logowania:"
    echo "  Username: dispatcher"
    echo "  Password: dispatcher"
    echo ""
    echo "Aby zatrzymać aplikację, uruchom: docker-compose down"
    echo ""
else
    echo "Docker nie jest zainstalowany. Uruchamianie w trybie manualnym..."
    echo ""
    echo "Upewnij się, że PostgreSQL jest uruchomiony i baza danych 'tms_db' istnieje."
    echo ""
    
    # Start backend
    echo "Uruchamianie backendu..."
    cd backend
    ./mvnw spring-boot:run &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    echo "Uruchamianie frontendu..."
    cd frontend
    npm install
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo "=================================="
    echo "Aplikacja została uruchomiona!"
    echo "=================================="
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8080/api"
    echo ""
    echo "Aby zatrzymać aplikację, naciśnij Ctrl+C"
    echo ""
    
    # Wait for processes
    wait $BACKEND_PID
    wait $FRONTEND_PID
fi
