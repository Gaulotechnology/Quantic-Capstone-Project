export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_id: string;
  role: Role;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: Role;
}

export interface RegisterResponse {
  user_id: string;
  email: string;
  role: Role;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

// Job types (for when Job service API is ready)
export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  required_skills: string[];
  location: string;
  sector: string;
  salary_range?: string;
  client_name?: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'SUBMITTED' | 'SHORTLISTED' | 'REJECTED' | 'INTERVIEW' | 'OFFERED';
  applied_at: string;
  job?: Job;
}

// CV types (for when CV service API is ready)
export interface CV {
  id: string;
  candidate_id: string;
  file_name: string;
  status: 'UPLOADED' | 'PROCESSING' | 'PROCESSED' | 'FAILED';
  extracted_data?: ExtractedCVData;
  uploaded_at: string;
}

export interface ExtractedCVData {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  work_experiences: WorkExperience[];
  education: Education[];
}

export interface WorkExperience {
  company: string;
  title: string;
  start_date: string;
  end_date?: string;
  description: string;
}

export interface Education {
  institution: string;
  qualification: string;
  field: string;
  year: string;
}

// Search types (for when Vector service API is ready)
export interface SearchRequest {
  query?: string;
  job_id?: string;
  limit?: number;
  page?: number;
  sector?: string;
  location?: string;
  min_experience?: number;
}

export interface SearchResult {
  candidate_id: string;
  name: string;
  score: number;
  matched_skills: string[];
  missing_skills: string[];
  rationale: string;
}

export interface SearchResponse {
  candidates: SearchResult[];
  total_count: number;
  next_page_token?: string;
}

// Matching types (for when Matching service API is ready)
export interface MatchingRequest {
  job_id: string;
  candidate_ids?: string[];
  threshold?: number;
}

export interface MatchingResult {
  candidate_id: string;
  name: string;
  score: number;
  rationale: string;
  matched_skills: string[];
  missing_skills: string[];
}

// Shortlist types
export interface Shortlist {
  id: string;
  job_id: string;
  name: string;
  candidates: ShortlistCandidate[];
  created_at: string;
  updated_at: string;
}

export interface ShortlistCandidate {
  candidate_id: string;
  name: string;
  score: number;
  matched_skills: string[];
  added_at: string;
  notes?: string;
}
