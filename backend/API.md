# WebGuruJi.online - Backend API Documentation

## Authentication Routes (`/api/auth`)

### 1. User Signup
- **Endpoint:** `POST /api/auth/signup`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "data": { "id": "...", "name": "John Doe", "username": "johndoe", "email": "john@example.com" }
  }
  ```

### 2. User Login
- **Endpoint:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "username": "johndoe",
    "password": "securepassword123"
  }
  ```
  *(Note: `username` can accept either the username or the email address)*
- **Response:** `200 OK` (Sets HTTP-only `token` cookie)
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "name": "John Doe",
    "email": "john@example.com",
    "data": { ... }
  }
  ```

### 3. User Logout
- **Endpoint:** `POST /api/auth/logout`
- **Response:** `200 OK` (Clears `token` cookie)
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

### 4. Current Session User
- **Endpoint:** `GET /api/auth/me`
- **Headers:** Requires cookie `token`
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "user": { "id": "...", "role": "USER" }
  }
  ```

---

## User Routes (`/api/users`)

*(All routes require Authentication via HTTP-only cookie)*

### 1. Get Profile
- **Endpoint:** `GET /api/users/me`
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "...",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "avatarUrl": null,
      "role": "USER",
      "createdAt": "2023-10-01T10:00:00Z"
    }
  }
  ```

### 2. Update Profile
- **Endpoint:** `PATCH /api/users/me`
- **Body:**
  ```json
  {
    "name": "John New Name",
    "avatarUrl": "https://example.com/new-avatar.png"
  }
  ```
- **Response:** `200 OK`

---

## Admin Routes (`/api/admin`)

*(All routes require Authentication AND Admin/Super Admin Role)*

### 1. Get All Users
- **Endpoint:** `GET /api/admin/users?page=1&limit=20`
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "users": [ ... ],
      "pagination": {
        "total": 50,
        "page": 1,
        "limit": 20,
        "totalPages": 3
      }
    }
  }
  ```

### 2. Update User Status/Role
- **Endpoint:** `PATCH /api/admin/users/:id/status`
- **Body:**
  ```json
  {
    "isActive": false,
    "role": "MODERATOR"
  }
  ```
- **Response:** `200 OK`
