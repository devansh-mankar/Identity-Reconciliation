# Identity Reconciliation API

This API provides contact identity reconciliation services, allowing you to track and link related contact records across your systems.

## Features

- RESTful API endpoint for contact identification
- Intelligent contact linking algorithm based on email and phone connections
- MongoDB data storage with TypeScript integration
- Contact hierarchy with primary/secondary relationship tracking
- Comprehensive error handling and response formatting

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (v4+)

### Installation

1. Clone the repository
2. Install dependencies:

```
npm install
```

3. Set up environment variables by creating a `.env` file:

```
NODE_ENV=development
PORT=3000
MONGODB_URI=url
LOG_LEVEL=info
```

### Running the API

Development mode:

```
npm run dev
```

Production build:

```
npm run build
npm start
```

## API Documentation

### Identify Contact

**Endpoint:** `POST /api/contacts/identify`

**Request Body:**

```json
{
  "email": "test@example.com",
  "phoneNumber": "1234567890"
}
```

Both fields are optional, but at least one must be provided.

**Response:**

```json
{
  "contact": {
    "primaryContactId": "123",
    "emails": ["test@example.com", "other@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": ["456", "789"]
  }
}
```

## Testing

Run the test suite:

```
npm test
```

## Project Structure

- `/src` - Source code
  - `/controllers` - Request handlers
  - `/services` - Business logic
  - `/models` - MongoDB schemas
  - `/repositories` - Data access
  - `/middleware` - Express middleware
  - `/utils` - Utility functions
  - `/routes` - API routes
  - `/__tests__` - Test files
