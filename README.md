# wallet-system

A secure digital wallet backend application built using **Spring Boot**, **PostgreSQL**, **Redis**, and **JWT Authentication**.

---

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
- Validation Error Handling
- Health Check Endpoint
- Swagger/OpenAPI Documentation

---

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

---

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

---

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
- `GET /transactions/{walletId}` - Get transactions by wallet

---

## API Usage Examples

Base URL:

```text
http://localhost:8082
```

### Create Wallet

**Request**

```http
POST /wallets
Content-Type: application/json
```

```json
{
  "ownerName": "Mansi",
  "balance": 1000
}
```

**Response**

```json
{
  "id": 1,
  "ownerName": "Mansi",
  "balance": 1000
}
```

---

### Get All Wallets

**Request**

```http
GET /wallets
```

**Response**

```json
[
  {
    "id": 1,
    "ownerName": "Mansi",
    "balance": 1000
  },
  {
    "id": 2,
    "ownerName": "Rahul",
    "balance": 500
  }
]
```

---

### Transfer Money

**Request**

```http
POST /wallets/transfer
Idempotency-Key: transfer-001
Content-Type: application/json
```

```json
{
  "senderWalletId": 1,
  "receiverWalletId": 2,
  "amount": 50
}
```

**Response**

```json
{
  "success": true,
  "message": "Transfer completed successfully",
  "data": {
    "id": 1,
    "fromWalletId": 1,
    "toWalletId": 2,
    "amount": 50.0,
    "status": "SUCCESS"
  }
}
```

---

### Validation Error Example

**Request**

```http
POST /wallets/transfer
Content-Type: application/json
```

```json
{
  "senderWalletId": null,
  "receiverWalletId": null,
  "amount": 0
}
```

**Response**

```json
{
  "amount": "Amount must be greater than 0",
  "receiverWalletId": "Receiver Wallet ID is required",
  "senderWalletId": "Sender Wallet ID is required"
}
```

---

### Health Check

**Request**

```http
GET /actuator/health
```

**Response**

```json
{
  "status": "UP"
}
```

---

## Swagger UI

Open in browser after starting the application:

```text
http://localhost:8082/swagger-ui/index.html
```

---

## Running the Application

```bash
mvn clean install
mvn spring-boot:run
```

---

## Database Configuration

Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/wallet_db
spring.datasource.username=postgres
spring.datasource.password=your_password
```

---

## Redis Configuration

Make sure Redis is running on:

```text
localhost:6379
```

---

## Idempotency Example

Send header:

```text
Idempotency-Key: tx-12345
```

Sending the same request again returns:

```text
Duplicate request ignored
```

---

## Testing

Run tests:

```bash
mvn test
```

---

## Run with Docker

```bash
docker compose up --build
```

Services:

- App → http://localhost:8082
- PostgreSQL → localhost:5432
- Redis → localhost:6379

---

## Implemented Tests

- WalletServiceTest
- WalletControllerIntegrationTest

---

## Author

**Backend Developer:** Mansi Gupta