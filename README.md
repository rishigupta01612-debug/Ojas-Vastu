# Ojas Numerology & Vastu

A React/Vite frontend and Node.js/Express backend for numerology and Vastu consultations.

## Project structure

- `src/`: React frontend, components, calculator, API clients, and styles.
- `server/src/`: Express API, MongoDB model, controllers, routes, security middleware, and external services.
- `server/test/`: Backend API and unit tests.
- `Pasted code.html`: Original source reference retained in the repository.

## Frontend setup

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and uses `VITE_API_URL` for backend requests.

Useful commands:

```bash
npm run lint
npm run build
```

## Backend setup

```bash
cd server
npm install
npm run dev
```

The backend runs at `http://localhost:5000`.

From the project root, equivalent scripts are available:

```bash
npm run server:dev
npm run server:start
npm run server:test
npm run server:lint
```

Run the frontend and backend in separate terminals during development.

## Environment variables

Copy `server/.env.example` to `server/.env` and configure the services you intend to use. The root `.env.example` contains the frontend API URL.

Required for persistent production bookings:

- `MONGODB_URI`

Required for AI chat:

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL` (optional; defaults to `claude-sonnet-4-20250514`)

Required for Razorpay payments:

- `RAZORPAY_KEY_ID` (use a Test Mode key for test payments)
- `RAZORPAY_KEY_SECRET` (matching Test Mode secret)
- `RAZORPAY_WEBHOOK_SECRET` (for webhooks)

Required for booking confirmation emails:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `EMAIL_FROM`
- `ADMIN_EMAIL` (optional; receives a copy of each booking)

Booking requests are only reported as successful after the customer confirmation email has been sent. Configure the SMTP values in `server/.env` for local development and in the backend hosting provider's environment settings for production. Use the SMTP credentials or app password supplied by your email provider; do not put credentials in frontend variables.

No secret values are included in the repository. `server/.env` and root `.env` are ignored by Git.

## Database

MongoDB is accessed through Mongoose. The server starts in development without a configured database so health and validation routes can be tested, but booking persistence and availability return `503` until `MONGODB_URI` is configured and reachable.

Bookings have a unique database index on `dateKey` and `time`, preventing two requests from claiming the same slot concurrently.

## API endpoints

- `GET /api/health`
- `POST /api/chat`
- `POST /api/bookings`
- `GET /api/bookings/availability?date=YYYY-MM-DD`
- `POST /api/payment/create-order`
- `POST /api/payment/verify`
- `POST /api/payment/webhook`

Responses use `{ success: true, data: ... }` for success and `{ success: false, message: ... }` for errors.

## Payment flow

The server calculates service pricing from its own service map. The frontend cannot set the amount. A booking must exist before an order can be created. Razorpay payment signatures are verified server-side before the booking is marked paid and confirmed.

The booking flow opens Razorpay Checkout after a booking request has been stored. Use Test Mode API keys and configure the matching Razorpay test webhook secret when testing. The backend verifies checkout signatures and also processes signed `payment.captured` and `order.paid` webhooks so a captured payment can confirm the booking if the browser callback does not complete. After payment succeeds, the customer receives a confirmation email with a PDF payment invoice attached. If email delivery fails, the booking remains paid and a Razorpay webhook retry will retry the email.

## Security

The backend uses Helmet, CORS, request-size limits, rate limiting, Zod validation, centralized error responses, server-only API credentials, payment signature verification, and a timeout around Anthropic requests. Production errors do not expose stack traces or provider credentials.

## Tests

```bash
cd server
npm test
npm run lint
```

The test suite covers health, chat validation, booking validation, payment validation, duplicate-slot index protection, and Razorpay signature verification.

## Production deployment

1. Set `NODE_ENV=production` and configure `MONGODB_URI`.
2. Configure `FRONTEND_URL` to the deployed frontend origin.
3. Configure SMTP credentials (required for bookings), plus Anthropic and Razorpay credentials, through the deployment secret manager.
4. Run `npm run build` for the frontend.
5. Run `npm start` from `server/` for the API.
6. Serve the built frontend from the hosting provider or a static web server.
7. Configure the Razorpay webhook URL as `/api/payment/webhook` and its signing secret.
