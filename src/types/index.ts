export type UserRole = 'trainee' | 'trainer' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'suspended';

export interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: string;
  specialization: string;
}

export interface WorkExperience {
  id: string;
  designation: string;
  organization: string;
  station: string; // e.g. RMC New Delhi, IMD Pune, RMC Kolkata
  years: number;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  verificationCode: string;
  grade: string;
  scorePercentage: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  department: string;
  designation: string;
  location: string;
  phoneNumber?: string;
  avatarUrl?: string;
  qualifications: Qualification[];
  experience: WorkExperience[];
  skills: string[];
  interests: string[];
  certificates: Certificate[];
  createdAt: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  domain: string;
  description: string;
  trainerId: string;
  trainerName: string;
  durationHours: number;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  syllabus: string[];
  enrolledTraineeIds: string[];
  rating: number;
  reviewsCount: number;
  thumbnailUrl: string;
  createdAt: string;
}

export interface LibraryResource {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  type: 'video' | 'presentation' | 'manual' | 'dataset';
  url: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  sizeOrDuration: string;
  description: string;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  durationMinutes: number;
  deadline: string; // ISO date string
  passingScore: number; // in percentage e.g. 70
  createdBy: string;
  createdByName: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  courseId: string;
  traineeId: string;
  traineeName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  answers: {
    questionId: number;
    selectedOption: number;
    isCorrect: boolean;
  }[];
}

export interface CourseFeedback {
  id: string;
  courseId: string;
  courseTitle: string;
  traineeId: string;
  traineeName: string;
  rating: number;
  contentQuality: number;
  trainerClarity: number;
  comments: string;
  submittedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'circular' | 'achievement' | 'urgent_notice' | 'course_spotlight';
  content: string;
  priority: 'high' | 'normal';
  link?: string;
  publishedBy: string;
  publishedAt: string;
}

export interface CompetencyMapping {
  id: string;
  subject: string;
  domain: string;
  requiredSkills: string[];
  minExperienceYears: number;
  recommendedTrainerIds: string[];
  description: string;
}
