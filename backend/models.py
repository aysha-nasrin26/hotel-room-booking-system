from sqlalchemy import Column, Integer, String, Numeric, DateTime, Date, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True, nullable=False)
    room_type = Column(String, nullable=False)
    price_per_night = Column(Numeric(10, 2), nullable=False)
    capacity = Column(Integer, nullable=False)
    status = Column(String,nullable=False,default="AVAILABLE")
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    bookings = relationship("Booking", back_populates="room")
class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, index=True, nullable=False) # Or linked to a User model
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)
    is_cancelled = Column(Boolean, default=False)

    # Relationship to Room
    room = relationship("Room", back_populates="bookings")