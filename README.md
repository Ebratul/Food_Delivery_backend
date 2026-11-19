# FoodDash API (Backend)

REST API for **FoodDash**, a food delivery platform where customers order from local restaurants, restaurant owners manage their listings and menus, and admins moderate the marketplace.

| | Link |
|---|---|
| **Live API** | https://food-delivery-backend-iota-kohl.vercel.app |
| **Health check** | https://food-delivery-backend-iota-kohl.vercel.app/api/health |
| **Live website** | https://food-delivery-frontend-seven-gamma.vercel.app |
| **Frontend repo** | https://github.com/Ebratul/Food_Delivery_frontend |

## Tech stack

- **Node.js + Express 5**: modular REST API
- **PostgreSQL + Prisma ORM 7**: Prisma Postgres in production, Docker Postgres locally
- **JWT** authentication, **bcrypt** password hashing, role-based access control (USER / ADMIN)
- **zod** request validation, **helmet**, **CORS** allow-list, **express-rate-limit**
- **multer + sharp**: image uploads resized to WebP and stored in the database (stateless, serverless-friendly)
- Deployed on **Vercel** (Functions, region `sin1`)

## Demo accounts

| Role | Email | Password |
|---|---|---|
| User | `user@fooddash.app` | `User@1234` |
| Admin | `admin@fooddash.app` | `Admin@1234` |

## Project structure

```
├── index.js              # entry: exports the app (Vercel) / starts the server locally
├── app.js                # express app: security middleware, routes, error handling
├── config/               # env validation, Prisma client, CORS options
├── routes/               # route definitions per module (auth, restaurants, orders, admin, ...)
├── controllers/          # request handlers: read input, call services/DB, send response
├── services/             # business logic (order placement, analytics aggregation)
├── middleware/           # authenticate, authorize(role), validate(zod), upload, rate limit, errors
├── validators/           # zod schemas for bodies, params and queries
├── utils/                # ApiError, pagination/sorting, JWT, slugs, serializers
├── prisma/
│   ├── schema.prisma     # data model
│   ├── migrations/       # SQL migrations
│   ├── seed.js           # deterministic seed (users, restaurants, menus, orders, reviews, blog)
│   └── data/             # seed content (dishes from TheMealDB + hand-written copy)
└── scripts/fetch-meals.js  # refreshes prisma/data/meals.json from TheMealDB
```

## Data model

`User` 1–N `Restaurant` 1–N `MenuItem` · `User` 1–N `Order` 1–N `OrderItem` N–1 `MenuItem` (orders ↔ dishes is many-to-many through `OrderItem`, which keeps a price snapshot) · `Restaurant` N–1 `Category` · `Review` (one per user per restaurant) · `BlogPost` · `ContactMessage` · `NewsletterSubscriber` · `Image` (uploaded files, 1–1 with `User.avatar`).

## Getting started

```bash
# 1. install
npm install

# 2. start a local Postgres (or use any Postgres URL)
docker run -d --name fooddash-pg -e POSTGRES_USER=fooddash -e POSTGRES_PASSWORD=fooddash_dev_pw \
  -e POSTGRES_DB=fooddash -p 127.0.0.1:5436:5432 postgres:17-alpine

# 3. configure
cp .env.example .env   # set DATABASE_URL and JWT_SECRET

# 4. create tables and seed data
npx prisma migrate dev
npm run db:seed

# 5. run
npm run dev            # http://localhost:5000
```

### Environment variables

| Name | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (direct; used for migrations) |
| `DATABASE_URL_POOLED` | Optional pooled connection string, preferred at runtime when present |
| `JWT_SECRET` | Secret for signing tokens (≥ 32 characters) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `1d` |
| `CLIENT_URLS` | Comma-separated frontend origins allowed by CORS |
| `PORT` | Local port (default `5000`) |

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start with auto-reload (nodemon) |
| `npm start` | Start the server |
| `npm run db:migrate` | Create/apply migrations in development |
| `npm run db:deploy` | Apply migrations in production |
| `npm run db:seed` | Reset and seed the database |

## API reference

All routes are prefixed with `/api`. Responses use one envelope:

```json
{ "success": true, "message": "optional", "data": {}, "meta": { "page": 1, "limit": 12, "total": 23, "totalPages": 2 } }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "…", "details": [{ "field": "email", "message": "…" }] } }
```

Status codes: `200` OK · `201` Created · `400` Bad request · `401` Unauthorized (`TOKEN_EXPIRED` / `INVALID_TOKEN`) · `403` Forbidden · `404` Not found · `409` Conflict · `422` Validation error · `429` Too many requests · `500` Server error.

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create account | – |
| POST | `/auth/login` | Log in, returns JWT | – |
| GET | `/auth/me` | Current user | User |
| PATCH | `/users/me` | Update profile | User |
| PATCH | `/users/me/password` | Change password | User |
| POST | `/users/me/avatar` | Upload profile photo (multipart `image`) | User |
| GET | `/users/me/reviews` | My reviews | User |
| GET | `/restaurants` | List approved restaurants: `search`, `category`, `city`, `minRating`, `priceLevel`, `maxDeliveryTime`, `vegan`, `featured`, `sort` (`rating`, `price`, `deliveryTime`, `newest`, `popular`, `name` + `:asc/desc`), `page`, `limit` | – |
| GET | `/restaurants/:slug` | Details with menu, reviews, rating distribution, related | – |
| POST | `/restaurants` | Create listing (PENDING until approved) | User |
| GET | `/restaurants/mine` | My restaurants (search, status, sort, pagination) | User |
| GET | `/restaurants/manage/:id` | Full record for editing | Owner/Admin |
| PATCH / DELETE | `/restaurants/:id` | Update / delete listing | Owner/Admin |
| POST | `/restaurants/:id/menu-items` | Add dish | Owner/Admin |
| PATCH / DELETE | `/menu-items/:id` | Update / delete dish | Owner/Admin |
| GET | `/menu-items/popular` | Popular dishes | – |
| GET / POST | `/restaurants/:id/reviews` | List / write review | – / User |
| GET | `/reviews/top` | Recent 5★ reviews | – |
| POST | `/orders` | Place order (prices taken from DB) | User |
| GET | `/orders/mine` | My orders (search, status, sort, pagination) | User |
| GET | `/orders/:id` | Order details | Customer/Owner/Admin |
| PATCH | `/orders/:id/cancel` | Cancel a pending order | User |
| GET | `/categories` | Cuisines with restaurant counts | – |
| GET | `/stats` | Public platform statistics | – |
| GET | `/blog`, `/blog/:slug` | Blog list (tag, search) / article | – |
| POST | `/contact` | Contact form (stored in DB) | – |
| POST | `/newsletter` | Subscribe | – |
| POST | `/uploads` | Upload an image (multipart `image`) | User |
| GET | `/images/:id` | Serve an uploaded image | – |
| GET | `/dashboard/user` | User overview cards + chart data | User |
| GET | `/dashboard/admin` | Platform overview cards + chart data | Admin |
| GET / PATCH / DELETE | `/admin/users[/:id]` | Manage users (role, block) | Admin |
| GET | `/admin/restaurants` | All restaurants with filters | Admin |
| PATCH | `/admin/restaurants/:id/status` | Approve / reject / feature | Admin |
| GET | `/admin/orders` | All orders | Admin |
| PATCH | `/admin/orders/:id/status` | Advance order status | Admin |
| POST / PATCH / DELETE | `/admin/categories[/:id]` | Manage cuisines | Admin |
| GET / PATCH / DELETE | `/admin/messages[/:id]` | Contact inbox | Admin |

## Security

- Passwords hashed with bcrypt (cost 12); login errors don't reveal whether an email exists
- JWTs expire (`JWT_EXPIRES_IN`); expired tokens return `401 TOKEN_EXPIRED`
- `authorize("ADMIN")` guards admin routes; owners can only modify their own restaurants and menus
- Every input is validated with zod; unknown fields are stripped
- helmet security headers, CORS allow-list, rate limits on auth and public forms

## Credits

Dish names and photos: [TheMealDB](https://www.themealdb.com). Restaurant names and profiles are fictional.
