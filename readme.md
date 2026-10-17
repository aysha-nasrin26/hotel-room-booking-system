# Hotel Room Booking System

A full-stack Hotel Room Booking System built using **HTML, CSS, JavaScript, Python, FastAPI, SQLAlchemy, and PostgreSQL**. This project provides a simple interface for browsing rooms, managing room information, and creating and managing hotel bookings.

## Project Overview

The Hotel Room Booking System connects a JavaScript frontend with a FastAPI backend and PostgreSQL database. It demonstrates REST API integration, database operations, input validation, booking management, and frontend functional testing.

## Features

### Room Catalog
- View available hotel rooms.
- Search and filter rooms.
- Display room information dynamically.
- Add and update room details through the supported backend APIs.

### Booking Management
- Create hotel bookings.
- View booking records and booking history.
- Cancel bookings.
- Check room availability before confirming a booking.
- Detect conflicting bookings through backend validation.

### User Interface
- Single-page interface with Room Catalog, Booking, and Booking Management sections.
- Responsive layout for different screen sizes.
- Dynamic room cards and form interactions.
- Toast notifications for user feedback.

### Backend and Database
- REST APIs developed using FastAPI.
- Request and response validation using Pydantic.
- SQLAlchemy ORM for database operations.
- PostgreSQL for persistent data storage.
- Swagger UI for API exploration and testing.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and responsive design |
| JavaScript | Frontend functionality and API integration |
| Python | Backend programming |
| FastAPI | REST API development |
| Pydantic | Request and response validation |
| SQLAlchemy | Database ORM |
| PostgreSQL | Relational database |
| Jest and JSDOM | Frontend functional testing |
| Cypress | Browser-based end-to-end testing |
| Git and GitHub | Version control and project hosting |

## Project Structure

```text
hotel-room-booking-system/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   └── js/
│       └── app.js
│
├── app.test.js
├── booking_flow.cy.js
├── README.md
└── .gitignore
```

*Note: The exact test-file locations may differ depending on the current repository structure.*

## Installation and Setup

### Prerequisites

Install the following before running the project:

- Python
- PostgreSQL
- Node.js and npm, for frontend testing
- Visual Studio Code
- VS Code Live Server extension

### 1. Clone the Repository

```bash
git clone https://github.com/aysha-nasrin26/hotel-room-booking-system.git
cd hotel-room-booking-system
```

### 2. Set Up the Backend

Open a terminal in the project directory and run:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 3. Configure PostgreSQL

1. Start your PostgreSQL server.
2. Create the database required by the application.
3. Configure the database connection using the settings expected by `backend/database.py`.
4. Ensure that your database credentials are correct.

**Security note:** Keep database passwords and other secrets out of source control. Use environment variables or an appropriate local configuration file if the application supports them.

### 4. Start the FastAPI Server

From the `backend` directory, run:

```bash
uvicorn main:app --reload --port 8002
```

The backend will be available at:

- **API base URL:** http://127.0.0.1:8002
- **Swagger API documentation:** http://127.0.0.1:8002/docs
- **ReDoc documentation:** http://127.0.0.1:8002/redoc

Use Swagger UI to inspect the available endpoints and test API requests.

### 5. Run the Frontend

1. Open the project in Visual Studio Code.
2. Open `frontend/index.html`.
3. Start the page using the Live Server extension.
4. Confirm that the frontend is running on the configured port, such as `5500`.
5. Ensure the API base URL in `frontend/js/app.js` matches the backend address.
6. If the browser reports CORS errors, verify the backend CORS configuration.

The frontend and backend must both be running for the complete application to work.

## Testing

### Frontend Functional Tests

Install the Node.js dependencies specified by the project's `package.json`, if present. From the project root, run:

```bash
npx jest app.test.js
```

The frontend functional tests cover areas such as:

- Dynamic room-card rendering.
- Room filtering.
- Booking-night calculations.
- Edit-room form values.
- Error handling and room-loading failures.

**Reported result:** Seven frontend functional tests passed in the local Jest run.

### Cypress End-to-End Tests

If Cypress and the project configuration are installed, open Cypress using:

```bash
npx cypress open
```

Then select:

1. **E2E Testing**
2. Your configured browser, such as Microsoft Edge
3. The `booking_flow.cy.js` specification

Run the test and verify the booking workflow in the browser. Record the final result only after the current test run completes successfully.

### API Testing

Open http://127.0.0.1:8002/docs to test the backend endpoints.

Verify room listing, room availability, booking creation, booking history, and cancellation using valid and invalid inputs.

## Debugging and Integration

During integration and testing, the following issues were identified for review:

- **Pydantic configuration:** A response schema mixed legacy Pydantic v1 `class Config` settings with Pydantic v2 `model_config`. The schema configuration was standardized to avoid conflicts.
- **Cypress toast selector:** The selector `#toastRegion.toast` was corrected to `#toastRegion .toast` to target a toast element inside its container.
- **Frontend and backend connectivity:** The frontend API URL, backend port, database connection, and request/response handling should be verified during local setup.

### API Response-Time Observations

The following timings were reported during local testing. They are environment-dependent observations, not production performance benchmarks.

| API operation | Reported response time |
|---|---:|
| `GET /rooms?limit=100&skip=0` | 48.50 ms |
| `GET /bookings/history` | 62.10 ms |
| `GET /rooms/1/availability` | 35.80 ms |

Response times may vary depending on the database contents, hardware, network conditions, and server configuration.

## 🔒 Best Practices

- Do not commit database passwords or private credentials.
- Keep the virtual environment and generated cache files out of Git.
- Validate API inputs and handle errors clearly.
- Test both successful and unsuccessful booking scenarios.
- Verify frontend and backend integration before submission.

## Future Improvements

- Add user registration and login.
- Introduce role-based access for administrators and customers.
- Add payment integration.
- Improve booking search and date selection.
- Add automated backend integration tests.
- Deploy the application to a cloud hosting platform.

## Learning Outcomes

This project provides practical experience in full-stack development, REST API integration, database connectivity, SQLAlchemy ORM, Pydantic validation, frontend testing, debugging, and technical documentation.

## Author

**Aysha Nasrin**

The project also provides a foundation for future improvements such as authentication, online payments, analytics, deployment, and migration of the frontend to React.

##Project video URL
https://drive.google.com/drive/folders/19vc6VRg5KZ5UIpKAXWiOMb40UN5R3vyG?usp=sharing
