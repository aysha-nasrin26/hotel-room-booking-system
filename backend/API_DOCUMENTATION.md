# Hotel Room Booking System - API Documentation

## 1. Project Overview

The Hotel Room Booking System is a RESTful backend application developed using FastAPI, PostgreSQL, and SQLAlchemy.

The backend provides APIs for managing hotel rooms, creating and managing bookings, checking room availability, viewing booking history, and generating booking summary information.

## 2. Technology Stack

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- Pytest
- Uvicorn

## 3. Base URL

For local development:

http://127.0.0.1:8000

FastAPI interactive API documentation:

http://127.0.0.1:8000/docs

Alternative API documentation:

http://127.0.0.1:8000/redoc

---

# 4. API Endpoints

## 4.1 Create Room

### Endpoint

POST `/rooms`

### Description

Creates a new hotel room and stores the room information in the database.

### Request Body

```json
{
  "room_number": "101",
  "room_type": "Single",
  "price_per_night": 1500,
  "capacity": 1
}
Allowed Room Types
- Single
- Double
- Deluxe
- Suite
Validation
- room_number is required.
- room_type must be one of the supported room types.
- price_per_night must be greater than 0.
- capacity must be greater than 0.
Successful Response
{
  "message": "Room Added Successfully!",
  "data": {
    "id": 1
  }
}

Status Code
200 OK

4.2 Get All Rooms
Endpoint
GET /rooms
Description
Returns a list of rooms stored in the database.
Query Parameters
- skip - Number of records to skip. Default: 0
- limit - Maximum number of records to return. Default: 10
Example
GET /rooms?skip=0&limit=10
Successful Response
[
  {
    "id": 1,
    "room_number": "101",
    "room_type": "Single",
    "price_per_night": 1500.0,
    "capacity": 1,
    "status": "AVAILABLE"
  }
]

Status Code
200 OK

4.3 Get Room by ID
Endpoint
GET /rooms/{room_id}
Description
Returns the details of a specific room using its ID.
Path Parameter
- room_id - Unique ID of the room.
Example
GET /rooms/1
Successful Response
{
  "id": 1,
  "room_number": "101",
  "room_type": "Single",
  "price_per_night": 1500.0,
  "capacity": 1,
  "status": "AVAILABLE"
}

Room Not Found
{
  "detail": "Room with id 999 not found"
}

Status Code
404 Not Found

4.4 Check Room Availability
Endpoint
GET /rooms/{room_id}/availability
Description
Checks whether a room is available for a specific date range.
Query Parameters
- check_in - Check-in date in YYYY-MM-DD format.
- check_out - Check-out date in YYYY-MM-DD format.
Example
GET /rooms/1/availability?check_in=2026-10-10&check_out=2026-10-12
Successful Response
{
  "room_id": 1,
  "is_available": true,
  "conflicting_bookings_count": 0
}

Availability Logic
A room is considered unavailable when an existing non-cancelled booking overlaps the requested date range.
The overlap condition used by the API is:
existing_check_in < requested_check_out
AND
existing_check_out > requested_check_in

The check-out date is treated as the end of the booking range, allowing another booking to start on the same date as the previous booking's check-out date.
Room Not Found
Status Code:
404 Not Found

4.5 Create Booking
Endpoint
POST /bookings
Description
Creates a new booking for an available room.
Request Body
{
  "room_id": 1,
  "user_id": 101,
  "check_in": "2026-10-10",
  "check_out": "2026-10-12"
}

Validation
- The specified room must exist.
- Check-out date must be after check-in date.
- The selected room must not have another active booking for the requested date range.
Successful Response
{
  "id": 1,
  "room_id": 1,
  "user_id": 101,
  "check_in": "2026-10-10",
  "check_out": "2026-10-12",
  "is_cancelled": false,
  "room": {
    "room_number": "101",
    "room_type": "Single",
    "price_per_night": 1500.0
  }
}

Error Responses
If the room does not exist:
404 Not Found
If the check-out date is not after the check-in date:
400 Bad Request
If the room is already booked for the selected date range:
409 Conflict
Status Code
201 Created

4.6 Get Booking History
Endpoint
GET /bookings/history
Description
Returns booking history stored in the database.
Query Parameters
- user_id - Optional user ID used to filter bookings.
- include_cancelled - Optional boolean value. Default: true.
Examples
Get all booking history:
GET /bookings/history
Get bookings for a specific user:
GET /bookings/history?user_id=101
Exclude cancelled bookings:
GET /bookings/history?include_cancelled=false
Successful Response
[
  {
    "id": 1,
    "room_id": 1,
    "user_id": 101,
    "check_in": "2026-10-10",
    "check_out": "2026-10-12",
    "is_cancelled": false,
    "room": {
      "room_number": "101",
      "room_type": "Single",
      "price_per_night": 1500.0
    }
  }
]

Status Code
200 OK

4.7 Get Booking Summary
Endpoint
GET /bookings/summary
Description
Returns summary information about the bookings stored in the database.
Successful Response
{
  "metrics": {
    "total_reservations_processed": 5,
    "active_reservations": 4,
    "cancelled_reservations": 1,
    "popular_room_id": 2
  }
}

Summary Metrics
- total_reservations_processed - Total number of bookings.
- active_reservations - Number of bookings that are not cancelled.
- cancelled_reservations - Number of cancelled bookings.
- popular_room_id - Room ID with the highest number of active bookings.
Status Code
200 OK

4.8 Full Room Update
Endpoint
PUT /rooms/{room_id}
Description
Updates the room information using a complete room payload.
Path Parameter
- room_id - ID of the room to update.
Request Body
{
  "room_number": "101",
  "room_type": "Deluxe",
  "price_per_night": 2500,
  "capacity": 2
}

Room Not Found
Status Code:
404 Not Found
Successful Response
Returns the updated room information.
Status Code
200 OK

4.9 Partial Room Update
Endpoint
PATCH /rooms/{room_id}
Description
Updates selected room fields without requiring all room information.
Request Body
Example:
{
  "room_type": "Deluxe",
  "price_per_night": 2500
}

Supported Fields
- room_number
- room_type
- price_per_night
- capacity
- status
Validation
- price_per_night must be greater than 0 when provided.
- capacity must be greater than 0 when provided.
- room_type must be a supported room type when provided.
Successful Response
Returns the updated room information.
Status Code
200 OK

4.10 Cancel Booking
Endpoint
PATCH /bookings/{booking_id}/cancel
Description
Cancels an existing booking by marking it as cancelled.
Path Parameter
- booking_id - ID of the booking to cancel.
Successful Response
{
  "id": 1,
  "room_id": 1,
  "user_id": 101,
  "check_in": "2026-10-10",
  "check_out": "2026-10-12",
  "is_cancelled": true,
  "room": {
    "room_number": "101",
    "room_type": "Single",
    "price_per_night": 1500.0
  }
}

Error Responses
Booking does not exist:
404 Not Found
Booking is already cancelled:
400 Bad Request
Status Code
200 OK

4.11 Delete Room
Endpoint
DELETE /rooms/{room_id}
Description
Deletes a room from the database.
Path Parameter
- room_id - ID of the room to delete.
Successful Response
No response body is returned.
Status Code
204 No Content
Room Not Found
404 Not Found
5. Error Handling
The API uses appropriate HTTP status codes to communicate errors.
Status Code	Meaning
200	Successful request
201	Resource successfully created
204	Resource successfully deleted
400	Invalid request or business rule violation
404	Requested resource not found
409	Conflict, such as overlapping booking
422	Request validation error


FastAPI and Pydantic validation are used to validate request data before processing.
6. Database Interaction
The application uses PostgreSQL as the relational database and SQLAlchemy as the ORM.
Main database tables:
Rooms
Stores hotel room information such as:
- Room ID
- Room number
- Room type
- Price per night
- Capacity
- Status
- Created date
Bookings
Stores booking information such as:
- Booking ID
- Room ID
- User ID
- Check-in date
- Check-out date
- Cancellation status
The Booking model has a foreign key relationship with the Room model.
7. API Validation
Pydantic schemas are used for request validation.
Examples of validation include:
- Positive room price
- Positive room capacity
- Valid room types
- Valid date values
- Check-out date after check-in date
- Required request fields
Invalid requests are rejected with appropriate HTTP error responses.
8. Booking Conflict Detection
The system prevents overlapping active bookings for the same room.
The booking conflict condition is:
existing_check_in < requested_check_out
AND
existing_check_out > requested_check_in

Cancelled bookings are excluded from conflict detection.
This ensures that the same room cannot be booked by multiple users for overlapping dates.
9. Testing
The backend API is tested using:
- Pytest
- FastAPI TestClient
The test suite covers:
- Room creation
- Room retrieval
- Invalid room data
- Room updates
- Room deletion
- Booking creation
- Invalid booking dates
- Non-existing rooms
- Booking conflicts
- Room availability
- Booking history
- Booking summary
- Booking cancellation
- Error responses
Current test result:
22 passed

The complete test file is available in:
backend/tests/test_room.py

10. Running the Backend
Step 1 - Install dependencies
pip install -r requirements.txt

Step 2 - Configure environment variables
Create a .env file and configure the PostgreSQL database connection.
Example:
DATABASE_URL=your_postgresql_database_url

Do not commit actual database credentials or secrets to GitHub.
Step 3 - Start the FastAPI server
uvicorn main:app --reload

The server will run at:
http://127.0.0.1:8000

Step 4 - Open API documentation
Swagger UI:
http://127.0.0.1:8000/docs

ReDoc:
http://127.0.0.1:8000/redoc

11. Testing the API
Run the test suite from the backend directory:
pytest

Expected result:
22 passed

12. API Documentation Tools
FastAPI automatically generates interactive API documentation using OpenAPI.
Swagger UI allows developers to:
- View available endpoints
- View request parameters
- Enter request data
- Execute API requests
- View response data
- Test API functionality
ReDoc provides an alternative structured API documentation interface.
13. Security Considerations
The application uses environment variables for database configuration so database credentials are not hard-coded into the source code.
Input validation is handled through Pydantic schemas.
Database operations are handled through SQLAlchemy ORM.
Authentication and authorization are not implemented in the current version because they are outside the current project implementation scope. They can be added as a future enhancement.
14. Project Structure
backend/
│
├── main.py
├── models.py
├── schemas.py
├── database.py
├── requirements.txt
├── tests/
│   └── test_room.py
├── API_DOCUMENTATION.md
└── .env

The .env file contains local configuration and should not be committed to the public repository.
15. Conclusion
The Hotel Room Booking System backend provides RESTful APIs for room and booking management.
The application uses FastAPI for API development, PostgreSQL for data persistence, SQLAlchemy for database interaction, Pydantic for validation, and Pytest for API testing.
The backend supports CRUD operations, booking conflict detection, room availability checking, booking cancellation, booking history, and booking summary functionality.
The API can be tested interactively using FastAPI Swagger UI and automatically tested using the Pytest test suite.