import { db } from "./firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { UserProfile, Course, Announcement, QuizSubmission, CompetencyMapping } from "@/types";

export const FirestoreService = {
  // --- USERS ---
  async getUsers(): Promise<UserProfile[]> {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map(doc => doc.data() as UserProfile);
  },
  
  async getUserById(uid: string): Promise<UserProfile | null> {
    if (!db) return null;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  },

  async saveUser(user: UserProfile): Promise<void> {
    if (!db) return;
    await setDoc(doc(db, "users", user.uid), user, { merge: true });
  },

  async updateUserStatus(uid: string, status: "pending" | "approved" | "suspended", role?: "trainee"|"trainer"|"admin"): Promise<void> {
    if (!db) return;
    const updates: any = { status };
    if (role) updates.role = role;
    await updateDoc(doc(db, "users", uid), updates);
  },

  // --- COURSES ---
  async getCourses(): Promise<Course[]> {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, "courses"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  },

  async addCourse(course: Omit<Course, "id">): Promise<void> {
    if (!db) return;
    const docRef = doc(collection(db, "courses"));
    await setDoc(docRef, { ...course, id: docRef.id });
  },

  async deleteCourse(id: string): Promise<void> {
    if (!db) return;
    await deleteDoc(doc(db, "courses", id));
  },

  async enrollInCourse(courseId: string, traineeId: string): Promise<boolean> {
    if (!db) return false;
    const courseRef = doc(db, "courses", courseId);
    try {
      await updateDoc(courseRef, {
        enrolledTraineeIds: arrayUnion(traineeId)
      });
      return true;
    } catch (e) {
      return false;
    }
  },

  // --- ANNOUNCEMENTS ---
  async getAnnouncements(): Promise<Announcement[]> {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, "announcements"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
  },

  async addAnnouncement(ann: Omit<Announcement, "id" | "publishedAt">): Promise<void> {
    if (!db) return;
    const docRef = doc(collection(db, "announcements"));
    await setDoc(docRef, {
      ...ann,
      id: docRef.id,
      publishedAt: new Date().toISOString()
    });
  },

  async deleteAnnouncement(id: string): Promise<void> {
    if (!db) return;
    await deleteDoc(doc(db, "announcements", id));
  },

  // --- COMPETENCIES ---
  async getCompetencies(): Promise<CompetencyMapping[]> {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, "competencies"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CompetencyMapping));
  },

  async addCompetency(comp: Omit<CompetencyMapping, "id">): Promise<void> {
    if (!db) return;
    const docRef = doc(collection(db, "competencies"));
    await setDoc(docRef, { ...comp, id: docRef.id });
  },

  async deleteCompetency(id: string): Promise<void> {
    if (!db) return;
    await deleteDoc(doc(db, "competencies", id));
  },

  // --- SUBMISSIONS ---
  async getSubmissions(): Promise<QuizSubmission[]> {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, "submissions"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizSubmission));
  },

  // --- NEW FEATURES (ARCHIVE, MIGRATE, NOTIFICATIONS, DELETE USER) ---
  async deleteUser(uid: string): Promise<void> {
    if (!db) return;
    await deleteDoc(doc(db, "users", uid));
  },

  async archiveCourse(id: string, byAdmin: boolean): Promise<void> {
    if (!db) return;
    await updateDoc(doc(db, "courses", id), {
      archived: true,
      ...(byAdmin && { archivedByAdmin: true })
    });
  },

  async unarchiveCourse(id: string): Promise<void> {
    if (!db) return;
    // Trainer can't unarchive if admin archived it. Admin will have a separate flow if needed.
    await updateDoc(doc(db, "courses", id), {
      archived: false,
      archivedByAdmin: false
    });
  },

  async requestCourseMigration(id: string, targetTrainerId: string, targetTrainerName: string): Promise<void> {
    if (!db) return;
    await updateDoc(doc(db, "courses", id), {
      pendingMigrationToId: targetTrainerId,
      pendingMigrationToName: targetTrainerName
    });
  },

  async resolveCourseMigration(id: string, accept: boolean, targetTrainerId?: string, targetTrainerName?: string): Promise<void> {
    if (!db) return;
    if (accept && targetTrainerId && targetTrainerName) {
      // Transfer ownership
      await updateDoc(doc(db, "courses", id), {
        trainerId: targetTrainerId,
        trainerName: targetTrainerName,
        pendingMigrationToId: null,
        pendingMigrationToName: null
      });
    } else {
      // Reject / Cancel
      await updateDoc(doc(db, "courses", id), {
        pendingMigrationToId: null,
        pendingMigrationToName: null
      });
    }
  },

  async getNotifications(): Promise<any[]> {
    if (!db) return [];
    const snapshot = await getDocs(collection(db, "notifications"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addNotification(title: string, message: string, createdBy: string, createdByName: string): Promise<void> {
    if (!db) return;
    const docRef = doc(collection(db, "notifications"));
    await setDoc(docRef, {
      id: docRef.id,
      title,
      message,
      createdBy,
      createdByName,
      createdAt: new Date().toISOString()
    });
  },

  async deleteNotification(id: string): Promise<void> {
    if (!db) return;
    await deleteDoc(doc(db, "notifications", id));
  }
};
