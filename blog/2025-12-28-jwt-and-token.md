---
slug: jwt-access-token-refresh-token-in-nestjs-ecommerce
title: "Secure Authentication in NestJS E-Commerce: JWT, Access Tokens, and Refresh Tokens Explained"
authors: [virtualabishek]
date: "2025-12-29"
description: "A practical guide to implementing secure JWT-based authentication with access tokens and refresh tokens in a NestJS e-commerce project. Covers token generation, validation, refresh flow, security best practices, and real-world application in an online store."
tags: [technical, nestjs, javascript, authentication, jwt, security, ecommerce, backend]
---

# JWT, Access Tokens & Refresh Tokens Explained

## 1. What is JWT (JSON Web Token)?

JWT is a compact, self-contained way to securely transmit information between parties as a JSON object. It's digitally signed, so it can be verified and trusted.

### JWT Structure

A JWT looks like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

It has **3 parts** separated by dots (`.`):

```
HEADER.PAYLOAD.SIGNATURE
```

### Part 1: Header
```json
{
  "alg": "HS256",    // Algorithm used to sign (HMAC SHA256)
  "typ": "JWT"       // Type of token
}
```
This is Base64Url encoded → `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

### Part 2: Payload (Claims)
```json
{
  "sub": "82919d9f-7c7c-4e82-a613-3ce0b7bc523b",  // Subject (user ID)
  "email": "user@example.com",
  "role": "seller",
  "iat": 1766993470,    // Issued At (timestamp)
  "exp": 1766994370     // Expiration (timestamp)
}
```
This is Base64Url encoded → `eyJzdWIiOiI4MjkxOWQ5Zi03...`

### Part 3: Signature
```javascript
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  "your-super-secret-jwt-key"  // Your JWT_SECRET from .env
)
```
This creates a signature that verifies the token wasn't tampered with.

---

## 2. Access Token vs Refresh Token

| Feature | Access Token | Refresh Token |
|---------|--------------|---------------|
| **Purpose** | Authenticate API requests | Get new access tokens |
| **Lifespan** | Short (15 min - 1 hour) | Long (7 days - 30 days) |
| **Stored in** | Memory / localStorage | localStorage / httpOnly cookie |
| **Sent with** | Every API request | Only to `/auth/refresh` endpoint |
| **If stolen** | Limited damage (expires soon) | More dangerous (can get new tokens) |

### Why Two Tokens?

**Security vs User Experience tradeoff:**

1. **If we only had long-lived tokens:**
   - User stays logged in for weeks ✅
   - But if stolen, attacker has access for weeks ❌

2. **If we only had short-lived tokens:**
   - If stolen, attacker only has 15 minutes ✅
   - But user must re-login every 15 minutes ❌

3. **With Access + Refresh tokens:**
   - Access token expires quickly (15 min) - limits damage if stolen ✅
   - Refresh token gets new access tokens - user stays logged in ✅
   - Refresh token is only sent to ONE endpoint - smaller attack surface ✅

---

## 3. The Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Browser │                    │  Backend │                    │ Database │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │  1. POST /auth/login          │                               │
     │  { email, password }          │                               │
     │──────────────────────────────>│                               │
     │                               │  2. Verify password           │
     │                               │──────────────────────────────>│
     │                               │<──────────────────────────────│
     │                               │                               │
     │                               │  3. Generate tokens:          │
     │                               │     - Access (15min)          │
     │                               │     - Refresh (7 days)        │
     │                               │                               │
     │                               │  4. Store refresh token       │
     │                               │──────────────────────────────>│
     │                               │<──────────────────────────────│
     │                               │                               │
     │  5. Return both tokens        │                               │
     │<──────────────────────────────│                               │
     │                               │                               │
     │  6. Store in localStorage:    │                               │
     │     auth_access_token         │                               │
     │     auth_refresh_token        │                               │
     │                               │                               │
```

---

## 4. Making Authenticated Requests

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Browser │                    │  Backend │                    │ Database │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │  GET /api/products            │                               │
     │  Header: Authorization:       │                               │
     │  Bearer eyJhbGci...           │                               │
     │──────────────────────────────>│                               │
     │                               │                               │
     │                               │  1. Extract token from header │
     │                               │  2. Verify signature with     │
     │                               │     JWT_SECRET                │
     │                               │  3. Check expiration          │
     │                               │  4. Extract user info         │
     │                               │                               │
     │                               │  If valid:                    │
     │  ✅ Return products           │  Get products for user        │
     │<──────────────────────────────│──────────────────────────────>│
     │                               │                               │
     │                               │  If expired/invalid:          │
     │  ❌ 401 Unauthorized          │                               │
     │<──────────────────────────────│                               │
     │                               │                               │
```

---

## 5. Token Refresh Flow (When Access Token Expires)

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Browser │                    │  Backend │                    │ Database │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │  GET /api/categories          │                               │
     │  Bearer: [expired token]      │                               │
     │──────────────────────────────>│                               │
     │                               │                               │
     │  ❌ 401 Unauthorized          │  Token expired!               │
     │<──────────────────────────────│                               │
     │                               │                               │
     │  ┌─────────────────────────┐  │                               │
     │  │ Axios Interceptor       │  │                               │
     │  │ catches 401, tries      │  │                               │
     │  │ to refresh              │  │                               │
     │  └─────────────────────────┘  │                               │
     │                               │                               │
     │  POST /auth/refresh           │                               │
     │  { refreshToken: "eyJ..." }   │                               │
     │──────────────────────────────>│                               │
     │                               │  1. Find token in database    │
     │                               │──────────────────────────────>│
     │                               │<──────────────────────────────│
     │                               │                               │
     │                               │  2. Verify not expired        │
     │                               │  3. Verify JWT signature      │
     │                               │  4. Generate NEW tokens       │
     │                               │  5. Delete OLD refresh token  │
     │                               │  6. Store NEW refresh token   │
     │                               │──────────────────────────────>│
     │                               │                               │
     │  Return new tokens            │                               │
     │<──────────────────────────────│                               │
     │                               │                               │
     │  Store new tokens in          │                               │
     │  localStorage                 │                               │
     │                               │                               │
     │  RETRY original request       │                               │
     │  GET /api/categories          │                               │
     │  Bearer: [NEW access token]   │                               │
     │──────────────────────────────>│                               │
     │                               │                               │
     │  ✅ Return categories         │                               │
     │<──────────────────────────────│                               │
     │                               │                               │
```

---

## 6. How It's Implemented in Your Codebase

### Backend (NestJS)

**1. Generating Tokens** - auth.service.ts
```typescript
async generateTokens(user: any) {
  const payload = {
    sub: user.id,           // Subject - who this token is for
    email: user.email,
    username: user.username,
    role: user.role,
  };

  // Access token - short lived (15 minutes)
  const accessToken = this.jwtService.sign(payload, {
    expiresIn: '15m',
  });

  // Refresh token - long lived (7 days)
  const refreshToken = this.jwtService.sign(payload, {
    expiresIn: '7d',
  });

  // Store refresh token in database (so we can invalidate it)
  await this.prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken, expiresIn: 900 };
}
```

**2. JWT Guard** - Protects routes
```typescript
// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Check if route is marked @Public()
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;  // Skip auth for public routes
    
    return super.canActivate(context);  // Verify JWT
  }
}
```

**3. JWT Strategy** - Validates tokens
```typescript
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,  // Same secret used to sign
    });
  }

  // Called after JWT is verified
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

### Frontend (React/Next.js)

**1. Storing Tokens After Login** - authSlice.ts
```typescript
const response = await authService.login(email, password);

// Store both tokens in localStorage
tokenManager.setTokens(response.accessToken, response.refreshToken);
```

**2. Attaching Token to Every Request** - axios-instance.ts
```typescript
axiosInstance.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**3. Auto-Refresh on 401** - axios-instance.ts
```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = tokenManager.getRefreshToken();
      
      // Get new tokens
      const response = await axios.post('/auth/refresh', { refreshToken });
      
      // Store new tokens
      tokenManager.setTokens(response.accessToken, response.refreshToken);
      
      // Retry the failed request with new token
      return axiosInstance(originalRequest);
    }
  }
);
```

---

## 7. The Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              JWT ECOSYSTEM                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   JWT_SECRET    │
                              │ (in .env file)  │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
           ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
           │  Sign Tokens   │ │ Verify Tokens  │ │ Decode Tokens  │
           │  (on login)    │ │ (on requests)  │ │ (get payload)  │
           └────────┬───────┘ └────────────────┘ └────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌───────────────┐       ┌───────────────┐
│ ACCESS TOKEN  │       │ REFRESH TOKEN │
│  (15 minutes) │       │   (7 days)    │
└───────┬───────┘       └───────┬───────┘
        │                       │
        │                       │
        ▼                       ▼
┌───────────────────┐   ┌───────────────────┐
│    localStorage   │   │    localStorage   │
│ auth_access_token │   │ auth_refresh_token│
└───────────────────┘   └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │     DATABASE      │
                        │  RefreshToken     │
                        │  table (for       │
                        │  invalidation)    │
                        └───────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                           REQUEST LIFECYCLE                                  │
└─────────────────────────────────────────────────────────────────────────────┘

  User Action          Frontend                    Backend                  DB
      │                   │                          │                      │
      │  Click "Create"   │                          │                      │
      │──────────────────>│                          │                      │
      │                   │                          │                      │
      │                   │  1. Get access token     │                      │
      │                   │     from localStorage    │                      │
      │                   │                          │                      │
      │                   │  2. Add to header:       │                      │
      │                   │     Authorization:       │                      │
      │                   │     Bearer eyJ...        │                      │
      │                   │                          │                      │
      │                   │  POST /api/categories    │                      │
      │                   │─────────────────────────>│                      │
      │                   │                          │                      │
      │                   │                          │  3. JwtAuthGuard     │
      │                   │                          │     - Extract token  │
      │                   │                          │     - Verify with    │
      │                   │                          │       JWT_SECRET     │
      │                   │                          │     - Check exp      │
      │                   │                          │                      │
      │                   │                          │  4. @CurrentUser()   │
      │                   │                          │     - Get user from  │
      │                   │                          │       token payload  │
      │                   │                          │                      │
      │                   │                          │  5. Create category  │
      │                   │                          │─────────────────────>│
      │                   │                          │<─────────────────────│
      │                   │                          │                      │
      │                   │  ✅ 201 Created          │                      │
      │  Show success     │<─────────────────────────│                      │
      │<──────────────────│                          │                      │
      │                   │                          │                      │
```

---

## 8. Security Best Practices

| Practice | Why | Your Code |
|----------|-----|-----------|
| **Short access token expiry** | Limits damage if stolen | ✅ 15 minutes |
| **Store refresh token in DB** | Can invalidate on logout | ✅ RefreshToken table |
| **Rotate refresh tokens** | Old tokens become invalid | ✅ Delete old, create new |
| **Use HTTPS** | Prevents token interception | ⚠️ Use in production |
| **HttpOnly cookies** | Prevents XSS theft | ❌ Using localStorage |
| **Strong JWT_SECRET** | Prevents token forgery | ⚠️ Change in production |

---

## 9. Common Questions

**Q: Why store refresh token in database?**
A: So you can invalidate it on logout. Without DB storage, the token is valid until expiration.

**Q: Can I decode a JWT without the secret?**
A: Yes! The payload is just Base64 encoded. But you can't **verify** it without the secret.

**Q: What happens if someone steals my refresh token?**
A: They can get new access tokens until you logout (which deletes the refresh token from DB).

**Q: Why not just use sessions?**
A: JWTs are stateless - server doesn't need to store session data. Better for scaling and microservices.

