from fastapi import FastAPI, Depends, HTTPException, status, Response, Query
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from datetime import date
from database import engine, Base, SessionLocal, get_db
from models import Room, Booking
from schemas import RoomCreate as Rooms, RoomResponse, RoomUpdate
from schemas import BookingCreate, BaseModel, BookingResponse,RoomAvailabilityResponse
from typing import List, Optional

from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)
app = FastAPI()

#Create - POST
@app.post("/rooms")
def create_rooms(room: Rooms, db: Session = Depends(get_db)):
    new_room = Room(**room.model_dump())
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return{
        "message":"Room Added Successfully!",
        "data":{
            "id": new_room.id  # If your Model has an 'id' attribute
        }
    }
#Booking - POST
@app.post("/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == payload.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Target Room does not exist")
    if payload.check_in >= payload.check_out:
        raise HTTPException(status_code=400, detail="Check-out date must be after Check-in date")
    overlapping = db.query(Booking).filter(
        Booking.room_id == payload.room_id,
        Booking.is_cancelled == False,
        and_(
            Booking.check_in < payload.check_out,
            Booking.check_out > payload.check_in
        )
    ).first()
    if overlapping:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Room is already booked for the selected date range"
        )
    new_booking = Booking(**payload.model_dump())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking
#Read - GET
@app.get("/rooms", response_model=List[RoomResponse])
def get_all_rooms(db: Session = Depends(get_db), limit: int = 10, skip: int = 0):
    rooms = db.query(Room).offset(skip).limit(limit).all()
    return rooms
#GET by ID
@app.get("/rooms/{room_id}", response_model=RoomResponse)
def get_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Room with id {room_id} not found"
        )
    return room
#GET Availability
@app.get("/rooms/{room_id}/availability", response_model=RoomAvailabilityResponse)
def check_room_availability(
    room_id: int, 
    check_in: date = Query(..., description="YYYY-MM-DD"), 
    check_out: date = Query(..., description="YYYY-MM-DD"), 
    db: Session = Depends(get_db)
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    conflicting_bookings = db.query(Booking).filter(
        Booking.room_id == room_id,
        Booking.is_cancelled == False,
        and_(
            Booking.check_in < check_out,
            Booking.check_out > check_in
        )
    ).count()
    return {
        "room_id": room_id,
        "is_available": conflicting_bookings == 0,
        "conflicting_bookings_count": conflicting_bookings
    }
#Booking History - GET
@app.get("/bookings/history", response_model=List[BookingResponse])
def get_booking_history(
    user_id: Optional[int] = None, 
    include_cancelled: bool = True, 
    db: Session = Depends(get_db)
):
    query = db.query(Booking)
    if user_id:
        query = query.filter(Booking.user_id == user_id)
    if not include_cancelled:
        query = query.filter(Booking.is_cancelled == False)
    return query.order_by(Booking.check_in.desc()).all()
#Summary - GET
@app.get("/bookings/summary")
def get_booking_summary(db: Session = Depends(get_db)):
    total_bookings = db.query(Booking).count()
    active_bookings = db.query(Booking).filter(Booking.is_cancelled == False).count()
    cancelled_bookings = db.query(Booking).filter(Booking.is_cancelled == True).count()
    most_booked = db.query(
        Booking.room_id, func.count(Booking.id).label("count")
    ).filter(Booking.is_cancelled == False).group_by(Booking.room_id).order_by(text("count DESC")).first()

    return {
        "metrics": {
            "total_reservations_processed": total_bookings,
            "active_reservations": active_bookings,
            "cancelled_reservations": cancelled_bookings,
            "popular_room_id": most_booked[0] if most_booked else None
        }
    }
#Update - PUT
@app.put("/rooms/{room_id}", response_model=RoomResponse)
def update_room_full(room_id: int, updated_room: Rooms, db: Session = Depends(get_db)):
    room_query = db.query(Room).filter(Room.id == room_id)
    room = room_query.first()
    
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Room with id {room_id} not found"
        )
    # PUT replaces all fields entirely
    room_query.update(updated_room.model_dump(), synchronize_session=False)
    db.commit()
    return room_query.first()
#Update Partial - PATCH
@app.patch("/rooms/{room_id}", response_model=RoomResponse)
def update_room_partial(room_id: int, updated_fields: RoomUpdate, db: Session = Depends(get_db)):
    room_query = db.query(Room).filter(Room.id == room_id)
    room = room_query.first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Room with id {room_id} not found"
        )
    # exclude_unset=True makes sure it ONLY updates fields the client actually sent
    update_data = updated_fields.model_dump(exclude_unset=True)
    room_query.update(update_data, synchronize_session=False)
    db.commit()
    return room_query.first()
#Cancel Booking - PATCH
@app.patch("/bookings/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.is_cancelled:
        raise HTTPException(status_code=400, detail="Booking is already cancelled")
    booking.is_cancelled = True
    db.commit()
    db.refresh(booking)
    return booking
#DELETE
@app.delete("/rooms/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(room_id: int, db: Session = Depends(get_db)):
    room_query = db.query(Room).filter(Room.id == room_id)
    room = room_query.first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Room with id {room_id} not found"
        )
    room_query.delete(synchronize_session=False)
    db.commit()
    # 204 No Content should return a blank Response
    return Response(status_code=status.HTTP_204_NO_CONTENT)