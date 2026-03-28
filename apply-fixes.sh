#!/bin/bash

# TMS Application Fix Script V2
# This script applies fixes for TypeScript and schema validation errors

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== TMS Application Fix Script V2 ===${NC}"
echo -e "${BLUE}Fixes TypeScript errors and schema validation issues${NC}"
echo ""

# Check if target directory is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: ./apply-fixes.sh /path/to/your/tms-app${NC}"
    echo ""
    echo "Example:"
    echo "  ./apply-fixes.sh ~/Downloads/tms-app"
    echo "  ./apply-fixes.sh /c/Users/User/Downloads/tms-app"
    echo ""
    exit 1
fi

TARGET_DIR="$1"

# Convert Windows path to Unix if needed (for Git Bash)
if [[ "$TARGET_DIR" =~ ^[A-Za-z]: ]]; then
    # Convert C:\path to /c/path
    TARGET_DIR="/$(echo "$TARGET_DIR" | sed 's/://; s/\\/\//g')"
fi

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${RED}Error: Directory $TARGET_DIR does not exist${NC}"
    exit 1
fi

# Check if it looks like a tms-app directory
if [ ! -d "$TARGET_DIR/backend" ] || [ ! -d "$TARGET_DIR/frontend" ]; then
    echo -e "${YELLOW}Warning: $TARGET_DIR doesn't look like a tms-app directory${NC}"
    echo "Expected to find 'backend' and 'frontend' subdirectories"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}Applying fixes to: $TARGET_DIR${NC}"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to backup file
backup_file() {
    if [ -f "$1" ]; then
        cp "$1" "$1.backup.$(date +%Y%m%d%H%M%S)"
        echo "  Backed up: $1"
    fi
}

# ============================================
# FRONTEND FIXES
# ============================================
echo -e "${YELLOW}=== Applying Frontend Fixes ===${NC}"

# Fix 1: tsconfig.json
if [ -f "$SCRIPT_DIR/frontend/tsconfig.json" ]; then
    backup_file "$TARGET_DIR/frontend/tsconfig.json"
    cp "$SCRIPT_DIR/frontend/tsconfig.json" "$TARGET_DIR/frontend/tsconfig.json"
    echo -e "${GREEN}  ✓ Fixed: tsconfig.json (relaxed unused variable checks)${NC}"
fi

# Fix 2: vite-env.d.ts
if [ -f "$SCRIPT_DIR/frontend/src/vite-env.d.ts" ]; then
    mkdir -p "$TARGET_DIR/frontend/src"
    cp "$SCRIPT_DIR/frontend/src/vite-env.d.ts" "$TARGET_DIR/frontend/src/vite-env.d.ts"
    echo -e "${GREEN}  ✓ Created: vite-env.d.ts (ImportMeta types)${NC}"
fi

# Fix 3: types directory
if [ -d "$SCRIPT_DIR/frontend/src/types" ]; then
    mkdir -p "$TARGET_DIR/frontend/src/types"
    cp "$SCRIPT_DIR/frontend/src/types/"*.ts "$TARGET_DIR/frontend/src/types/"
    echo -e "${GREEN}  ✓ Created: types/driver.ts and types/index.ts${NC}"
fi

echo ""

# ============================================
# BACKEND FIXES
# ============================================
echo -e "${YELLOW}=== Applying Backend Fixes ===${NC}"

# Fix 1: application.properties
if [ -f "$SCRIPT_DIR/backend/src/main/resources/application.properties" ]; then
    mkdir -p "$TARGET_DIR/backend/src/main/resources"
    backup_file "$TARGET_DIR/backend/src/main/resources/application.properties"
    cp "$SCRIPT_DIR/backend/src/main/resources/application.properties" "$TARGET_DIR/backend/src/main/resources/application.properties"
    echo -e "${GREEN}  ✓ Fixed: application.properties (ddl-auto=update, Flyway disabled)${NC}"
fi

# Fix 2: application-prod.properties
if [ -f "$SCRIPT_DIR/backend/src/main/resources/application-prod.properties" ]; then
    cp "$SCRIPT_DIR/backend/src/main/resources/application-prod.properties" "$TARGET_DIR/backend/src/main/resources/application-prod.properties"
    echo -e "${GREEN}  ✓ Created: application-prod.properties (production profile)${NC}"
fi

# Fix 3: Document entity
if [ -f "$SCRIPT_DIR/backend/src/main/java/com/tms/entity/Document.java" ]; then
    mkdir -p "$TARGET_DIR/backend/src/main/java/com/tms/entity"
    cp "$SCRIPT_DIR/backend/src/main/java/com/tms/entity/Document.java" "$TARGET_DIR/backend/src/main/java/com/tms/entity/Document.java"
    echo -e "${GREEN}  ✓ Created: Document.java (UUID-based entity)${NC}"
fi

# Fix 4: Document repository
if [ -f "$SCRIPT_DIR/backend/src/main/java/com/tms/repository/DocumentRepository.java" ]; then
    mkdir -p "$TARGET_DIR/backend/src/main/java/com/tms/repository"
    cp "$SCRIPT_DIR/backend/src/main/java/com/tms/repository/DocumentRepository.java" "$TARGET_DIR/backend/src/main/java/com/tms/repository/DocumentRepository.java"
    echo -e "${GREEN}  ✓ Created: DocumentRepository.java${NC}"
fi

echo ""

# ============================================
# DOCKER COMPOSE FIX
# ============================================
echo -e "${YELLOW}=== Applying Docker Compose Fix ===${NC}"

if [ -f "$SCRIPT_DIR/docker-compose.yml" ]; then
    backup_file "$TARGET_DIR/docker-compose.yml"
    cp "$SCRIPT_DIR/docker-compose.yml" "$TARGET_DIR/docker-compose.yml"
    echo -e "${GREEN}  ✓ Fixed: docker-compose.yml${NC}"
fi

echo ""
echo -e "${GREEN}=== All Fixes Applied Successfully! ===${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "1. For Docker Compose (full stack):"
echo -e "   ${YELLOW}cd $TARGET_DIR${NC}"
echo -e "   ${YELLOW}docker-compose down -v${NC}"
echo -e "   ${YELLOW}docker-compose up --build -d${NC}"
echo ""
echo "2. For standalone backend (development):"
echo -e "   ${YELLOW}cd $TARGET_DIR/backend${NC}"
echo -e "   ${YELLOW}./mvnw spring-boot:run${NC}"
echo ""
echo "3. For standalone frontend (development):"
echo -e "   ${YELLOW}cd $TARGET_DIR/frontend${NC}"
echo -e "   ${YELLOW}npm install${NC}"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo -e "Read the full documentation: ${YELLOW}cat $SCRIPT_DIR/README-FIXES-V2.md${NC}"
echo ""
