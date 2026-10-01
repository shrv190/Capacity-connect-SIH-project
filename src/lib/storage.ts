import {
  UserProfile,
  Course,
  Quiz,
  LibraryResource,
  Announcement,
  CompetencyMapping,
  QuizSubmission,
  CourseFeedback,
  Certificate,
} from "@/types";
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_QUIZZES,
  INITIAL_SUBMISSIONS,
  INITIAL_RESOURCES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_COMPETENCY_MAPPINGS,
} from "./mockData";

const STORAGE_KEYS = {
  USERS: "capacity_connect_users",
  COURSES: "capacity_connect_courses",
  QUIZZES: "capacity_connect_quizzes",
  SUBMISSIONS: "capacity_connect_submissions",
  RESOURCES: "capacity_connect_resources",
  ANNOUNCEMENTS: "capacity_connect_announcements",
  COMPETENCY: "capacity_connect_competency",
  FEEDBACK: "capacity_connect_feedback",
};

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  // Users
  getUsers: (): UserProfile[] => getItem(STORAGE_KEYS.USERS, INITIAL_USERS),
  getUserById: (uid: string): UserProfile | undefined => {
    const users = StorageService.getUsers();
    return users.find((u) => u.uid === uid);
  },
  saveUser: (user: UserProfile): void => {
    const users = StorageService.getUsers();
    const index = users.findIndex((u) => u.uid === user.uid);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    setItem(STORAGE_KEYS.USERS, users);
  },
  updateUserStatus: (uid: string, status: 'approved' | 'pending' | 'suspended', role?: 'trainee' | 'trainer' | 'admin'): void => {
    const users = StorageService.getUsers();
    const user = users.find((u) => u.uid === uid);
    if (user) {
      user.status = status;
      if (role) user.role = role;
      setItem(STORAGE_KEYS.USERS, users);
    }
  },

  // Courses
  getCourses: (): Course[] => getItem(STORAGE_KEYS.COURSES, INITIAL_COURSES),
  getCourseById: (id: string): Course | undefined => {
    const courses = StorageService.getCourses();
    return courses.find((c) => c.id === id);
  },
  enrollInCourse: (courseId: string, traineeId: string): boolean => {
    const courses = StorageService.getCourses();
    const course = courses.find((c) => c.id === courseId);
    if (course && !course.enrolledTraineeIds.includes(traineeId)) {
      course.enrolledTraineeIds.push(traineeId);
      setItem(STORAGE_KEYS.COURSES, courses);
      return true;
    }
    return false;
  },

  // Quizzes
  getQuizzes: (): Quiz[] => getItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES),
  getQuizById: (id: string): Quiz | undefined => {
    const quizzes = StorageService.getQuizzes();
    return quizzes.find((q) => q.id === id);
  },
  createQuiz: (quiz: Omit<Quiz, "id" | "createdAt">): Quiz => {
    const quizzes = StorageService.getQuizzes();
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    quizzes.push(newQuiz);
    setItem(STORAGE_KEYS.QUIZZES, quizzes);
    return newQuiz;
  },

  // Submissions
  getSubmissions: (): QuizSubmission[] => getItem(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS),
  getSubmissionsByTrainee: (traineeId: string): QuizSubmission[] => {
    const subs = StorageService.getSubmissions();
    return subs.filter((s) => s.traineeId === traineeId);
  },
  getSubmissionsByQuiz: (quizId: string): QuizSubmission[] => {
    const subs = StorageService.getSubmissions();
    return subs.filter((s) => s.quizId === quizId);
  },
  submitQuiz: (submission: Omit<QuizSubmission, "id" | "submittedAt">): QuizSubmission => {
    const submissions = StorageService.getSubmissions();
    const newSub: QuizSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    submissions.push(newSub);
    setItem(STORAGE_KEYS.SUBMISSIONS, submissions);

    // If passed, award certificate
    if (newSub.passed) {
      const course = StorageService.getCourseById(newSub.courseId);
      if (course) {
        const users = StorageService.getUsers();
        const trainee = users.find((u) => u.uid === newSub.traineeId);
        if (trainee) {
          const alreadyHasCert = trainee.certificates?.some((c) => c.courseId === course.id);
          if (!alreadyHasCert) {
            const cert: Certificate = {
              id: `cert-${Date.now()}`,
              courseId: course.id,
              courseTitle: course.title,
              issueDate: new Date().toISOString().split("T")[0],
              verificationCode: `MOES-IMD-${new Date().getFullYear()}-${course.code}-${Math.floor(1000 + Math.random() * 9000)}`,
              grade: newSub.percentage >= 90 ? "Distinction" : newSub.percentage >= 80 ? "First Class" : "Pass",
              scorePercentage: newSub.percentage,
            };
            if (!trainee.certificates) trainee.certificates = [];
            trainee.certificates.push(cert);
            StorageService.saveUser(trainee);
          }
        }
      }
    }

    return newSub;
  },

  // Trainer Library Resources
  getResources: (): LibraryResource[] => getItem(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES),
  addResource: (resource: Omit<LibraryResource, "id" | "uploadedAt">): LibraryResource => {
    const resources = StorageService.getResources();
    const newRes: LibraryResource = {
      ...resource,
      id: `res-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    resources.unshift(newRes);
    setItem(STORAGE_KEYS.RESOURCES, resources);
    return newRes;
  },

  // Announcements (Admin CMS)
  getAnnouncements: (): Announcement[] => getItem(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS),
  addAnnouncement: (ann: Omit<Announcement, "id" | "publishedAt">): Announcement => {
    const announcements = StorageService.getAnnouncements();
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      publishedAt: new Date().toISOString(),
    };
    announcements.unshift(newAnn);
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
    return newAnn;
  },
  deleteAnnouncement: (id: string): void => {
    const announcements = StorageService.getAnnouncements().filter((a) => a.id !== id);
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  },

  // Feedback
  getFeedback: (): CourseFeedback[] => getItem(STORAGE_KEYS.FEEDBACK, []),
  addFeedback: (fb: Omit<CourseFeedback, "id" | "submittedAt">): CourseFeedback => {
    const feedbackList = StorageService.getFeedback();
    const newFb: CourseFeedback = {
      ...fb,
      id: `fb-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    feedbackList.unshift(newFb);
    setItem(STORAGE_KEYS.FEEDBACK, feedbackList);
    return newFb;
  },

  // Competency Mappings
  getCompetencyMappings: (): CompetencyMapping[] => getItem(STORAGE_KEYS.COMPETENCY, INITIAL_COMPETENCY_MAPPINGS),

  // Reset to Demo
  resetToFactoryDefaults: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.QUIZZES);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.COMPETENCY);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
  },
};
