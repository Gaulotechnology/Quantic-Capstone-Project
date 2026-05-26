import uuid
import logging
import random
from qdrant_client import QdrantClient
from qdrant_client.http import models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_qdrant():
    try:
        client = QdrantClient("http://qdrant:6333")
        
        collection_name = "candidates"
        
        logger.info(f"Recreating collection: {collection_name}")
        client.recreate_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
        )
        
        candidates = [
            {
                "id": str(uuid.uuid4()),
                "name": "Sarah Jenkins",
                "metadata": {
                    "candidate_id": str(uuid.uuid4()),
                    "name": "Sarah Jenkins",
                    "role": "CANDIDATE",
                    "matched_skills": ["React", "Node.js", "AWS", "TypeScript", "Python"],
                    "missing_skills": [],
                    "location": "Cape Town",
                    "sector": "IT",
                    "rationale": "Expert in modern web technologies and cloud architecture."
                }
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Marcus Dlamini",
                "metadata": {
                    "candidate_id": str(uuid.uuid4()),
                    "name": "Marcus Dlamini",
                    "role": "CANDIDATE",
                    "matched_skills": ["Project Management", "Agile", "Scrum", "PMP"],
                    "missing_skills": [],
                    "location": "Johannesburg",
                    "sector": "Telecommunications",
                    "rationale": "Extensive experience in large-scale infrastructure projects."
                }
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Elena Vance",
                "metadata": {
                    "candidate_id": str(uuid.uuid4()),
                    "name": "Elena Vance",
                    "role": "CANDIDATE",
                    "matched_skills": ["UI/UX", "Figma", "User Research", "Prototyping"],
                    "missing_skills": [],
                    "location": "Durban",
                    "sector": "Design",
                    "rationale": "Human-centered design approach with strong visual skills."
                }
            }
        ]
        
        points = []
        for cand in candidates:
            logger.info(f"Generating random vector for: {cand['name']}")
            # Use random vector as fallback for now
            embedding = [random.uniform(-1, 1) for _ in range(384)]
            points.append(models.PointStruct(
                id=cand['id'],
                vector=embedding,
                payload=cand['metadata']
            ))
            
        logger.info(f"Upserting {len(points)} points into Qdrant...")
        client.upsert(
            collection_name=collection_name,
            points=points
        )
        logger.info("Qdrant seeding completed successfully!")
        
    except Exception as e:
        logger.error(f"Failed to seed Qdrant: {e}")

if __name__ == "__main__":
    seed_qdrant()
