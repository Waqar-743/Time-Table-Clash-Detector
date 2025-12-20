
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export enum SubjectType {
  LECTURE = 'Lecture',
  LAB = 'Lab / Practical',
  TUTORIAL = 'Tutorial'
}

export interface User {
  name: string;
  email: string;
}

export interface Subject {
  id: string;
  title: string;
  day: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  room: string;
  type: SubjectType;
  instructor?: string;
  color?: string; // Hex or CSS color
}

export enum ConflictType {
  TIME_CLASH = 'Critical Clash',
  ROOM_CLASH = 'Room Double-Booked',
  INSTRUCTOR_CLASH = 'Instructor Conflict'
}

export interface Conflict {
  id: string;
  type: ConflictType;
  subjects: string[]; // IDs of subjects involved
  message: string;
  timestamp: string;
}
