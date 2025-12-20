
import { Subject, SubjectType, Conflict, ConflictType } from './types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: '1',
    title: 'Introduction to Physics',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    room: 'Room 302',
    type: SubjectType.LECTURE,
    instructor: 'Dr. Smith',
    color: '#3B82F6' // Blue
  },
  {
    id: '2',
    title: 'Web Development',
    day: 'Monday',
    startTime: '11:00',
    endTime: '13:00',
    room: 'Lab A, Building 2',
    type: SubjectType.LAB,
    instructor: 'Prof. X',
    color: '#10B981' // Emerald
  },
  {
    id: '3',
    title: 'Database Systems',
    day: 'Monday',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 405',
    type: SubjectType.LECTURE,
    color: '#8B5CF6' // Violet
  },
  {
    id: '4',
    title: 'Computer Science 101',
    day: 'Tuesday',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Room 304',
    type: SubjectType.LECTURE,
    instructor: 'Dr. Brown',
    color: '#F59E0B' // Amber
  },
  {
    id: '5',
    title: 'Advanced Math',
    day: 'Tuesday',
    startTime: '10:30',
    endTime: '12:00',
    room: 'Hall B',
    type: SubjectType.LECTURE,
    instructor: 'Dr. Taylor',
    color: '#EC4899' // Pink
  }
];

export const INITIAL_CONFLICTS: Conflict[] = [
  {
    id: 'c1',
    type: ConflictType.TIME_CLASH,
    subjects: ['4', '5'],
    message: 'Computer Science 101 overlaps with Advanced Math on Tuesdays.',
    timestamp: 'Today, 10:30 AM'
  }
];
