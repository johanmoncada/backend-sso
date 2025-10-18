# Backend SSO + Notificaciones Multicanal

## Description

Este proyecto es un backend de autenticación SSO (Single Sign-On) con soporte para notificaciones multicanal (email, SMS, WhatsApp, Telegram). Utiliza NestJS, TypeORM y MariaDB.

[NestJS](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Documentación

- [NestJS Docs](https://docs.nestjs.com/)
- [TypeORM Docs](https://typeorm.io/)
- [MariaDB Docs](https://mariadb.com/kb/en/)

## Requisitos

- Node.js: 18 LTS o 20 LTS
- MariaDB 10.6+ (o compatible MySQL)
- npm 9+

## Tecnologías

- NestJS, TypeScript
- JWT (@nestjs/jwt), Passport
- TypeORM (MariaDB)
- Notificaciones:
  - Email: MailerSend SDK
  - Telegram: nestjs-telegraf
  - SMS/WhatsApp: servicios base listos para integrar

## Estructura del proyecto

```bash
src/
  app.module.ts
  main.ts
  auth/
    auth.controller.ts
    auth.guard.ts
    auth.module.ts
    auth.service.ts
  database/
    database.module.ts
  notifications/
    notifications.controller.ts
    notifications.module.ts
    notifications.service.ts
    channels/
      email.service.ts
      sms.service.ts
      telegram.service.ts
      whatsapp.service.ts
  process/
    process.controller.ts
    process.module.ts
    process.service.ts
  shared/
    constants.ts
    shared.module.ts
    utils.ts
    decorators/
      public.decorator.ts
    interface/
      jwtpayload.ts
    request/
      create-user.request.ts
      login-v1.request.ts
      login-v2.request.ts
      login-v3.request.ts
      otp-email.request.ts
    response/
  user/
    user.controller.ts
    user.entity.ts
    user.module.ts
    user.service.ts
```

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npx nest start --watch
# o si tienes script:
# npm run start:dev
```

## Comandos para ejecutar la app

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## Configuración requerida

Crea un archivo `.env` en la raíz con:

```bash
JWT_SECRET=tu_secreto_seguro
JWT_EXPIRES_IN=120
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=toor
DB_NAME=sso_db
DB_AUTOLOAD_ENTITIES=true
DB_SYNCHRONYZE=true
SMTP_HOST=smtp.tuservidor.com
SMTP_PORT=587
SMTP_USER=tu_usuario
SMTP_PASS=tu_contraseña
```

## Seguridad

- JWT expira en 120s (2 minutos). Manejo explícito de `TokenExpiredError`.
- No expongas `JWT_SECRET` ni API keys en el repositorio.
- Ajusta CORS (origin) en producción y limita métodos/headers.

## Endpoints principales

## Usuarios

Para crear usuarios, el endpoint debe ser público, es decir, no debe requerir autenticación. Si el endpoint requiere autenticación y no se proporciona un token JWT válido, se recibirá un error 401 Unauthorized.

Para hacer el endpoint público, descomenta la línea `@Public()` y su import correspondiente en `user.controller.ts`:

```typescript
// import { Public } from 'src/shared/decorators/public.decorator';

// @Public()
```

### `POST /api/user` — Crear usuario `{ document, email, password }`

Peticion sin token cURL ejemplo:

```bash
curl --location 'http://localhost:3000/api/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "document": "<document_number>",
    "password": "<password>",
    "email": "<user@email.com>"
}'
```

Peticion con token cURL ejemplo:

```bash
curl --location 'http://localhost:3000/api/user' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <tu_token_jwt>' \
--data-raw '{
    "document": "<document_number>",
    "password": "<password>",
    "email": "<user@email.com>"
}'
```

---

### `DELETE /api/user/:id` - Eliminar usuario por ID (requiere JWT válido)

```bash
curl --location --request DELETE 'http://localhost:3000/api/user/1' \
--header 'Authorization: <tu_token_jwt>'
```

---

## Autenticación

### `POST /v1/api/auth/login` — Login por documento y contraseña

**Ejemplo cURL:**

```bash
curl --location 'http://localhost:3000/v1/api/auth/login' \
--header 'Content-Type: application/json' \
--data '{
    "document": "<document_number>",
    "password": "<password>"
}'
```

**Response exitoso ejemplo:**

```json
{
    "message": "Login exitoso",
    "access_token": "<tu_token_jwt>",
    "expires_in": 120
}
```

**Response fallido ejemplo:**

```json
{
    "message": "Datos de autenticación inválidos",
    "error": "Unauthorized",
    "statusCode": 401
}
```

---

### `POST /v2/api/auth/login` — Login por correo y contraseña

Request body ejemplo:

```bash
curl --location 'http://localhost:3000/v1/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "<user@email.com>",
    "password": "<password>"
}'
```

---

### `POST /v3/api/auth/login` — Login por código OTP

Request body ejemplo:

```bash
curl --location 'http://localhost:3000/v3/api/auth/login' \
--header 'Content-Type: application/json' \
--data '{
    "otp": "<otp_code>"
}'
```

---

### `POST  /v1/api/auth/validate` — Enviar token en body

Request body ejemplo:

```bash
curl --location 'http://localhost:3000/v1/api/auth/validate' \
--header 'Content-Type: application/json' \
--data '{
    "token": "<tu_token_jwt>"
}'
```

Response exitoso ejemplo:

```bash
{
    "message": "Token válido",
    "payload": {
        "sub": 1,
        "username": "user name",
        "iat": 1759952743,
        "exp": 1759952863
    }
}
```

Response fallido ejemplo:

```bash
{
    "message": "Token inválido o expirado",
    "error": "Unauthorized",
    "statusCode": 401
}
```

---

### `POST /v2/api/auth/validate` — Enviar header `Authorization: Bearer <token>`

```bash
curl --location --request POST 'http://localhost:3000/v2/api/auth/validate' \
--header 'Authorization: <tu_token_jwt>'
```

---

## Notificaciones

### `POST /api/notifications` — Enviar header `Authorization: Bearer <token>`

- chanel: email | telegram | sms | whatsapp

```bash
curl --location 'http://localhost:3000/api/notifications' \
--header 'Content-Type: application/json' \
--data-raw '{
    "channel": "email",
    "to": "johan.moncadat@gmail.com",
    "subject": "Prueba SSO Email",
    "message": "Se esta realizando una prueba de envio de email desde NestJS"
}'
```

---

### Procesos protegidos

### `POST /v1/api/process/restricted` — Enviar header `Authorization: Bearer <token>`

```bash
curl --location --request POST 'http://localhost:3000/v1/api/process/restricted' \
--header 'Authorization: <tu_token_jwt>'
```

---

### `POST /v2/api/process/restricted` — Enviar header `Authorization: Bearer <token>`

```bash
curl --location --request POST 'http://localhost:3000/v2/api/process/restricted' \
--header 'Authorization: <tu_token_jwt>'
```

---
