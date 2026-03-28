# TMS - Transportation Management System - Podsumowanie projektu

## Wprowadzenie

TMS (Transportation Management System) to kompletna aplikacja do zarządzania transportem dla dystrybutorów regionalnych posiadających flotę 10-50 samochodów.

## Architektura

### Backend (Java Spring Boot)
- **Framework**: Spring Boot 3.2.0
- **Język**: Java 17
- **Baza danych**: PostgreSQL 16
- **Bezpieczeństwo**: JWT (JSON Web Tokens)
- **Build**: Maven

### Frontend (React)
- **Framework**: React 18 + TypeScript
- **Build tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Mapy**: Leaflet + React-Leaflet
- **Wykresy**: Recharts

### Baza danych (PostgreSQL)
- 7 tabel: users, drivers, vehicles, orders, order_history, order_documents, gps_locations
- Przykładowe dane dla testów

## Funkcjonalności MVP

### 1. Dashboard
- 4 kafelki KPI (zlecenia dziś, w trasie, problemy, dostępni kierowcy)
- Alerty i ostrzeżenia (przeterminowane zlecenia, wygasające dokumenty)
- Obciążenie kierowców z paskami postępu
- Ostatnie 10 zleceń
- Statystyki tygodniowe z wykresem

### 2. Zlecenia
- Lista zleceń z filtrami (status, data, kierowca)
- Wyszukiwanie (numer, klient, adres)
- Formularz tworzenia/edycji (4 kroki)
- Szczegóły zlecenia z historią
- Zmiana statusu zlecenia
- Przypisywanie kierowców i pojazdów
- Statusy: NEW, PLANNED, IN_PROGRESS, DELIVERED, PROBLEM, CANCELLED

### 3. Planowanie
- Widok dzienny z kalendarzem
- Lista kierowców z przypisanymi zleceniami
- Nieprzypisane zlecenia do przydziału
- Mapa z lokalizacją kierowców (GPS)
- Sekcja konfliktów i ostrzeżeń

### 4. Kierowcy
- Baza danych kierowców
- Śledzenie ważności dokumentów (prawo jazdy, badania, umowy)
- Urlopy i dostępność
- Statystyki kierowców
- Kolorowanie dat (zielony/żółty/czerwony)

### 5. Pojazdy
- Baza danych pojazdów
- Śledzenie ważności dokumentów (OC, przegląd)
- Status pojazdu (dostępny, w trasie, serwis)
- Przypisanie kierowców
- Uwagi serwisowe

## Struktura projektu

```
tms-app/
├── backend/                 # Java Spring Boot (60 plików)
│   ├── src/main/java/com/tms/
│   │   ├── controller/      # 9 kontrolerów REST
│   │   ├── service/         # 7 serwisów
│   │   ├── repository/      # 7 repozytoriów
│   │   ├── entity/          # 7 encji JPA
│   │   ├── dto/             # 22 DTO
│   │   ├── security/        # JWT + Security
│   │   └── config/          # Konfiguracja
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                # React + TypeScript (25 plików)
│   ├── src/
│   │   ├── pages/           # 12 stron
│   │   ├── components/      # Layout
│   │   ├── services/        # API service
│   │   ├── stores/          # Auth store (Zustand)
│   │   └── types/           # TypeScript types
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── database/
│   └── schema.sql          # Schemat bazy + dane testowe
├── docker-compose.yml
├── start.sh                # Skrypt uruchamiający
└── README.md               # Dokumentacja
```

## API Endpoints

### Autentykacja
- `POST /api/auth/login`

### Dashboard
- `GET /api/dashboard`

### Zlecenia (7 endpointów)
- `GET /api/orders` - lista z filtrami
- `GET /api/orders/{id}` - szczegóły
- `POST /api/orders` - utwórz
- `PUT /api/orders/{id}` - aktualizuj
- `PATCH /api/orders/{id}/status` - zmień status
- `POST /api/orders/{id}/assign` - przypisz kierowcę
- `DELETE /api/orders/{id}` - usuń

### Kierowcy (5 endpointów)
- `GET /api/drivers` - lista
- `GET /api/drivers/{id}` - szczegóły
- `POST /api/drivers` - utwórz
- `PUT /api/drivers/{id}` - aktualizuj
- `DELETE /api/drivers/{id}` - usuń

### Pojazdy (5 endpointów)
- `GET /api/vehicles` - lista
- `GET /api/vehicles/{id}` - szczegóły
- `POST /api/vehicles` - utwórz
- `PUT /api/vehicles/{id}` - aktualizuj
- `DELETE /api/vehicles/{id}` - usuń

### Planowanie
- `GET /api/planning`

### GPS (3 endpointy)
- `GET /api/gps/drivers/{driverId}`
- `GET /api/gps/drivers/{driverId}/latest`
- `POST /api/gps/drivers/{driverId}`

## Uruchomienie

### Opcja 1: Docker Compose (zalecane)
```bash
cd tms-app
docker-compose up -d
```
Aplikacja dostępna pod:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api

### Opcja 2: Manualne
```bash
# Baza danych
psql -U postgres -f database/schema.sql

# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```

### Opcja 3: Skrypt startowy
```bash
./start.sh
```

## Dane logowania

- **Dispatcher**: username: `dispatcher`, password: `dispatcher`
- **Admin**: username: `admin`, password: `admin`

## Przykładowe dane

Baza zawiera przykładowe dane:
- 2 użytkowników (admin, dispatcher)
- 5 pojazdów (Volvo, Mercedes, Scania, MAN, DAF)
- 5 kierowców (różne statusy)
- 8 zleceń (różne statusy)
- Przykładowe lokalizacje GPS

## Technologie użyte

### Backend
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security + JWT
- PostgreSQL Driver
- Lombok
- MapStruct

### Frontend
- React 18
- TypeScript
- Material-UI v5
- React Router v6
- TanStack Query v5
- Zustand
- Axios
- Leaflet
- Recharts
- date-fns

### DevOps
- Docker
- Docker Compose
- Nginx (frontend)

## Bezpieczeństwo

- JWT authentication
- Password encoding (BCrypt)
- CORS configuration
- Role-based access (ADMIN, DISPATCHER, DRIVER)

## Walidacja

- Backend: Bean Validation (Jakarta)
- Frontend: Form validation w komponentach

## Testowanie

Przykładowe zapytanie API:
```bash
# Logowanie
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"dispatcher","password":"dispatcher"}'

# Pobierz dashboard
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8080/api/dashboard
```

## Rozszerzenia (poza MVP)

- PWA dla kierowców (statusy, GPS, POD)
- Import zleceń z Excel/CSV
- Powiadomienia SMS/email
- Link trackingowy dla klientów
- Optymalizacja tras (routing)
- Natywna aplikacja mobilna
- Rozliczanie diet i nadgodzin
- Moduł raportowania
- Integracja z ERP

## Autor

Projekt stworzony na podstawie specyfikacji TMS MVP.
