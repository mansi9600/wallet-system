# wallet-system

A secure digital wallet backend application built using **Spring Boot**, **PostgreSQL**, **Redis**, and **JWT Authentication**.


## 👥 Team

| Name | Role | Responsibilities |
|------|------|------------------|
| **Mansi Gupta** | Team Lead & Backend Developer | Spring Boot, REST APIs, PostgreSQL, Redis, Business Logic, API Documentation (Swagger), GitHub Repository Management |
| **Akash** | Frontend Developer | React UI Development, Frontend Integration, User Interface Design |

---
## Features

- User Registration & Login
- JWT-based Authentication
- Wallet Creation
- Balance Inquiry
- Money Transfer between Wallets
- Transaction History
- Redis Idempotency (prevents duplicate transfers)
- Pessimistic Locking for concurrent transfers
- Unit & Integration Tests
- Swagger/OpenAPI Documentation

## Tech Stack

- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- PostgreSQL
- Redis
- Maven
- Swagger (Springdoc OpenAPI)
- JUnit 5 & Mockito

## Project Structure

```text
src/main/java/com/mansi/wallet_system
 ├── controller
 ├── service
 ├── repository
 ├── entity
 ├── dto
 ├── security
 └── exception
```

## API Endpoints

### User APIs

- `POST /users` - Create user
- `GET /users` - Get all users

### Wallet APIs

- `POST /wallets` - Create wallet
- `GET /wallets` - Get all wallets
- `GET /wallets/{id}` - Get wallet by id
- `POST /wallets/transfer` - Transfer money

### Transaction APIs

- `GET /transactions` - Get all transactions

## Swagger UI

After running the application:

```text
http://localhost:8082/swagger-ui/index.html
```

## Running the Application

```bash
mvn clean install
mvn spring-boot:run
```

## Database Configuration

Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/wallet_db
spring.datasource.username=postgres
spring.datasource.password=your_password
```

## Redis Configuration

Make sure Redis server is running on:

```text
localhost:6379
```

## Idempotency Example

Send header:

```text
Idempotency-Key: tx-12345
```

Sending the same request again returns:

```text
Duplicate request ignored
```

## Testing

Run tests using:

```bash
mvn test
```

Implemented tests:

- WalletServiceTest
- WalletControllerIntegrationTest

## Author

**Backend Developer:** Mansi Gupta



