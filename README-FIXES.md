# TMS Application - Fixed Files

This directory contains fixed files for the TMS (Transportation Management System) application.

## Issues Fixed

### Issue 1: Docker Compose Build Problems
**Problem:** The `version: '3.8'` attribute in docker-compose.yml is obsolete and causes warnings. Additionally, the healthcheck timing could cause issues with database initialization.

**Fix:**
- Removed obsolete `version` attribute
- Improved healthcheck configuration with longer start period and more retries
- Added explicit `SPRING_JPA_HIBERNATE_DDL_AUTO: validate` for backend

### Issue 2: Backend Standalone Mode Fails
**Problem:** When running the backend alone (outside Docker), it fails with error:
```
ERROR: column u1_0.username does not exist
```

**Cause:** The `application.properties` has `spring.jpa.hibernate.ddl-auto=none`, which means Hibernate won't create/update the database schema. When running standalone without the Docker initialization scripts, the database tables don't exist.

**Fix:**
- Created `application-dev.properties` with `spring.jpa.hibernate.ddl-auto=update` for development
- Kept `application.properties` with `ddl-auto=validate` for production (with existing schema)

---

## How to Use These Fixed Files

### Option 1: Using Docker Compose (Recommended for Production)

1. Replace the `docker-compose.yml` in your project root with the fixed version:
   ```bash
   cp docker-compose.yml /path/to/your/tms-app/docker-compose.yml
   ```

2. Make sure your `database/schema.sql` exists (it should already be in your project)

3. Run Docker Compose:
   ```bash
   docker-compose down -v  # Remove old volumes if needed
   docker-compose up --build -d
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Option 2: Running Backend Standalone (For Development)

#### Method A: Using Dev Profile (Easiest - Auto-creates schema)

1. Replace the `application.properties` in your backend:
   ```bash
   cp backend/src/main/resources/application.properties /path/to/your/tms-app/backend/src/main/resources/
   cp backend/src/main/resources/application-dev.properties /path/to/your/tms-app/backend/src/main/resources/
   ```

2. Start PostgreSQL locally (make sure it's running on port 5432)

3. Create the database:
   ```bash
   createdb tms_db
   ```

4. Run the backend with the dev profile:
   ```bash
   cd /path/to/your/tms-app/backend
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```
   
   Or in IntelliJ IDEA:
   - Go to Run Configurations
   - Add VM option: `-Dspring.profiles.active=dev`

#### Method B: Using Production Profile (With Manual Schema)

1. Make sure PostgreSQL is running locally

2. Create the database and run the schema manually:
   ```bash
   createdb tms_db
   psql -d tms_db -f database/schema.sql
   ```

3. Run the backend without profile (uses default `validate` mode):
   ```bash
   cd /path/to/your/tms-app/backend
   ./mvnw spring-boot:run
   ```

### Option 3: Running Full Stack in Docker (Development)

If you want to run everything in Docker but with auto-schema creation for development:

1. Update the `docker-compose.yml` to use `update` instead of `validate`:
   ```yaml
   backend:
     environment:
       SPRING_JPA_HIBERNATE_DDL_AUTO: update
   ```

2. Run:
   ```bash
   docker-compose up --build -d
   ```

---

## File Locations Summary

### Files to Replace in Your Project

| Fixed File | Replace This File in Your Project |
|------------|-----------------------------------|
| `docker-compose.yml` | `/your-project/docker-compose.yml` |
| `backend/src/main/resources/application.properties` | `/your-project/backend/src/main/resources/application.properties` |
| `backend/src/main/resources/application-dev.properties` | `/your-project/backend/src/main/resources/application-dev.properties` (new file) |

---

## Troubleshooting

### Problem: "column does not exist" error
**Solution:** Use the dev profile (`-Dspring.profiles.active=dev`) or manually run the schema.sql file

### Problem: Docker build takes too long
**Solution:** This is normal for the first build. Maven downloads dependencies. Subsequent builds will be faster.

### Problem: "Connection refused" to PostgreSQL
**Solution:** 
- For Docker: Make sure the `postgres` service is healthy before backend starts
- For standalone: Make sure PostgreSQL is running on localhost:5432

### Problem: JWT secret too short error
**Solution:** The JWT secret in the fixed files is already set to a proper length (32+ characters)

---

## Quick Start Commands

### Full Docker Stack
```bash
docker-compose down -v
docker-compose up --build -d
docker-compose logs -f backend
```

### Backend Only (Dev Mode)
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend Only
```bash
cd frontend
npm install
npm run dev
```
