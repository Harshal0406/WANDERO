# WANDERO — Discover places. Find your stay.

**WANDERO** is a production-quality, modern hotel discovery, comparison and booking platform that makes finding and reserving the perfect stay simple. Built using **Java 21**, **Spring Boot 3**, **React 18 with Vite**, and **MySQL**, it features concurrency-safe room reservations, real-time availability checking, transparent price and tax calculations, self-service booking retrieval and cancellation, and a powerful **Side-by-Side Hotel Comparison** engine.

---

## 🌟 Platform Highlights

1. **Curated Luxury & Boutique Stays**: Explore hand-picked stays across premier destinations with verified high-resolution imagery, guest ratings, complete amenities list, descriptions, and starting rates.
2. **Search by Destination & Dates**: Search stays by city, property name, or region. Filter by check-in and check-out dates to only display properties with verified room availability.
3. **Real-Time Room Inventory**: View specific room suites and villas with guest capacities, square footage, bed configurations, and date-specific availability.
4. **Transparent Pricing & Tax Breakdown**: Instantaneous calculation of stay nights, base nightly tariff, 12% statutory hospitality tax, and total booking amount.
5. **Safe Transactional Booking Flow**: Database-level pessimistic write locking (`SELECT ... FOR UPDATE`) and overlapping date interval queries prevent race conditions and overbooking under concurrent loads.
6. **Unique WANDERO References**: Automatically generates unique, human-readable booking references formatted as `WD-XXXXXX` (e.g., `WD-8TWP5C`).
7. **Self-Service Booking Management**: Guests can look up their reservation using their reference code and email address, or view all past and upcoming stays.
8. **Instant Cancellation & Room Release**: Cancel confirmed bookings in one click; room availability is immediately restored for new guests.
9. **Surprise Feature – Hotel Comparison Engine**: Compare up to **three** hotels side-by-side across guest ratings, starting tariffs, total stay cost for selected dates, room types, and a comprehensive amenities matrix.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 21, Spring Boot 3.2.5, Spring Data JPA / Hibernate, Maven 3.9.9 |
| **Frontend** | React 18, Vite 5.4, Axios, Lucide React icons, Responsive CSS3 Design Tokens |
| **Database** | MySQL 8.x / MariaDB (via XAMPP or standalone service) |
| **Testing** | JUnit 5 Jupiter, Mockito, AssertJ, H2 (test profile) |
| **Concurrency Safeguards** | Pessimistic Write Locking (`LockModeType.PESSIMISTIC_WRITE`), Repeatable Read Transactions |

---

## 📂 Project Structure

```
stayease/
├── backend/                              # Spring Boot Application
│   ├── pom.xml                           # Maven dependencies and build configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/stayease/
│       │   │   ├── config/               # CorsConfig, DatabaseDataInitializer
│       │   │   ├── controller/           # HotelController, RoomController, BookingController
│       │   │   ├── dto/                  # DTOs (HotelSummary, RoomDTO, BookingRequest/Response, etc.)
│       │   │   ├── entity/               # JPA Entities: Hotel, Room, Booking, BookingStatus
│       │   │   ├── exception/            # GlobalExceptionHandler, Custom Exceptions
│       │   │   ├── repository/           # HotelRepository, RoomRepository, BookingRepository
│       │   │   ├── service/              # HotelService, RoomService, BookingService & Impls
│       │   │   └── StayEaseApplication.java
│       │   └── resources/
│       │       └── application.properties# Config with environment variable support
│       └── test/
│           ├── java/com/stayease/service/# Automated unit & concurrency tests (JUnit 5 + Mockito)
│           └── resources/
│               └── application-test.properties # In-memory H2 config for automated tests
│
├── frontend/                             # React + Vite Frontend
│   ├── package.json
│   ├── vite.config.js                    # Vite configuration with API reverse proxy
│   ├── index.html                        # WANDERO branding & Google Fonts
│   └── src/
│       ├── assets/                       # Static media & assets
│       ├── components/                   # Navbar, Footer, HotelCard, SearchBar, Modals, Comparison
│       ├── hooks/                        # Custom React hooks
│       ├── pages/                        # HomePage, MyBookingsPage
│       ├── services/                     # api.js (Axios), hotelService.js, bookingService.js
│       ├── App.jsx                       # Root application shell
│       ├── index.css                     # Premium travel-tech design system & typography
│       └── main.jsx                      # DOM mount entrypoint
│
├── database/
│   ├── schema.sql                        # DDL table creation and foreign key constraints
│   └── data.sql                          # Initial seed data for hotels, rooms, and amenities
│
├── README.md                             # Setup, execution, and project documentation
├── DESIGN.md                             # Technical architecture, schema, booking logic, and design choices
└── prompt.txt                            # Project requirements specification
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Java 17+** (Java 21 recommended)
- **Maven 3.8+**
- **Node.js 18+** & **npm 9+**
- **MySQL 8.x** or **MariaDB** (running on port `3306`)

---

### Step 1: Database Setup

1. Start your local MySQL server (e.g. via XAMPP Control Panel or MySQL Windows Service).
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS stayease CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. *(Optional)* Run the SQL scripts manually if desired:
   ```bash
   mysql -u root stayease < database/schema.sql
   mysql -u root stayease < database/data.sql
   ```
   > **Note:** The Spring Boot backend includes an automatic `DatabaseDataInitializer` that seeds the sample hotels, rooms, and amenities on first startup if the database is empty.

---

### Step 2: Configure Environment Variables

The backend accepts configuration through environment variables with sensible local defaults:

| Variable | Description | Default Value |
|---|---|---|
| `DB_URL` | JDBC Connection URL | `jdbc:mysql://localhost:3306/stayease?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true` |
| `DB_USERNAME` | MySQL Username | `root` |
| `DB_PASSWORD` | MySQL Password | *(empty)* |
| `PORT` | Spring Boot HTTP Port | `8080` |
| `CORS_ALLOWED_ORIGINS` | Allowed Frontend Origins | `http://localhost:5173,http://localhost:3000` |

If your MySQL password is not empty, set the environment variable in your terminal:
```powershell
$env:DB_PASSWORD = "your_mysql_password"
```

---

### Step 3: Run Automated Tests

To run the automated JUnit 5 test suite verifying room availability and price calculations:

```powershell
cd backend
mvn clean test
```

Expected output:
```
[INFO] Running com.stayease.service.BookingServiceTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.stayease.service.RoomServiceTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

### Step 4: Run the Backend Application

From the `backend` directory:

```powershell
cd backend
mvn spring-boot:run
```

Alternatively, build and run the executable JAR:
```powershell
mvn clean package -DskipTests
java -jar target/stayease-backend-1.0.0.jar
```

The REST API will be available at: **`http://localhost:8080`**

Verify backend health by visiting:
`http://localhost:8080/api/hotels`

---

### Step 5: Run the Frontend Application

In a separate terminal, navigate to the `frontend` folder:

```powershell
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 📡 REST API Reference

### 1. Hotels API (`/api/hotels`)
- `GET /api/hotels`: Retrieve hotels. Supports optional query parameters:
  - `location`: Filter by city, location name, or hotel name.
  - `checkIn` & `checkOut`: Filter only hotels having at least one room available during this period.
- `GET /api/hotels/{id}`: Retrieve detailed hotel information, amenities, and room availability for requested dates.
- `GET /api/hotels/compare?ids=1,2,3&checkIn=...&checkOut=...`: Compare up to three hotels side-by-side with total stay cost, amenities matrix, and rating.

### 2. Rooms API (`/api/rooms`)
- `GET /api/rooms/hotel/{hotelId}?checkIn=...&checkOut=...`: Retrieve all rooms for a hotel with live date-based availability flags.
- `GET /api/rooms/{id}/calculate-price?checkIn=...&checkOut=...`: Calculate stay duration, subtotal, 12% GST, and total cost for a room.

### 3. Bookings API (`/api/bookings`)
- `POST /api/bookings`: Create a confirmed reservation.
  - Request Body:
    ```json
    {
      "roomId": 1,
      "customerName": "Vikram Aditya",
      "customerEmail": "vikram@example.com",
      "customerPhone": "+91 9988776655",
      "checkInDate": "2026-12-10",
      "checkOutDate": "2026-12-13",
      "specialRequests": "Ocean view balcony"
    }
    ```
- `GET /api/bookings/lookup?reference=WD-XXXXXX&email=...`: Lookup a specific booking.
- `GET /api/bookings/my-bookings?email=...`: Retrieve all bookings for an email.
- `POST /api/bookings/cancel?reference=WD-XXXXXX&email=...`: Cancel a reservation and immediately release room availability.

---

## 🛡️ Overbooking Prevention & Concurrency Handling

WANDERO implements defense-in-depth against race conditions:
1. **Pessimistic Write Locking (`PESSIMISTIC_WRITE`)**: When a reservation request arrives, the room row is acquired with a database-level row lock (`SELECT ... FOR UPDATE`). Concurrent requests for the same room are serialized.
2. **Transactional Overlap Check**: Inside the active transaction, the system counts conflicting active bookings (`status = 'CONFIRMED' AND checkIn < newCheckOut AND checkOut > newCheckIn`).
3. If any overlap exists, the transaction rolls back with a `409 Conflict` (`RoomNotAvailableException`).
4. Upon cancellation, the booking status transitions to `CANCELLED`, which instantly frees the dates for subsequent reservation attempts.

---

## 👥 Brand & Identity
**WANDERO — Discover places. Find your stay.**
A modern hotel discovery, comparison and booking platform that makes finding and reserving the perfect stay simple.
Licensed under the [MIT License](LICENSE).
