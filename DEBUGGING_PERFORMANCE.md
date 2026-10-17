# Project Audit: Debugging Report & Performance Measurements

**Project:** Hotel Room Booking System  
**Week:** 5 — Testing, Debugging, Integration and Performance  
**Technology Stack:** JavaScript, FastAPI, Pydantic, SQLAlchemy, PostgreSQL, Jest, JSDOM and Cypress

## 1. Resolved Coding Defects

### Defect 1: Pydantic Schema Configuration Error

**Symptom:** Pytest failed during test collection with a `pydantic.errors.PydanticUserError`.

**Root cause:** In `schemas.py`, the `BookingResponse` model combined Pydantic v1's nested `class Config` with Pydantic v2's `model_config = ConfigDict(...)`, resulting in a configuration conflict.

**Resolution:**
- Removed the conflicting legacy `class Config` declaration.
- Standardized the affected schema configuration on Pydantic v2's `ConfigDict` approach.
- Reviewed the schema definitions and their dependencies.

**Outcome:** The configuration defect was addressed. Successful backend regression testing after the correction should be supported by the latest pytest output.

### Defect 2: Cypress Toast Notification Selector

**Symptom:** The end-to-end test timed out while waiting for the dynamic toast notification selector `#toastRegion.toast`.

**Root cause:** The selector targeted an element that had both the specified ID and class, rather than a toast element nested inside the container.

**Correction:**

Incorrect:

```javascript
cy.get('#toastRegion.toast')
```

Correct:

```javascript
cy.get('#toastRegion .toast')
```

**Outcome:** The selector was corrected to target child toast elements inside `#toastRegion`. The supplied audit reports that the Cypress end-to-end flows subsequently completed without failures.

## 2. API Performance Measurements

The following local response-time observations were reported during frontend-to-FastAPI-to-PostgreSQL integration testing.

| Endpoint | Operation | Observed latency | Reported status |
|---|---|---:|---|
| `GET /rooms?limit=100&skip=0` | Retrieve a paginated list of room records | 48.50 ms | Green — reported |
| `GET /bookings/history` | Retrieve booking history | 62.10 ms | Green — reported |
| `GET /rooms/1/availability` | Check room availability and booking conflicts | 35.80 ms | Green — reported |

**Performance notes:**

- These figures represent reported local observations and may vary with database size, hardware, and system load.
- The room-list endpoint uses pagination, with a limit of up to 100 records.
- The recorded timings alone do not demonstrate a performance improvement; that requires comparable before-and-after measurements.
- The reported Green classifications are local assessment labels, not formal service-level guarantees.

## 3. Retest Validation Summary

### Frontend Functional Tests

**Test runner:** Jest with JSDOM

**Command:**

```bash
npx jest app.test.js
```

**Reported result:** 7/7 tests passed.

The functional tests cover room rendering, filtering, booking-night calculations, edit-form population, and error-handling behaviour.

### Browser End-to-End Tests

**Test runner:** Cypress

**Reported result:** The complete end-to-end flow was validated in a Chromium-based browser environment, with zero reported test failures.

The corrected toast selector supports notification checks during the workflow. Retain the actual Cypress terminal results or screenshots as submission evidence.

### Backend Regression Tests

The Pydantic configuration defect was addressed. To close the verification record, ensure the latest pytest run after the fix completed successfully and retain its output. An earlier successful run does not independently establish the result of the updated code.

## 4. Final Submission Checklist

- [x] Document the Pydantic schema configuration defect and correction.
- [x] Document the Cypress selector defect and correction.
- [x] Record the seven passing frontend functional tests.
- [x] Record the reported successful Cypress end-to-end flows.
- [x] Include the three reported API response-time observations.
- [ ] Confirm and retain successful backend pytest output after the schema fix.
- [ ] Attach available test evidence and ensure README instructions match the current project.
- [ ] Exclude credentials, `.env` files, virtual environments, and generated cache folders from the submission package.

## 5. Conclusion

Week 5 focused on resolving application configuration and test-selector defects, validating frontend behaviour, checking browser-based end-to-end workflows, and recording local API response-time observations.

The reported frontend functional tests passed all seven specifications, and the supplied audit reports successful Cypress end-to-end validation. The identified Pydantic configuration issue and Cypress selector mismatch have been documented with their corrections.

The backend verification record should be finalized using the latest pytest output after the Pydantic fix. With that evidence retained alongside the Jest and Cypress results, the Week 5 report will provide a clear and auditable record of testing and debugging work.

**Author:** Aysha Nasrin  
**Project Repository:** https://github.com/aysha-nasrin26/hotel-room-booking-system