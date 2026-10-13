# Hotel Room Booking System

## Project Overview

The Hotel Room Booking System is a web application developed to manage hotel rooms and guest bookings. The application provides a single-page frontend with navigation between Room Catalog, Booking, and Booking Management sections.

The system allows users to view and manage rooms, create bookings, and manage existing booking records through an interactive web interface.

## Features

### Room Catalog

* View available hotel rooms
* Search rooms by room number
* Filter rooms by room type
* Filter rooms by room status
* Add new rooms
* Update room details
* Display room availability status

### Booking

* Select a room
* Enter guest details
* Select check-in and check-out dates
* View booking information
* Confirm bookings

### Booking Management

* View booking records
* View booking status
* Cancel bookings
* Manage room booking information

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Python
* FastAPI
* SQLAlchemy

### Database

* PostgreSQL

### Development Tools

* Visual Studio Code
* Git
* GitHub

## Project Structure

hotel-room-booking-system/

├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
│
└── README.md

## Frontend Development

The frontend was developed using HTML5, CSS3, and JavaScript.

The application follows a single-page layout with three main navigation sections:

1. Room Catalog
2. Booking
3. Booking Management

Users can navigate between these sections without opening separate HTML pages.

### HTML

HTML5 was used to create the structure of the application, including navigation, room cards, forms, tables, buttons, and booking-related sections.

### CSS

CSS3 was used for layout, styling, spacing, forms, buttons, room cards, tables, and responsive design.

Responsive media queries were implemented to make the interface usable on desktop, tablet, and mobile screen sizes.

### JavaScript

JavaScript was used to add interactivity to the application, including:

* Navigation between sections
* Room searching
* Room filtering
* Adding rooms
* Updating room information
* Booking interactions
* Modal forms
* Booking management
* Cancelling bookings
* Updating displayed information dynamically

## Backend Development

The backend was developed using Python and FastAPI.

FastAPI provides REST API endpoints for managing hotel rooms and bookings.

SQLAlchemy was used as the ORM layer to communicate with the PostgreSQL database.

The basic architecture follows:

Frontend
   ↓
JavaScript API Requests
   ↓
FastAPI
   ↓
SQLAlchemy
   ↓
PostgreSQL


The frontend communicates with the FastAPI backend through API requests. The backend processes the request, interacts with the database using SQLAlchemy, and returns the required response.

## Database

PostgreSQL is used as the persistent database for the application.

SQLAlchemy models are used to represent the application's database entities and their relationships.

The database stores information related to hotel rooms and bookings.

## Navigation

The application uses a single-page navigation system.

The three primary navigation sections are:

* Room Catalog — for viewing and managing rooms
* Booking — for creating new bookings
* Booking Management — for viewing and managing existing bookings

JavaScript is used to switch between these sections dynamically.

## Responsive Design

Responsive CSS media queries were used to ensure that the application adapts to different screen sizes.

The interface was tested on:

* Desktop
* Tablet
* Mobile

The layout, navigation, forms, room cards, and booking information were adjusted to remain usable across different screen sizes.

## Testing

The application was tested using common hotel management scenarios:

* Adding rooms
* Updating room information
* Searching for rooms
* Filtering rooms
* Creating bookings
* Viewing booking records
* Cancelling bookings
* Checking room availability
* Testing navigation
* Testing responsive layouts
* Testing frontend and backend API interaction

## How to Run

### Backend

Open the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
uvicorn main:app --reload --port 8002
```

The API will be available at:

```text
http://127.0.0.1:8002
```

FastAPI interactive documentation:

```text
http://127.0.0.1:8002/docs
```

### Frontend

Open the `frontend` folder and run `index.html` using a local development server such as VS Code Live Server.

## Future Improvements

The following features can be added in future versions:

* User authentication
* Role-based access
* Online payment integration
* Email booking confirmation
* Advanced dashboard analytics
* Improved booking validation
* Cloud deployment
* React-based frontend

## Conclusion

The Hotel Room Booking System demonstrates the development of a full-stack web application using HTML, CSS, JavaScript, FastAPI, SQLAlchemy, and PostgreSQL.

The project covers frontend interface development, single-page navigation, JavaScript interactivity, REST API development, database integration, room management, and booking management.

The project also provides a foundation for future improvements such as authentication, online payments, analytics, deployment, and migration of the frontend to React.
