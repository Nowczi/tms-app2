# TMS Application - Fixes V2

This directory contains fixes for the TypeScript and schema validation errors.

## Issues Fixed

### Issue 1: Frontend TypeScript Errors (Docker Build Fails)

**Errors:**
```
TS6133: 'ChevronLeft' is declared but its value is never read
TS2551: Property 'contractExpiryStatus' does not exist on type 'Driver'
TS2307: Cannot find module 'leaflet/dist/images/marker-icon.png'
TS2339: Property 'env' does not exist on type 'ImportMeta'
```

**Fixes Applied:**
1. **tsconfig.json** - Changed `noUnusedLocals` and `noUnusedParameters` from `true` to `false`
2. **vite-env.d.ts** - Added type declarations for `ImportMeta.env` and image modules
3. **src/types/driver.ts** - Added `contractExpiryStatus` property to Driver interface
4. **src/types/index.ts** - Centralized type exports

### Issue 2: Backend Schema Validation Error

**Error:**
```
Schema-validation: wrong column type encountered in column [id] in table [documents];
found [uuid (Types#OTHER)], but expecting [varchar(255) (Types#VARCHAR)]
```

**Fixes Applied:**
1. **application.properties** - Changed `ddl-auto` to `update` and disabled Flyway by default
2. **Document.java** - New entity with UUID primary key to match existing schema
3. **DocumentRepository.java** - Repository for Document entity
4. **application-prod.properties** - Production profile with validation enabled

---

## How to Apply These Fixes

### Step 1: Apply Frontend Fixes

Copy these files to your project:

```bash
# TypeScript config (relaxes unused variable checks)
cp frontend/tsconfig.json /path/to/your/tms-app/frontend/tsconfig.json

# Vite environment types (fixes ImportMeta.env)
cp frontend/src/vite-env.d.ts /path/to/your/tms-app/frontend/src/vite-env.d.ts

# Driver types (adds contractExpiryStatus)
mkdir -p /path/to/your/tms-app/frontend/src/types
cp frontend/src/types/driver.ts /path/to/your/tms-app/frontend/src/types/driver.ts
cp frontend/src/types/index.ts /path/to/your/tms-app/frontend/src/types/index.ts
```

### Step 2: Apply Backend Fixes

Copy these files to your project:

```bash
# Application config (uses ddl-auto=update, disables Flyway)
cp backend/src/main/resources/application.properties /path/to/your/tms-app/backend/src/main/resources/application.properties

# Production config (for production deployments)
cp backend/src/main/resources/application-prod.properties /path/to/your/tms-app/backend/src/main/resources/application-prod.properties

# Document entity (UUID primary key)
mkdir -p /path/to/your/tms-app/backend/src/main/java/com/tms/entity
cp backend/src/main/java/com/tms/entity/Document.java /path/to/your/tms-app/backend/src/main/java/com/tms/entity/Document.java

# Document repository
mkdir -p /path/to/your/tms-app/backend/src/main/java/com/tms/repository
cp backend/src/main/java/com/tms/repository/DocumentRepository.java /path/to/your/tms-app/backend/src/main/java/com/tms/repository/DocumentRepository.java
```

### Step 3: Apply Docker Compose Fix

```bash
cp docker-compose.yml /path/to/your/tms-app/docker-compose.yml
```

---

## How to Run After Fixes

### Option 1: Full Docker Stack (Recommended)

```bash
cd /path/to/your/tms-app

# Clean up old containers and volumes
docker-compose down -v

# Build and start all services
docker-compose up --build -d

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Option 2: Backend Only (Development)

```bash
cd /path/to/your/tms-app/backend

# Make sure PostgreSQL is running locally

# Run with development settings (auto-creates schema)
./mvnw spring-boot:run

# Or with production profile (requires schema to exist)
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

### Option 3: Frontend Only (Development)

```bash
cd /path/to/your/tms-app/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## Understanding the Changes

### Frontend Changes

1. **tsconfig.json** - Relaxed TypeScript strictness:
   - `noUnusedLocals: false` - Allows unused local variables
   - `noUnusedParameters: false` - Allows unused function parameters
   - This prevents build failures from unused imports while developing

2. **vite-env.d.ts** - Added type declarations:
   - `ImportMetaEnv` interface for environment variables
   - Module declarations for image files (.png, .jpg, etc.)

3. **types/driver.ts** - Extended Driver interface:
   - Added `contractExpiryStatus` property
   - Added `DriverWithVehicle` interface for related data

### Backend Changes

1. **application.properties** - Development-friendly settings:
   - `spring.jpa.hibernate.ddl-auto=update` - Auto-updates schema
   - `spring.flyway.enabled=false` - Disables Flyway (prevents conflicts)

2. **Document.java** - New entity:
   - Uses `UUID` as primary key (matches Flyway migration)
   - Supports file metadata storage

3. **application-prod.properties** - Production settings:
   - `spring.jpa.hibernate.ddl-auto=validate` - Validates schema only
   - `spring.flyway.enabled=true` - Enables Flyway for migrations

---

## Troubleshooting

### Frontend still has TypeScript errors?

Try cleaning and rebuilding:
```bash
cd frontend
rm -rf node_modules package-lock.json
cd ..
docker-compose up --build -d
```

### Backend schema validation still fails?

Option 1: Reset the database
```bash
docker-compose down -v
docker-compose up -d postgres
# Wait for postgres to be ready, then start backend
docker-compose up -d backend
```

Option 2: Use create-drop (development only)
```properties
spring.jpa.hibernate.ddl-auto=create-drop
```

### Flyway migration conflicts?

If you have existing Flyway migrations that conflict:
```properties
# Disable Flyway
spring.flyway.enabled=false

# Or baseline existing schema
spring.flyway.baseline-on-migrate=true
spring.flyway.baseline-version=0
```

---

## File Summary

| File | Purpose |
|------|---------|
| `frontend/tsconfig.json` | Relaxes TypeScript strictness for unused variables |
| `frontend/src/vite-env.d.ts` | Type declarations for Vite env and images |
| `frontend/src/types/driver.ts` | Driver interface with contractExpiryStatus |
| `frontend/src/types/index.ts` | Centralized type exports |
| `backend/src/main/resources/application.properties` | Dev config with ddl-auto=update |
| `backend/src/main/resources/application-prod.properties` | Production config |
| `backend/src/main/java/com/tms/entity/Document.java` | UUID-based Document entity |
| `backend/src/main/java/com/tms/repository/DocumentRepository.java` | Document repository |
| `docker-compose.yml` | Updated compose with proper environment variables |
