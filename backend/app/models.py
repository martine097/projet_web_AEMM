from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

# Enums
class UserRole(str, enum.Enum):
    CITIZEN = "citizen"
    ADMIN = "admin"

class ReservationStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class VehicleType(str, enum.Enum):
    ESSENCE = "essence"
    DIESEL = "diesel"
    ELECTRIC = "electric"
    GPL = "gpl"
    HYBRID = "hybrid"

class ReportCategory(str, enum.Enum):
    BORNE_DEFAILLANTE = "borne_defaillante"
    PROPRETE = "proprete"
    PLACE_OCCUPEE_ILLEGALEMENT = "place_occupee_illegalement"
    ECLAIRAGE = "eclairage"
    SECURITE = "securite"
    AUTRE = "autre"

class ReportStatus(str, enum.Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.CITIZEN, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relations
    vehicles = relationship("Vehicle", back_populates="owner", cascade="all, delete-orphan")
    reservations = relationship("Reservation", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")

class Parking(Base):
    __tablename__ = "parkings"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    total_spots = Column(Integer, nullable=False)
    available_spots = Column(Integer, nullable=False)
    hourly_rate = Column(Float, default=2.0)
    description = Column(Text)
    
    # Relations
    reservations = relationship("Reservation", back_populates="parking")
    favorites = relationship("Favorite", back_populates="parking", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="parking")

class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    license_plate = Column(String, nullable=False)
    brand = Column(String)
    model = Column(String)
    fuel_type = Column(Enum(VehicleType))
    height = Column(Float)  # en mètres
    photo_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relations
    owner = relationship("User", back_populates="vehicles")
    reservations = relationship("Reservation", back_populates="vehicle")

class Reservation(Base):
    __tablename__ = "reservations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parking_id = Column(Integer, ForeignKey("parkings.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(Enum(ReservationStatus), default=ReservationStatus.ACTIVE)
    total_price = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relations
    user = relationship("User", back_populates="reservations")
    parking = relationship("Parking", back_populates="reservations")
    vehicle = relationship("Vehicle", back_populates="reservations")

class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parking_id = Column(Integer, ForeignKey("parkings.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relations
    user = relationship("User", back_populates="favorites")
    parking = relationship("Parking", back_populates="favorites")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parking_id = Column(Integer, ForeignKey("parkings.id"), nullable=False)
    category = Column(Enum(ReportCategory), nullable=False)
    description = Column(Text, nullable=False)
    photo_url = Column(String)
    status = Column(Enum(ReportStatus), default=ReportStatus.NEW)
    admin_comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    user = relationship("User", back_populates="reports")
    parking = relationship("Parking", back_populates="reports")