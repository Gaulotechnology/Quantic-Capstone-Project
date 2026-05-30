# **Design & Testing Document: Tumaini AI Recruitment Platform**

**Team:** Nexus AI  
**Project:** MSSE Capstone Project  
**Date:** November 2026  

---

## **Part 1: Design & Architecture Decisions**

### **1.1 Architectural Style: Microservices**
The Tumaini AI platform is built using a **Microservices Architecture**. This decision was driven by the project's requirement for heavy AI processing (CV extraction) and high-concurrency matching.
- **Rationale**: Decoupling the AI-heavy "CV Service" and "Matching Service" ensures that slow LLM operations do not block the "Identity" or "Job" services.
- **Communication**: Synchronous communication is handled via **RESTful APIs**, while cross-service consistency and long-running tasks (e.g., re-indexing vectors) are managed asynchronously via **RabbitMQ**.

### **1.2 Domain-Driven Design (DDD)**
The project strictly follows DDD principles to ensure a clean separation of concerns:
- **Aggregates**: Each service owns its core aggregate (e.g., `User` in Identity, `JobPosting` in Job Service).
- **Ubiquitous Language**: Terminology like "Mandate", "Shortlist", and "RAG Pipeline" is shared across code and business logic.
- **Structure**: Each service uses a standard internal structure: `domain/` (logic), `application/` (services/use cases), and `infrastructure/` (persistence/clients).

### **1.3 Storage Strategy**
We utilize a multi-modal storage approach to handle different data requirements:
1. **Relational (PostgreSQL)**: Used for structured transactional data (users, jobs, applications) requiring ACID compliance.
2. **Vector (Qdrant)**: Used for candidate skill embeddings. This allows for **Semantic Search**, enabling recruiters to find candidates based on "meaning" rather than just keyword matches.
3. **Key-Value (Redis)**: Used for JWT revocation lists and caching LLM-generated embeddings to reduce API costs.

### **1.4 AI Strategy: DeepSeek-V3 and RAG**
The system implements a **Retrieval-Augmented Generation (RAG)** pipeline:
- **Decision**: DeepSeek-V3 was selected as the primary LLM over GPT-4o due to its identical OpenAI-compatible API and significantly lower cost for the high-volume extraction tasks required by Tumaini.
- **Extraction**: Instead of fragile regex, we use AI to structure raw CV text into a strict JSON schema (Name, Email, Skills, Experience).
- **Matching**: The system retrieves top-k candidates from Qdrant, then passes the Job Description and CV snippets to DeepSeek to generate a human-readable **Rationale**.

### **1.5 Infrastructure & Edge**
- **Hosting**: Deployed on **Hetzner Cloud** (South African region) to ensure **POPIA Compliance** and minimize latency for the local market.
- **Edge Server**: **Caddy** was selected as the reverse proxy because of its automatic SSL management and high-performance routing, replacing more complex alternatives like Kong or Nginx.

---

## **Part 2: Implementation Details**

### **2.1 API Gateway & Routing**
All external requests hit the Caddy server at `http://178.105.255.240`, which routes them to the appropriate container:
- `/api/auth/*` → `identity-service:8000`
- `/api/cvs/*` → `cv-service:8000`
- `/api/jobs/*` → `job-service:8000`
- `/api/matching/*` → `matching-service:8000`

### **2.2 Data Schema (Core Models)**
- **User**: `id, email, password_hash, role (ADMIN/RECRUITER/CANDIDATE)`
- **CurriculumVitae**: `id, candidate_id, extracted_json (skills, experience, education)`
- **JobPosting**: `id, title, description, required_skills, status`
- **Shortlist**: `id, job_id, candidates (json array with scores and rationales)`

---

## **Part 3: Testing Strategy**

### **3.1 Testing Pyramid**
We adopted a three-tiered testing strategy to ensure reliability:

1.  **Unit Tests (pytest)**:
    - **Focus**: Domain aggregates and value objects.
    - **Key Test**: Validating that the `CandidateScore` value object cannot exceed 100.
2.  **Integration Tests**:
    - **Focus**: Service-to-Service communication.
    - **Key Test**: Mocking the Qdrant response to verify the Matching Service correctly handles empty search results.
3.  **End-to-End (E2E) Tests (Cypress)**:
    - **Focus**: The critical "Recruiter Path".
    - **Scenario**: Login → Upload CV4 → Parse → Create Job → Run Match → View Rationale.

### **3.2 AI Verification**
Since LLM outputs can be non-deterministic, we implemented **LLM Evaluation Metrics**:
- **JSON Integrity**: A 100% success rate requirement for the parsing logic (achieved via strict system prompts and `response_format: json_object`).
- **Ground Truth Correlation**: Comparing AI match scores against a set of 50 "Known-Good" matches. Current correlation is **r=0.76**, exceeding our target of 0.70.

### **3.3 Continuous Integration (CI)**
GitHub Actions runs the full test suite on every push to the `quantic-capstone` branch. Production deployment is only permitted after all 200+ backend and frontend tests pass.

---

## **Part 4: Final Evaluation**

The Tumaini AI Recruitment Platform has met all functional and non-functional requirements set out in the project mandate. By moving from keyword-based search to **AI-driven semantic matching**, we have reduced recruiter screening time by an estimated **65%** while increasing the quality of candidate shortlists.
