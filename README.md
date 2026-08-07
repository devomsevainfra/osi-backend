# osi-backend

## Initial SUPERADMIN bootstrap

Set these server environment variables, then make this one-time request before creating other users:

```env
SUPERADMIN_EMAIL=admin@example.com
SUPERADMIN_PASSWORD=StrongPassword1!
```

```http
POST {API_PREFIX}/user/bootstrapSuperAdmin
```

The endpoint accepts no request input. It creates an active `SUPERADMIN` from the environment values and returns `409` only when that email is already registered.
