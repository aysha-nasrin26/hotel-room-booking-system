# Maintenance Plan — Hotel Room Booking System

## 1. Purpose
This plan describes how to monitor, troubleshoot, secure, and update the application after deployment.

## 2. Monitoring and logging
- Review Render backend logs after deployments and when issues are reported.
- Record time, endpoint, HTTP status, symptoms, likely cause, fix, and retest result.
- Watch for repeated `4xx`/`5xx` responses, database failures, and failed deployments.
- Use browser DevTools Console and Network to investigate frontend errors.
- Never log passwords, database URLs with credentials, access tokens, or sensitive personal information.
- Return safe user-facing errors; keep technical details in protected logs.

### Incident record template
| Date/time | Component | Symptom/status | Cause | Fix | Retest |
|---|---|---|---|---|---|
| Fill in when an incident occurs | Frontend/API/DB | Observed issue | Confirmed or suspected | Action taken | Passed/Failed |

## 3. Error handling
- Validate booking dates and required fields before database writes.
- Reject overlapping active bookings with an appropriate client error.
- Return `404 Not Found` for missing room or booking IDs.
- Return suitable `400` or `422` responses for invalid input, consistent with the API contract.
- Handle database integrity failures safely: rollback the session and return a controlled response.
- Test error paths as well as successful operations after changes.

## 4. Database backups
- Check the database provider's backup and retention options and enable an appropriate policy.
- Before risky changes, take a backup or verify a recent recoverable backup exists.
- Periodically verify backups and document restoration steps.
- Do not assume backups are valid until a restore has been tested in a safe environment.
- Protect and rotate exposed database credentials.

## 5. Dependency and code updates
1. Make changes locally or on a development branch first.
2. Review dependency updates and security advisories.
3. Run backend tests, including date validation and overlap checks.
4. Run frontend tests and manually verify critical flows.
5. Commit changes with a descriptive message.
6. Push to GitHub and confirm Render redeploys the intended service.
7. Check deployment logs and run the smoke-test checklist.
8. If an update causes a serious issue, roll back to a known-good commit/deployment where supported, then investigate.

## 6. Environment and configuration
- Store `DATABASE_URL` and secrets in Render environment settings.
- Never commit `.env` files or credentials.
- Keep local and production URLs separate.
- Restrict CORS to approved frontend origins.
- Review access controls for write operations; CORS alone is not authorization.
- Use least-privilege access for hosting and database accounts.

## 7. Routine schedule
| Frequency | Activity |
|---|---|
| After every deployment | Check service status, logs, frontend, `/docs`, and `GET /rooms` |
| Weekly during active development | Review errors, test booking flows, check dependency updates |
| Monthly | Review access permissions, backup status, and unresolved issues |
| Before major changes | Back up data, run tests, prepare rollback plan |
| After an incident | Record cause, fix, retest, and preventive action |

## 8. Known improvements
- Add authentication and authorization for room-management operations before real public use.
- Validate date ranges in the availability endpoint too.
- Add robust rollback and controlled error handling around database writes.
- Add automated integration and end-to-end tests.
- Establish and test a database backup/restore process.
- Add repeatable deployment smoke tests.

## 9. Maintenance ownership
The maintainer is responsible for reviewing errors, testing updates, protecting secrets, verifying backups, and documenting incidents. For real customer data, assign explicit ownership for security, backups, and incident response.
