# Hotel Room Booking System

A full-stack Hotel Room Booking System developed as part of the internship project. The application is designed to manage hotel rooms, room availability, and customer bookings through a web-based interface and RESTful backend APIs.

## Project Overview

The Hotel Room Booking System provides functionality for managing hotel room information and booking operations.

The backend is developed using FastAPI with PostgreSQL and SQLAlchemy. The frontend is developed using HTML, CSS, and JavaScript.

The current backend provides RESTful APIs for:

- Creating rooms
- Viewing all rooms
- Viewing a room by ID
- Updating room information
- Checking room availability
- Creating bookings
- Viewing booking history
- Cancelling bookings
- Viewing booking summary
- Deleting rooms

The backend also includes automated API tests using Pytest.

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive UI

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic

### Database

- PostgreSQL
- SQLAlchemy ORM

### Testing

- Pytest
- FastAPI TestClient

## Project Structure

```text
Hotel_Room_Booking_System/
│
├── README.md
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── requirements.txt
│   ├── API_DOCUMENTATION.md
│   │
│   └── tests/
│       └── test_room.py
│
└── frontend/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── app.js

Backend Features
Room Management
The backend supports:
- Create room
- Get all rooms
- Get room by ID
- Update room
- Delete room
- Check room availability
Booking Management
The backend supports:
- Create booking
- Check booking date conflicts
- View booking history
- Filter booking history by user
- Exclude cancelled bookings
- Cancel booking
- View booking summary
Validation
Pydantic schemas are used for request validation.
The backend validates:
- Required fields
- Room type
- Positive room price
- Positive room capacity
- Booking dates
- Room existence
- Booking conflicts
Database
PostgreSQL is used as the relational database.
SQLAlchemy ORM is used to communicate with PostgreSQL.
The main database models are:
Room
Stores:
- ID
- Room number
- Room type
- Price per night
- Capacity
- Status
- Created date
Booking
Stores:
- Booking ID
- Room ID
- User ID
- Check-in date
- Check-out date
- Cancellation status
A relationship is maintained between rooms and bookings using a foreign key.
API Documentation
Detailed API documentation is available in:
backend/API_DOCUMENTATION.md

FastAPI also provides interactive API documentation through Swagger UI.
After starting the backend server, open:
http://127.0.0.1:8002/docs

Alternative documentation:
http://127.0.0.1:8002/redoc

Backend Setup
1. Clone the Repository
git clone YOUR_GITHUB_REPOSITORY_URL

Navigate to the project:
cd Hotel_Room_Booking_System

Navigate to the backend:
cd backend

2. Create Virtual Environment
Windows:
python -m venv venv

Activate the virtual environment:
venv\Scripts\activate

3. Install Dependencies
pip install -r requirements.txt

4. Configure Database
Create a .env file inside the backend directory.
Example:
DATABASE_URL=your_postgresql_database_url

Do not commit actual database credentials to GitHub.
5. Run the Backend
uvicorn main:app --reload

The backend will be available at:
http://127.0.0.1:8002

Running Tests
Navigate to the backend directory and run:
pytest

The current backend test suite contains 22 API tests.
Expected result:
22 passed

The tests cover:
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
- Error handling

Booking Conflict Detection
The system prevents overlapping active bookings for the same room.
The conflict condition is:
existing_check_in < requested_check_out
AND
existing_check_out > requested_check_in

Cancelled bookings are excluded from conflict detection.
This allows a new booking to begin on the same date that an earlier booking ends.

Error Handling
The API uses standard HTTP status codes.
Status Code	Description
200	Successful request
201	Resource created
204	Resource deleted successfully
400	Invalid request
404	Resource not found
409	Booking conflict
422	Validation error


Security Considerations
Database configuration is stored using environment variables instead of hard-coding credentials in source code.
Pydantic validation is used to validate API input.
SQLAlchemy ORM is used for database operations.
Authentication and authorization are not included in the current implementation and can be added as a future enhancement.

Frontend
The frontend is built using:
- HTML
- CSS
- JavaScript
The frontend contains multiple views for room management, booking operations, and booking management.
The frontend was developed as a responsive web interface.
Frontend and backend integration will use REST API communication through JavaScript asynchronous requests.

Current Project Status
Completed
- Frontend pages
- Room management UI
- Booking UI
- Booking management UI
- FastAPI backend
- PostgreSQL database
- SQLAlchemy models
- REST APIs
- Validation
- Error handling
- API testing
- API documentation

Future Enhancements
- Frontend and backend integration
- Authentication and authorization
- Improved booking status management
- Deployment to a public hosting platform
- Logging and monitoring
- Additional automated frontend and integration tests

Author
Aysha Nasrin
BCA Graduate | Full Stack Python Developer

License
This project was developed as part of an internship project for educational and practical development purposes.