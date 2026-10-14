export type UserRole = 'people' | 'volunteer' | 'rescue' | 'headoffice';

export type EmergencyCategory =
  | 'Flood'
  | 'Fire'
  | 'Medical Emergency'
  | 'Building Damage'
  | 'Trapped Person'
  | 'Cyclone'
  | 'Earthquake'
  | 'Other';

export type RequestStatus = 'Pending' | 'In Progress' | 'Completed';

export type TaskStatus = 'Assigned' | 'Accepted' | 'In Progress' | 'Completed' | 'Declined';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type VolunteerAvailability = 'Available' | 'Busy' | 'Off-duty';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone?: string;
}

export interface EmergencyRequest {
  id: string;
  requester_id?: string | null;
  name: string;
  phone: string;
  area: string;
  emergency_type: EmergencyCategory;
  people_count: number;
  details?: string;
  status: RequestStatus;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  updated_at: string;
}

export interface StatusHistoryItem {
  id: string;
  emergency_request_id: string;
  old_status: string;
  new_status: string;
  changed_by: string;
  changed_at: string;
}

export interface Volunteer {
  id: string;
  user_id?: string;
  phone: string;
  email: string;
  location: string;
  skills: string;
  availability: VolunteerAvailability;
  experience?: string;
  full_name?: string;
  username?: string;
  created_at: string;
}

export interface EmergencyTask {
  id: string;
  emergency_request_id?: string | null;
  title: string;
  description?: string;
  priority: PriorityLevel;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  emergency_area?: string;
  emergency_type?: EmergencyCategory;
  requester_name?: string;
  requester_phone?: string;
  assignment_id?: string;
  volunteer_id?: string;
  assignment_status?: TaskStatus;
  assignment_notes?: string;
  volunteer_name?: string;
  assigned_at?: string;
  completed_at?: string;
}

export interface OverviewStats {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  totalVolunteers: number;
  availableVolunteers: number;
  activeTasks: number;
  peopleAssisted: number;
  categoryDistribution: Array<{ category: EmergencyCategory; count: number }>;
  recentRequests: EmergencyRequest[];
  recentActivities: StatusHistoryItem[];
}

export type SupportedLanguage = 'en' | 'ta' | 'hi';
