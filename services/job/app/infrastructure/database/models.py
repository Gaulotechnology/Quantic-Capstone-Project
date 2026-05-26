import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.infrastructure.database.engine import Base


class JobModel(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=False)
    required_skills = Column(JSON, nullable=False)
    location = Column(String(255), nullable=False)
    sector = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="OPEN")
    client_name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ShortlistModel(Base):
    __tablename__ = "shortlists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    candidates = relationship("ShortlistCandidateModel", back_populates="shortlist", cascade="all, delete-orphan")


class ShortlistCandidateModel(Base):
    __tablename__ = "shortlist_candidates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    shortlist_id = Column(UUID(as_uuid=True), ForeignKey("shortlists.id"), nullable=False)
    candidate_id = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    score = Column(Float, default=0.0)
    matched_skills = Column(JSON, default=list)
    added_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)

    shortlist = relationship("ShortlistModel", back_populates="candidates")
