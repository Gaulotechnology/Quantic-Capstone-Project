import asyncio
import logging
import sys
import os
import uuid

# Add the current directory to sys.path so we can import 'app'
sys.path.append(os.path.join(os.getcwd(), "services/job"))

from app.infrastructure.database.engine import AsyncSessionLocal
from app.infrastructure.database.models import JobModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_jobs():
    async with AsyncSessionLocal() as session:
        # Create tables
        from app.infrastructure.database.engine import engine, Base
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        jobs = [
            {
                "title": "Senior Full Stack Developer",
                "description": "We are looking for a Senior Full Stack Developer to join our team...",
                "requirements": "8+ years experience, React, Node.js, AWS",
                "required_skills": ["React", "Node.js", "AWS", "TypeScript"],
                "location": "Cape Town",
                "sector": "IT",
                "status": "OPEN",
                "client_name": "TechFlow Solutions"
            },
            {
                "title": "Agile Project Manager",
                "description": "Seeking an experienced Project Manager for telecommunications projects...",
                "requirements": "10+ years experience, PMP, Agile",
                "required_skills": ["Project Management", "Agile", "Scrum", "PMP"],
                "location": "Johannesburg",
                "sector": "Telecommunications",
                "status": "OPEN",
                "client_name": "MTN South Africa"
            }
        ]

        for job_data in jobs:
            job = JobModel(**job_data)
            session.add(job)
        
        await session.commit()
        logger.info("Job seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_jobs())
