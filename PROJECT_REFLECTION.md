# Project Reflection — Hotel Room Booking System

## 1. Introduction
The Hotel Room Booking System is a full-stack application for room and booking operations. It uses a JavaScript frontend, FastAPI REST APIs, SQLAlchemy, and PostgreSQL. Week 6 focused on deployment, maintenance planning, UAT, and reflection.

## 2. What went well
- The FastAPI backend was deployed as a public Render web service.
- A hosted PostgreSQL database was connected using an environment variable.
- The frontend was deployed separately as a Render Static Site.
- FastAPI Swagger UI remained available for API inspection and testing.
- Room-management and booking flows were tested on the deployed site.
- Separate services made the frontend/backend API connection explicit.

## 3. Challenges and investigation
### Root URL returned 404
The backend process was running, but `/` returned `404 Not Found`. The `/docs` page and `/rooms` endpoint were used to verify actual routes. This showed that the root URL alone does not determine whether an API service is operational.

### Frontend/backend connection and CORS
The browser initially showed a fetch/CORS error when the frontend called the deployed backend. The API base URL and CORS configuration were reviewed. The allowed origin was narrowed to the deployed frontend domain, and the frontend was refreshed and retested. The room creation flow was later reported successful.

### Separate service URLs
The frontend and backend have different Render URLs because they are separate services. The frontend sends API requests to the backend; this is expected in this architecture.

## 4. Lessons learned
- Deployment success messages should be followed by route-level smoke tests.
- Production code must use deployed API URLs rather than local development addresses.
- CORS should be limited to approved frontend origins.
- CORS is not authentication; server-side access control must be reviewed separately.
- Environment variables help keep credentials out of source code.
- UAT should test invalid input and booking conflicts as well as successful actions.
- Backend logs and browser developer tools help diagnose different parts of a failure.

## 5. Improvements for future work
- Implement authentication and authorization for room-management write operations before public real-world use.
- Add consistent transaction rollback and safe error handling for database failures.
- Validate date ranges in all relevant endpoints, including availability.
- Add automated integration and end-to-end tests.
- Document and test database backup restoration.
- Add monitoring and a repeatable deployment smoke-test checklist.
- Ensure public errors do not expose stack traces, credentials, or sensitive data.

## 6. Conclusion
The Week 6 work provided practical experience in deploying a full-stack app, connecting a hosted database, integrating a static frontend with a REST API, troubleshooting CORS and route errors, and planning maintenance. Before treating the project as production-ready for real customers, access control, database error handling, test evidence, and backup procedures should be completed and verified.
