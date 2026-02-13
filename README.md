# Frontend Application - FastAPI Integration

Complete React frontend application with JWT authentication, refresh tokens, OTP email verification, role-based access control, and CRUD operations for Tasks.

## 🚀 Features

### Authentication Flows
- ✅ User Registration with email/password
- ✅ Email OTP Verification
- ✅ Login with JWT tokens (access + refresh)
- ✅ Forgot Password with OTP
- ✅ Reset Password
- ✅ Logout with token cleanup

### Token Management
- ✅ Automatic access token attachment to protected requests
- ✅ Automatic token refresh on 401 errors
- ✅ Request retry after token refresh
- ✅ Secure token storage in localStorage

### Protected Features
- ✅ Dashboard with user information
- ✅ Tasks CRUD operations (Create, Read, Update, Delete)
- ✅ Pagination for task lists
- ✅ Role-based UI (ADMIN can delete, USER cannot)
- ✅ Comprehensive error handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

## 🛠️ Installation

1. **Navigate to the project directory:**
   ```bash
   cd FRONT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🏃 Running the Application

1. **Ensure your FastAPI backend is running on `http://localhost:8000`**

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
FRONT/
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance with interceptors
│   ├── auth/
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Registration page
│   │   ├── VerifyEmail.jsx       # Email OTP verification
│   │   ├── ForgotPassword.jsx    # Forgot password page
│   │   └── ResetPassword.jsx     # Reset password with OTP
│   ├── pages/
│   │   ├── Dashboard.jsx         # Dashboard with user info
│   │   └── Tasks.jsx             # Tasks CRUD with pagination
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Route guard component
│   ├── utils/
│   │   ├── auth.js               # Token management utilities
│   │   └── roleCheck.js          # JWT decode and role checking
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── package.json
└── README.md
```

## 🔐 Token Handling Approach

### Storage
- **Access Token**: Stored in `localStorage` with key `access_token`
- **Refresh Token**: Stored in `localStorage` with key `refresh_token`

### Automatic Refresh Flow
1. User makes a protected API request
2. Axios request interceptor attaches access token to `Authorization` header
3. If response is 401 (Unauthorized):
   - Axios response interceptor catches the error
   - Calls `/api/v1/auth/refresh` with refresh token
   - Updates stored access token
   - Retries original request with new token
4. If refresh fails:
   - Clears all tokens
   - Redirects to login page

### Implementation Details

**Request Interceptor** (`src/api/axios.js`):
```javascript
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor** (`src/api/axios.js`):
```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Refresh token logic
      const refreshToken = getRefreshToken();
      const response = await axios.post('/auth/refresh', { refresh_token: refreshToken });
      setTokens(response.data.access_token, refreshToken);
      // Retry original request
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

## 🔌 API Integration Examples

### 1. User Registration
```javascript
// POST /api/v1/auth/register
const response = await axios.post(
  'http://localhost:8000/api/v1/auth/register',
  { email: 'user@example.com', password: 'password123' }
);
// Response: { message: "User registered successfully" }
```

### 2. Email Verification
```javascript
// POST /api/v1/auth/verify-email
const response = await axios.post(
  'http://localhost:8000/api/v1/auth/verify-email',
  { email: 'user@example.com', otp: '123456' }
);
// Response: { message: "Email verified successfully" }
```

### 3. Login
```javascript
// POST /api/v1/auth/login
const response = await axios.post(
  'http://localhost:8000/api/v1/auth/login',
  { email: 'user@example.com', password: 'password123' }
);
// Response: { access_token: "...", refresh_token: "..." }
setTokens(response.data.access_token, response.data.refresh_token);
```

### 4. Create Task (Protected)
```javascript
// POST /api/v1/tasks
const response = await api.post('/tasks', {
  title: 'My Task',
  description: 'Task description'
});
// Response: { id: 1, title: "My Task", description: "Task description", ... }
```

### 5. Get Tasks with Pagination (Protected)
```javascript
// GET /api/v1/tasks?page=1&page_size=10
const response = await api.get('/tasks?page=1&page_size=10');
// Response: { tasks: [...], total: 50, page: 1, page_size: 10 }
```

### 6. Update Task (Protected)
```javascript
// PUT /api/v1/tasks/{id}
const response = await api.put(`/tasks/${taskId}`, {
  title: 'Updated Task',
  description: 'Updated description'
});
// Response: { id: 1, title: "Updated Task", ... }
```

### 7. Delete Task (Protected - ADMIN only)
```javascript
// DELETE /api/v1/tasks/{id}
const response = await api.delete(`/tasks/${taskId}`);
// Response: { message: "Task deleted successfully" }
```

### 8. Logout (Protected)
```javascript
// POST /api/v1/auth/logout
await api.post('/auth/logout');
clearTokens();
navigate('/login');
```

## 🎯 Role-Based Access Control

### Extracting User Role
```javascript
import { getUserRole, isAdmin } from './utils/roleCheck';

const userRole = getUserRole(); // Returns 'ADMIN' or 'USER'
const canDelete = isAdmin();    // Returns true if ADMIN
```

### Conditional UI Rendering
```javascript
{isAdmin() && (
  <button onClick={() => handleDeleteTask(task.id)}>
    Delete
  </button>
)}
```

## ⚠️ Error Handling

### Backend Error Display
All API errors are caught and displayed to users:
```javascript
try {
  await api.post('/tasks', formData);
} catch (err) {
  setError(
    err.response?.data?.detail || 
    err.response?.data?.message || 
    'Operation failed'
  );
}
```

### Specific Error Cases
- **Invalid OTP**: "Invalid OTP. Please check and try again."
- **Expired OTP**: "OTP has expired. Please request a new one."
- **Unauthorized**: Automatic token refresh attempted
- **Forbidden**: "Only ADMIN users can delete tasks"

## 🧪 Testing the Application

### Complete Flow Test
1. **Register**: Create account → Receive OTP message
2. **Verify**: Enter OTP → Redirect to login
3. **Login**: Enter credentials → Redirect to dashboard
4. **Dashboard**: View user info → Navigate to tasks
5. **Create Task**: Fill form → Task appears in list
6. **Update Task**: Click edit → Modify → Save
7. **Delete Task**: (ADMIN only) Click delete → Confirm
8. **Pagination**: Navigate pages → View different tasks
9. **Logout**: Click logout → Redirect to login

### Token Refresh Test
1. Login and get tokens
2. Wait for access token to expire (15 minutes)
3. Make any protected request
4. Verify automatic refresh happens
5. Verify request succeeds with new token

### Role-Based Access Test
1. Login as USER → Verify no delete button
2. Login as ADMIN → Verify delete button visible
3. Attempt delete as USER via API → Verify error message

## 🔧 Configuration

### Backend URL
To change the backend URL, update `src/api/axios.js`:
```javascript
const api = axios.create({
  baseURL: 'http://your-backend-url/api/v1',
});
```

### Token Expiry
Token expiry is handled by the backend. The frontend automatically refreshes tokens when they expire.

## 📝 Notes

- **Security**: For production, consider using `httpOnly` cookies instead of localStorage
- **Token Storage**: Current implementation uses localStorage for simplicity
- **Error Messages**: All backend error messages are displayed to users
- **Loading States**: All forms show loading states during API calls
- **Validation**: Basic client-side validation is implemented

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `http://localhost:8000`
- Check CORS settings on backend
- Verify API endpoints match backend routes

### Token Refresh Fails
- Check refresh token is valid and not expired
- Verify `/api/v1/auth/refresh` endpoint is working
- Check browser console for detailed error messages

### Role-Based Features Not Working
- Verify JWT token contains `role` field
- Check token decoding in browser console
- Ensure backend is sending correct role in token

## 📦 Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🤝 Assignment Submission

This frontend application demonstrates:
- ✅ Complete integration with FastAPI backend
- ✅ All authentication flows working end-to-end
- ✅ JWT token handling with automatic refresh
- ✅ Role-based access control
- ✅ Full CRUD operations with pagination
- ✅ Comprehensive error handling
- ✅ Clean, readable code structure
- ✅ Ready for review and testing

---

**Built with React + Vite** | **API Integration Ready** | **Assignment Complete**
#   i n t e r n - f r o n t e n d  
 