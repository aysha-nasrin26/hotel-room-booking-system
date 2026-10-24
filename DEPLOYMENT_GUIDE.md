# Deployment Guide — Hotel Room Booking System

## 1. Architecture
| Component | Technology | Hosting |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Render Static Site |
| Backend | Python, FastAPI, Uvicorn, SQLAlchemy | Render Web Service |
| Database | PostgreSQL | Hosted PostgreSQL database |

### Public URLs
- Frontend: https://hotel-room-booking-frontend-757k.onrender.com/
- Backend Swagger UI: https://hotel-room-booking-system-ja5q.onrender.com/docs
- Backend room listing: https://hotel-room-booking-system-ja5q.onrender.com/rooms

Separate frontend and backend URLs are expected in this architecture. The frontend must call the deployed backend URL, not a local address such as `http://127.0.0.1:8002`.

## 2. Prerequisites
- GitHub repository: https://github.com/aysha-nasrin26/hotel-room-booking-system
- Render account connected to the repository
- Hosted PostgreSQL database accessible to the backend
- Python dependencies declared in the backend requirements file
- Source committed to the `main` branch

## 3. Database configuration
1. Create or select a PostgreSQL database in the hosting provider.
2. Copy the database connection string from the provider dashboard.
3. In the backend Render service, open **Environment**.
4. Set `DATABASE_URL` to the connection string.
5. Keep credentials in environment variables; never commit them to Git.
6. Redeploy the backend if the environment change does not trigger a deployment.
7. Check backend logs and test `GET /rooms`.

Do not put the actual database password in this document or screenshots. Rotate any credential that becomes exposed.

## 4. Deploy the FastAPI backend
1. In Render, choose **New → Web Service**.
2. Connect `aysha-nasrin26/hotel-room-booking-system` and select branch `main`.
3. Set **Root Directory** to `backend` if the service expects `main.py` and its Python modules there.
4. Set the build command to `pip install -r requirements.txt` if `requirements.txt` is in the backend root.
5. Set the start command to:
   `uvicorn main:app --host 0.0.0.0 --port 10000`
6. Add `DATABASE_URL` under Environment.
7. Deploy and wait for Render to report the service as live.
8. Open https://hotel-room-booking-system-ja5q.onrender.com/docs
9. Run `GET /rooms` from Swagger UI.

The logs showed Uvicorn starting on port `10000` and application startup completing. The root path `/` returned `404`; this can be expected if no root route is defined. Verify `/docs` and actual API routes instead of judging deployment only by `/`.

## 5. Deploy the frontend
1. In Render, choose **New → Static Site**.
2. Connect the same GitHub repository and select branch `main`.
3. Set **Root Directory** to `frontend`.
4. For a plain HTML/CSS/JavaScript frontend, leave the build command blank if no build step is needed.
5. Set **Publish Directory** to `.`.
6. Deploy and wait for the site to become live.
7. Open https://hotel-room-booking-frontend-757k.onrender.com/

## 6. Connect frontend to backend
1. Open the frontend JavaScript API file, `frontend/js/app.js`.
2. Confirm the API base URL is `https://hotel-room-booking-system-ja5q.onrender.com`.
3. Remove production references to `localhost` or `127.0.0.1`.
4. Save, commit, and push the change.
5. Wait for the frontend redeployment to finish.

## 7. Configure CORS
The allowed frontend origin should be:
`https://hotel-room-booking-frontend-757k.onrender.com`

Configure the backend CORS middleware to list this exact origin rather than `allow_origins=["*"]`. The current frontend was configured without cookie-based credentials; if that changes, review CORS and authentication settings.

**CORS is not authentication.** Restricting CORS does not prevent non-browser clients from calling public API endpoints. Room-management write endpoints need a separate access-control review before the app is considered fully secured for public production use.

## 8. Post-deployment verification
- [ ] Frontend UI loads.
- [ ] Backend `/docs` opens.
- [ ] `GET /rooms` responds.
- [ ] Room creation works with valid data.
- [ ] Room update works.
- [ ] Room deletion works using a test room.
- [ ] A valid booking can be created.
- [ ] Invalid date ranges are rejected.
- [ ] Overlapping active bookings are rejected.
- [ ] Booking history shows the booking.
- [ ] Cancellation updates booking status.
- [ ] Browser console has no unresolved CORS/network errors.
- [ ] Render logs have no unhandled errors for the tested flows.

## 9. Troubleshooting
### Frontend opens, but rooms do not load
Confirm the deployed backend URL in frontend code, open `/rooms` directly, inspect DevTools → Console/Network, and check backend logs.

### CORS error
Confirm the exact frontend origin is configured, with no path or trailing slash in the origin entry. Confirm the latest backend deployment is live. Inspect the failing request and backend logs; a server error can also appear as a fetch/CORS failure.

### `404 Not Found`
Check the URL path and HTTP method. `/` may return 404 if no root route exists. Use `/docs` to inspect actual routes.

### `500 Internal Server Error`
Inspect Render logs at the time of the request. Check database connectivity, required environment variables, schema compatibility, and database constraints. Do not expose stack traces or secrets in public responses.

### Database connection failure
Verify `DATABASE_URL`, database availability, and the PostgreSQL driver dependency. Never print credential-bearing connection strings in logs.

### Changes not visible
Confirm the commit was pushed to `main`, check Render deployment events, wait for deployment to finish, and hard-refresh the browser.

## 10. Completion note
The project owner reports that the services are deployed and room create/update/delete plus booking flows were tested. Keep only personally verified results marked as passed, and attach screenshots or API responses if the evaluator requires evidence.
