# 🚀 Frontend Application – FastAPI Integration

**Production URL:**  
👉 https://intern-frontend-mauve.vercel.app

A complete **React + Vite frontend application** integrated with a **FastAPI backend**, featuring **JWT authentication**, **refresh tokens**, **OTP-based email verification**, **role-based access control**, and **Tasks CRUD with pagination**.

---

## 🌐 Live Demo

🔗 **Frontend (Production):**  
https://intern-frontend-mauve.vercel.app?_vercel_share=pz6ZR7mKhS4wcGH1CCvPwCHyr5y1zycQ
---

## ✨ Features

### 🔐 Authentication Flows
- ✅ User Registration (Email + Password)
- ✅ Email OTP Verification
- ✅ Login with JWT (Access + Refresh Tokens)
- ✅ Forgot Password (OTP-based)
- ✅ Reset Password
- ✅ Logout with token cleanup

### 🔁 Token Management
- ✅ Automatic access token attachment
- ✅ Automatic refresh token handling on `401`
- ✅ Request retry after token refresh
- ✅ Secure token storage using `localStorage`

### 🛡️ Protected Features
- ✅ User Dashboard
- ✅ Tasks CRUD Operations
- ✅ Pagination for Tasks
- ✅ Role-Based UI
  - **ADMIN** → Can delete tasks
  - **USER** → Read / Create / Update only
- ✅ Centralized error handling

---



Each layer has a **single responsibility**, making the system easy to maintain and extend.

---

## 🔐 Authentication & Authorization Design

### Authentication Strategy
- JWT-based authentication
- Short-lived **Access Token**
- Long-lived **Refresh Token**
- OTP-based email verification

### Why This Approach?
- Prevents frequent logins
- Improves security
- Matches real-world backend systems
- Supports horizontal scalability

---

## 🔁 Token Lifecycle & Refresh Flow

1. User logs in and receives access + refresh tokens
2. Access token is attached to every protected request
3. When access token expires:
   - Backend returns `401`
   - Frontend automatically calls refresh endpoint
4. New access token is issued
5. Original request is retried silently
6. If refresh fails → user is logged out

This ensures **zero disruption to user experience**.

---

## 👥 Role-Based Access Control (RBAC)

Roles are embedded in the JWT payload.

| Role  | Permissions |
|------|------------|
| USER | Create, Read, Update tasks |
| ADMIN | Full access (including delete) |

### Frontend Enforcement
- Conditional UI rendering
- Button visibility based on role
- Backend remains final authority

---

## 📄 Tasks Module Design

The Tasks feature represents a **real-world CRUD system**:

- Pagination for scalability
- Optimistic UI updates
- Protected routes
- Permission-based actions

This module can be extended to support:
- Filters
- Sorting
- Search
- Soft delete

---

## ⚠️ Error Handling Philosophy

All errors are handled in a **user-friendly but developer-safe** way:

- Backend messages displayed clearly
- Fallback messages for unknown errors
- Centralized error handling
- Automatic handling of authentication failures

---

## 🏗️ Code Quality & Structure

### Key Principles Used
- Modular file structure
- Reusable utilities
- Clean API abstraction
- Predictable routing
- No business logic inside UI components

This keeps the codebase **readable, testable, and scalable**.

---

## 🚀 Production Readiness

This project is **production deployable** because:

- Environment-based configuration
- Token refresh handling
- Role-based UI protection
- Graceful failure handling
- Deployed on Vercel

---

## 🔐 Security Considerations

Current implementation:
- Tokens stored in `localStorage`

Recommended improvement:
- Move tokens to `httpOnly` cookies
- Add CSRF protection
- Rate-limit sensitive endpoints

These changes can be applied without altering the frontend architecture.

---

## 🧪 Testing Strategy

Manual end-to-end testing covers:
- Registration → Verification → Login
- Token expiry and refresh
- Role-based permission checks
- CRUD flows
- Logout & session cleanup

The architecture supports easy addition of:
- Unit tests
- Integration tests
- Cypress / Playwright E2E tests

---

## 📈 Future Enhancements

- Global state management (Redux / Zustand)
- Dark mode UI
- Task filtering & sorting
- Activity audit logs
- Real-time updates (WebSockets)

---

## 🏁 Conclusion

This project demonstrates:

- Practical understanding of authentication systems
- Real-world frontend–backend integration
- Production-level architectural decisions
- Clean and maintainable React codebase

It is designed not as a demo, but as a **foundation for a scalable application**.

---

### 👨‍💻 Built With
**React · Vite · Axios · FastAPI · JWT · Vercel**
