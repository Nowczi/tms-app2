# TMS - Transportation Management System

System zarządzania transportem dla dystrybutorów regionalnych. Aplikacja składa się z backendu (Java Spring Boot), frontendu (React) i bazy danych PostgreSQL.

## Funkcjonalności

### Dashboard
- KPI dnia (zlecenia, kierowcy w trasie, problemy, dostępni kierowcy)
- Alerty i ostrzeżenia (przeterminowane zlecenia, wygasające dokumenty)
- Obciążenie kierowców
- Ostatnie zlecenia
- Statystyki tygodniowe/miesięczne

### Zlecenia
- Lista zleceń z filtrami i wyszukiwaniem
- Tworzenie i edycja zleceń
- Zarządzanie statusami (Nowe → Zaplanowane → W trakcie → Dostarczone/Problem)
- Historia zmian statusów
- Przypisywanie kierowców i pojazdów

### Planowanie
- Widok dzienny z kalendarzem
- Lista kierowców z przypisanymi zleceniami
- Mapa z lokalizacją kierowców (GPS)
- Nieprzypisane zlecenia do przydziału
- Sekcja konfliktów i ostrzeżeń

### Kierowcy
- Baza danych kierowców
- Śledzenie ważności dokumentów (prawo jazdy, badania, umowy)
- Urlopy i dostępność
- Statystyki kierowców

### Pojazdy
- Baza danych pojazdów
- Śledzenie ważności dokumentów (OC, przegląd)
- Status pojazdu (dostępny, w trasie, serwis)
- Przypisanie kierowców

## Wymagania

- Java 17+
- Node.js 20+
- PostgreSQL 16+
- Docker i Docker Compose (opcjonalnie)

## Uruchomienie za pomocą Docker Compose (zalecane)

Najprostszym sposobem uruchomienia aplikacji jest użycie Docker Compose:

```bash
# Sklonuj repozytorium
cd tms-app

# Uruchom wszystkie usługi
docker-compose up -d

# Aplikacja będzie dostępna pod adresami:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8080/api
# - Baza danych: localhost:5432
```

Aby zatrzymać aplikację:
```bash
docker-compose down
```

Aby zatrzymać i usunąć wszystkie dane:
```bash
docker-compose down -v
```

## Uruchomienie manualne (deweloperskie)

### 1. Baza danych PostgreSQL

```bash
# Zainstaluj PostgreSQL i utwórz bazę danych
createdb tms_db

# Opcjonalnie: załaduj przykładowe dane
psql -U postgres -d tms_db -f database/schema.sql
```

### 2. Backend (Java Spring Boot)

```bash
cd backend

# Skompiluj i uruchom
./mvnw clean install
./mvnw spring-boot:run

# Backend będzie dostępny pod adresem: http://localhost:8080
```

Domyślne dane logowania do API:
- Username: `dispatcher`
- Password: `dispatcher`

Lub administrator:
- Username: `admin`
- Password: `admin`

### 3. Frontend (React)

```bash
cd frontend

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev

# Frontend będzie dostępny pod adresem: http://localhost:3000
```

## Konfiguracja

### Backend

Plik konfiguracyjny: `backend/src/main/resources/application.properties`

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/tms_db
spring.datasource.username=postgres
spring.datasource.password=postgres

# JWT
jwt.secret=mySecretKey123456789012345678901234567890
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

### Frontend

Plik konfiguracyjny: `frontend/vite.config.ts`

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

## API Endpoints

### Autentykacja
- `POST /api/auth/login` - Logowanie

### Dashboard
- `GET /api/dashboard` - Dane dashboardu

### Zlecenia
- `GET /api/orders` - Lista zleceń
- `GET /api/orders/{id}` - Szczegóły zlecenia
- `POST /api/orders` - Utwórz zlecenie
- `PUT /api/orders/{id}` - Aktualizuj zlecenie
- `PATCH /api/orders/{id}/status` - Zmień status
- `POST /api/orders/{id}/assign` - Przypisz kierowcę
- `DELETE /api/orders/{id}` - Usuń zlecenie

### Kierowcy
- `GET /api/drivers` - Lista kierowców
- `GET /api/drivers/{id}` - Szczegóły kierowcy
- `POST /api/drivers` - Utwórz kierowcę
- `PUT /api/drivers/{id}` - Aktualizuj kierowcę
- `DELETE /api/drivers/{id}` - Usuń kierowcę

### Pojazdy
- `GET /api/vehicles` - Lista pojazdów
- `GET /api/vehicles/{id}` - Szczegóły pojazdu
- `POST /api/vehicles` - Utwórz pojazd
- `PUT /api/vehicles/{id}` - Aktualizuj pojazd
- `DELETE /api/vehicles/{id}` - Usuń pojazd

### Planowanie
- `GET /api/planning` - Dane planowania

### GPS
- `GET /api/gps/drivers/{driverId}` - Lokalizacje kierowcy
- `POST /api/gps/drivers/{driverId}` - Zapisz lokalizację

## Struktura projektu

```
tms-app/
├── backend/                 # Java Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/tms/
│   │   │   │   ├── controller/    # REST API controllers
│   │   │   │   ├── service/       # Business logic
│   │   │   │   ├── repository/    # JPA repositories
│   │   │   │   ├── entity/        # JPA entities
│   │   │   │   ├── dto/           # Data transfer objects
│   │   │   │   ├── security/      # JWT & Security
│   │   │   │   └── config/        # Configuration
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                # React + TypeScript
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── stores/          # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utilities
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── database/
│   └── schema.sql          # Database schema
├── docker-compose.yml
└── README.md
```

## Statusy zleceń

| Status | Kolor | Znaczenie |
|--------|-------|-----------|
| NEW | Szary | Zlecenie dodane, nieprzypisane |
| PLANNED | Niebieski | Przypisano kierowcę |
| IN_PROGRESS | Żółty | Kierowca w drodze |
| DELIVERED | Zielony | Potwierdzono dostawę |
| PROBLEM | Czerwony | Zgłoszono problem |
| CANCELLED | Szary | Zlecenie anulowane |

## Alerty

System generuje alerty dla:
- Zleceń przeterminowanych (brak zmiany statusu od 2+ godzin)
- Wygasających dokumentów kierowców (prawo jazdy, badania, umowy)
- Wygasających dokumentów pojazdów (OC, przegląd)
- Kierowców na urlopie

Kolory alertów:
- **Zielony** - >30 dni do wygaśnięcia
- **Żółty** - 14-30 dni do wygaśnięcia
- **Czerwony** - <14 dni lub przeterminowane

## Licencja

Projekt stworzony na potrzeby demonstracyjne.
