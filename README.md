# Full-Stack Digital Wallet System

An enterprise-grade, secure digital wallet application featuring a **Spring Boot** backend and a **React** frontend. It implements robust financial architecture, including a Double-Entry Ledger, Idempotent transactions to prevent double-charging, and JWT Authentication.

---

## 👥 Team

| Name | Role | Responsibilities |
|------|------|------------------|
| **Mansi Gupta** | Team Lead & Backend Developer | Spring Boot, REST APIs, PostgreSQL, Database Constraints, Double-Entry Ledger, API Documentation (Swagger), GitHub Repository Management |
| **Akash** | Frontend Developer | React UI Development, Dashboard Design, Frontend State Management, Integration |

---

## 🌟 Key Features

- **Double-Entry Ledger**: Implemented inside `WalletService` using transactional SQL locking to guarantee that money is never created or destroyed, only credited and debited.
- **Idempotency (Double-Charge Prevention)**: The backend physically rejects duplicate transfer attempts caused by network drops by validating a unique `Idempotency-Key` at the PostgreSQL schema level.
- **Role-Based Authentication**: Secure JWT-based auth separating standard Users from Admins.
- **Modern React Dashboard**: Real-time balance and transaction history viewing with a beautiful, professional UI.
- **Pessimistic Locking**: Prevents race conditions and deadlocks when executing concurrent transfers between wallets.

---

## 🛠 Tech Stack

**Backend**
- Java 17 / Spring Boot 3
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Maven

**Frontend**
- React 18
- Vite
- React Router DOM
- Axios
- Vanilla CSS (Modern Design System)

---

## 📂 Project Structure

```text
wallet-system/
├── frontend/             # React Application
│   ├── src/
│   │   ├── api/          # Axios instance & interceptors
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React Context (Auth)
│   │   ├── pages/        # Dashboard, Wallet, Transfer, History
│   │   └── styles/       # CSS Design System
│   └── package.json
│
├── backend/              # Spring Boot Backend
│   ├── src/
│   │   └── main/java/com/mansi/wallet_system/
│   │       ├── controller/   # REST Endpoints
│   │       ├── service/      # Business Logic (Ledger, Transfers)
│   │       ├── repository/   # JPA Repositories
│   │       ├── entity/       # Database Models
│   │       └── security/     # JWT Filters & Config
│   ├── pom.xml           # Maven Dependencies
│   └── Dockerfile        # Backend Container
│
└── docker-compose.yml    # Infrastructure
```

---

## 🚀 Getting Started

### 1. Start the Database
Ensure PostgreSQL is running locally on port `5432` with a database named `wallet_system`.
*(Or use Docker)*
```bash
docker compose up -d postgres
```

### 2. Start the Backend (Spring Boot)
Open a terminal in the root directory, then navigate to the backend:
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```
*The API will be available at `http://localhost:8082`*

### 3. Start the Frontend (React)
Open a *new* terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
*The UI will be available at `http://localhost:5173`*

---

## 📚 API Documentation (Swagger)

Once the backend is running, you can explore and test the API endpoints using the interactive Swagger UI:
👉 **[http://localhost:8082/swagger-ui/index.html](http://localhost:8082/swagger-ui/index.html)**

---

## 🔒 Security & Architecture Notes

- **Password Hashing**: User passwords are encrypted using BCrypt before hitting the database.
- **Idempotency Keys**: For every transfer, the React frontend generates a `crypto.randomUUID()`. The Spring Boot backend checks the `transactions` table (which has a `@Column(unique=true)` constraint on `idempotency_key`) to ensure that a retried network request never results in a double deduction.
- **ACID Compliance**: All monetary operations in `WalletService` are annotated with `@Transactional`. If any part of the double-entry process fails, the entire transaction rolls back instantly.

---

## 👤 Author

**Backend Developer & Lead:** Mansi Gupta