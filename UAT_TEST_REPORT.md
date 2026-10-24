# User Acceptance Testing (UAT) Report

## 1. Test environment
- Frontend: https://hotel-room-booking-frontend-757k.onrender.com/
- Backend API docs: https://hotel-room-booking-system-ja5q.onrender.com/docs
- Backend rooms endpoint: https://hotel-room-booking-system-ja5q.onrender.com/rooms
- Hosting: Render
- Database: PostgreSQL

## 2. Results reported by the project owner
The project owner reported successful live tests for:
- Room creation, update, and deletion
- Valid booking creation
- Rejection of invalid check-in/check-out ranges
- Rejection of overlapping bookings
- Booking history
- Booking cancellation and status update

Attach screenshots or execution records if required by the evaluator.

## 3. UAT checklist
| ID | Scenario | Expected result | Current record | Evidence |
|---|---|---|---|---|
| UAT-01 | Open frontend | UI loads | Passed (reported) | Add screenshot |
| UAT-02 | Open `/docs` | Swagger UI loads | Passed (reported) | Add screenshot |
| UAT-03 | List rooms | API returns room data | Passed (reported) | Add response |
| UAT-04 | Create room | Room saved and listed | Passed (reported) | Add screenshot |
| UAT-05 | Update room | Updated fields persist | Passed (reported) | Add screenshot |
| UAT-06 | Delete test room | Test room removed | Passed (reported) | Add screenshot |
| UAT-07 | Valid booking | Booking saved | Passed (reported) | Add screenshot |
| UAT-08 | Invalid date range | Request rejected | Passed (reported) | Add response |
| UAT-09 | Overlapping booking | Request rejected | Passed (reported) | Add response |
| UAT-10 | Booking history | Booking appears | Passed (reported) | Add screenshot |
| UAT-11 | Cancel booking | Cancellation status changes | Passed (reported) | Add screenshot |
| UAT-12 | Console/Network | No unresolved CORS/network errors after final test | Retest after latest CORS change | Add screenshot |

## 4. Limitations
- This is a manual UAT record; it does not claim automated end-to-end browser tests passed.
- The code review found no authentication/authorization dependency on the room write endpoints shown in `main.py`. Do not describe the application as fully secured for unrestricted public use until access control is addressed.
- Add actual screenshots, timestamps, and API responses if the evaluator requires evidence.
