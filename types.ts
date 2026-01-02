export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR', // Formador
  STUDENT = 'STUDENT',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  approved: boolean;
  coursesEnrolled: string[]; // IDs of courses
}

export interface Material {
  id: string;
  title: string;
  type: 'PDF' | 'VIDEO' | 'LINK' | 'QUIZ' | 'ASSIGNMENT';
  contentUrl?: string; // Or content text
  description?: string;
  restrictedTo?: UserRole[]; // If specific roles are needed
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  materials: Material[];
  published: boolean;
  category: string;
}

export type ViewState = 'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'COURSES' | 'COURSE_DETAIL' | 'USERS' | 'SETTINGS';

export interface AppState {
  currentUser: User | null;
  currentView: ViewState;
  selectedCourseId: string | null;
}