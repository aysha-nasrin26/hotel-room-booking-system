import uuid
from datetime import date

import pytest
from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


# ---------------------------------------------------------
# ROOM TESTS
# ---------------------------------------------------------

def create_test_room():
    room_number = f"TEST-{uuid.uuid4().hex[:6]}"

    payload = {
        "room_number": room_number,
        "room_type": "Single",
        "price_per_night": 2500,
        "capacity": 1
    }

    response = client.post("/rooms", json=payload)

    assert response.status_code in [200, 201]

    room_id = response.json()["data"]["id"]

    return room_id, room_number


def delete_test_room(room_id):
    client.delete(f"/rooms/{room_id}")


def test_get_rooms():
    response = client.get("/rooms")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_room_by_id():
    room_id, room_number = create_test_room()

    try:
        response = client.get(f"/rooms/{room_id}")

        assert response.status_code == 200

        data = response.json()

        assert data["id"] == room_id
        assert data["room_number"] == room_number
        assert "room_type" in data
        assert "price_per_night" in data
        assert "capacity" in data
        assert "status" in data

    finally:
        delete_test_room(room_id)


def test_get_non_existing_room():
    response = client.get("/rooms/99999999")

    assert response.status_code == 404


def test_create_room():
    room_id, room_number = create_test_room()

    try:
        response = client.get(f"/rooms/{room_id}")

        assert response.status_code == 200
        assert response.json()["room_number"] == room_number

    finally:
        delete_test_room(room_id)


def test_create_room_invalid_price():
    payload = {
        "room_number": f"TEST-{uuid.uuid4().hex[:6]}",
        "room_type": "Single",
        "price_per_night": 0,
        "capacity": 1
    }

    response = client.post("/rooms", json=payload)

    assert response.status_code == 422


def test_create_room_invalid_capacity():
    payload = {
        "room_number": f"TEST-{uuid.uuid4().hex[:6]}",
        "room_type": "Single",
        "price_per_night": 2500,
        "capacity": 0
    }

    response = client.post("/rooms", json=payload)

    assert response.status_code == 422


def test_create_room_invalid_room_type():
    payload = {
        "room_number": f"TEST-{uuid.uuid4().hex[:6]}",
        "room_type": "InvalidType",
        "price_per_night": 2500,
        "capacity": 1
    }

    response = client.post("/rooms", json=payload)

    assert response.status_code == 422


def test_update_room():
    room_id, room_number = create_test_room()

    try:
        payload = {
            "room_number": room_number,
            "room_type": "Deluxe",
            "price_per_night": 5000,
            "capacity": 3
        }

        response = client.put(f"/rooms/{room_id}", json=payload)

        assert response.status_code == 200

        data = response.json()

        assert data["room_type"] == "Deluxe"
        assert data["price_per_night"] == 5000
        assert data["capacity"] == 3

    finally:
        delete_test_room(room_id)


def test_partial_update_room():
    room_id, room_number = create_test_room()

    try:
        payload = {
            "price_per_night": 3500
        }

        response = client.patch(
            f"/rooms/{room_id}",
            json=payload
        )

        assert response.status_code == 200

        data = response.json()

        assert data["price_per_night"] == 3500
        assert data["room_number"] == room_number

    finally:
        delete_test_room(room_id)


def test_update_non_existing_room():
    payload = {
        "price_per_night": 3000
    }

    response = client.patch(
        "/rooms/99999999",
        json=payload
    )

    assert response.status_code == 404


def test_delete_room():
    room_id, room_number = create_test_room()

    response = client.delete(f"/rooms/{room_id}")

    assert response.status_code == 204

    check_response = client.get(f"/rooms/{room_id}")

    assert check_response.status_code == 404


def test_delete_non_existing_room():
    response = client.delete("/rooms/99999999")

    assert response.status_code == 404


# ---------------------------------------------------------
# BOOKING TESTS
# ---------------------------------------------------------

def create_booking_test_data():
    room_id, room_number = create_test_room()

    payload = {
        "room_id": room_id,
        "user_id": 10001,
        "check_in": "2099-01-10",
        "check_out": "2099-01-15"
    }

    response = client.post("/bookings", json=payload)

    assert response.status_code == 201

    booking_id = response.json()["id"]

    return room_id, booking_id


def test_create_booking():
    room_id, room_number = create_test_room()

    try:
        payload = {
            "room_id": room_id,
            "user_id": 10001,
            "check_in": "2099-02-01",
            "check_out": "2099-02-05"
        }

        response = client.post("/bookings", json=payload)

        assert response.status_code == 201

        data = response.json()

        assert data["room_id"] == room_id
        assert data["user_id"] == 10001
        assert data["is_cancelled"] is False

    finally:
        delete_test_room(room_id)


def test_booking_invalid_dates():
    room_id, room_number = create_test_room()

    try:
        payload = {
            "room_id": room_id,
            "user_id": 10001,
            "check_in": "2099-03-10",
            "check_out": "2099-03-05"
        }

        response = client.post("/bookings", json=payload)

        assert response.status_code == 400

    finally:
        delete_test_room(room_id)


def test_booking_non_existing_room():
    payload = {
        "room_id": 99999999,
        "user_id": 10001,
        "check_in": "2099-04-01",
        "check_out": "2099-04-05"
    }

    response = client.post("/bookings", json=payload)

    assert response.status_code == 404


def test_overlapping_booking():
    room_id, room_number = create_test_room()

    try:
        first_booking = {
            "room_id": room_id,
            "user_id": 10001,
            "check_in": "2099-05-01",
            "check_out": "2099-05-05"
        }

        first_response = client.post(
            "/bookings",
            json=first_booking
        )

        assert first_response.status_code == 201

        second_booking = {
            "room_id": room_id,
            "user_id": 10002,
            "check_in": "2099-05-03",
            "check_out": "2099-05-07"
        }

        second_response = client.post(
            "/bookings",
            json=second_booking
        )

        assert second_response.status_code == 409

    finally:
        delete_test_room(room_id)


# ---------------------------------------------------------
# AVAILABILITY TESTS
# ---------------------------------------------------------

def test_room_availability():
    room_id, room_number = create_test_room()

    try:
        response = client.get(
            f"/rooms/{room_id}/availability",
            params={
                "check_in": "2099-06-01",
                "check_out": "2099-06-05"
            }
        )

        assert response.status_code == 200

        data = response.json()

        assert data["room_id"] == room_id
        assert "is_available" in data
        assert "conflicting_bookings_count" in data

    finally:
        delete_test_room(room_id)


def test_availability_non_existing_room():
    response = client.get(
        "/rooms/99999999/availability",
        params={
            "check_in": "2099-06-01",
            "check_out": "2099-06-05"
        }
    )

    assert response.status_code == 404


# ---------------------------------------------------------
# BOOKING HISTORY
# ---------------------------------------------------------

def test_booking_history():
    response = client.get("/bookings/history")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


# ---------------------------------------------------------
# BOOKING SUMMARY
# ---------------------------------------------------------

def test_booking_summary():
    response = client.get("/bookings/summary")

    assert response.status_code == 200

    data = response.json()

    assert "metrics" in data
    assert "total_reservations_processed" in data["metrics"]
    assert "active_reservations" in data["metrics"]
    assert "cancelled_reservations" in data["metrics"]
    assert "popular_room_id" in data["metrics"]


# ---------------------------------------------------------
# CANCEL BOOKING
# ---------------------------------------------------------

def test_cancel_booking():
    room_id, room_number = create_test_room()

    try:
        payload = {
            "room_id": room_id,
            "user_id": 10001,
            "check_in": "2099-07-01",
            "check_out": "2099-07-05"
        }

        create_response = client.post(
            "/bookings",
            json=payload
        )

        assert create_response.status_code == 201

        booking_id = create_response.json()["id"]

        cancel_response = client.patch(
            f"/bookings/{booking_id}/cancel"
        )

        assert cancel_response.status_code == 200

        data = cancel_response.json()

        assert data["id"] == booking_id
        assert data["is_cancelled"] is True

    finally:
        delete_test_room(room_id)


def test_cancel_non_existing_booking():
    response = client.patch(
        "/bookings/99999999/cancel"
    )

    assert response.status_code == 404