from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional, Literal


class RoomCreate(BaseModel):
    room_number: str
    room_type: Literal["Single", "Double", "Deluxe", "Suite"]
    price_per_night: float = Field(gt=0)
    capacity: int = Field(gt=0)


class RoomUpdate(BaseModel):
    room_type: Optional[Literal["Single", "Double", "Deluxe", "Suite"]] = None
    price_per_night: Optional[float] = Field(None, gt=0)
    capacity: Optional[int] = Field(None, gt=0)

class RoomResponse(BaseModel):
    id: int
    room_number: str
    room_type: str
    price_per_night: float
    capacity: int
    status: str

    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    room_id: int
    user_id: int
    check_in: date
    check_out: date

class BookingResponse(BaseModel):
    id: int
    room_id: int
    user_id: int
    check_in: date
    check_out: date
    is_cancelled: bool
    room: Optional[RoomMinInfo] = None 


    class Config:
        from_attributes = True # Pydantic v2 configuration style

class RoomAvailabilityResponse(BaseModel):
    room_id: int
    is_available: bool
    conflicting_bookings_count: int
    
class RoomMinInfo(BaseModel):
    room_number: str
    room_type: str
    price_per_night: float

    class Config:
        from_attributes = True