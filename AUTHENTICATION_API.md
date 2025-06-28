# Authentication API Documentation

This document provides comprehensive documentation for the authentication endpoints in the PMS (Personal Management System) backend.

## Overview

The authentication system uses JWT (JSON Web Tokens) for secure user authentication. All endpoints except login require a valid JWT token in the Authorization header.

## Base URL

```
http://localhost:3000/auth
```

## Endpoints

### 1. User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user with email and password to receive JWT token

**Access:** Public (no authentication required)

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "SecurePass123!"
}
```

**Request Schema:**
- `username` (string, required): User email address
- `password` (string, required): User password

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Wrong Password",
  "error": "Unauthorized"
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

**Example Usage:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin@pms.com",
    "password": "Admin123!"
  }'
```

## Authentication Flow

### 1. Login Process
1. User sends credentials to `/auth/login`
2. System validates email and password
3. If valid, returns JWT token
4. If invalid, returns error response

### 2. Using JWT Token
1. Include token in Authorization header: `Bearer <token>`
2. Token contains user information (id, role, entityId)
3. Token is validated on each protected request

### 3. Token Structure
```json
{
  "id": 1,
  "role": "ADMIN",
  "entityId": null,
  "userId": 1
}
```

## User Roles

The system supports the following user roles:

- **STUDENT**: Students with limited access
- **TEACHER**: Teachers with subject-specific access
- **SECRETARY**: Administrative staff with broad access
- **ADMIN**: System administrators with full access

## Password Requirements

Passwords must meet the following security requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@$!%*?&)

## Error Handling

### Common Error Responses

**401 Unauthorized:**
- Invalid credentials
- Expired token
- Missing token

**403 Forbidden:**
- Insufficient permissions
- Role-based access denied

**404 Not Found:**
- User not found
- Invalid user ID

**422 Unprocessable Entity:**
- Validation errors
- Invalid request format

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Token Expiration**: JWT tokens have expiration time
3. **Password Security**: Passwords are hashed using bcrypt
4. **Rate Limiting**: Login attempts are rate-limited
5. **Input Validation**: All inputs are validated and sanitized

## Development Notes

### Default Admin Credentials
- **Email**: `admin@pms.com`
- **Password**: `Admin123!`

### Environment Variables
```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
ADMIN_EMAIL=admin@pms.com
ADMIN_PASSWORD=Admin123!
```

### Testing Authentication
```bash
# Login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin@pms.com", "password": "Admin123!"}' \
  | jq -r '.token')

# Use token for authenticated requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/users
```

## Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:3000/api
```

This provides a complete interface for testing all authentication endpoints. 
