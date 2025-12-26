
import { Subject, Conflict, ConflictType } from './types';

/**
 * Converts HH:mm to total minutes from midnight.
 * Logic reference: cpp-logic-reference/clash_logic.cpp
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Detects scheduling conflicts between subjects.
 * Logic reference: cpp-logic-reference/clash_logic.cpp
 */
export const detectConflicts = (subjects: Subject[]): Conflict[] => {
  const conflicts: Conflict[] = [];
  
  for (let i = 0; i < subjects.length; i++) {
    for (let j = i + 1; j < subjects.length; j++) {
      const s1 = subjects[i];
      const s2 = subjects[j];
      
      if (s1.day === s2.day) {
        const start1 = timeToMinutes(s1.startTime);
        const end1 = timeToMinutes(s1.endTime);
        const start2 = timeToMinutes(s2.startTime);
        const end2 = timeToMinutes(s2.endTime);
        
        // Overlap detected
        if (start1 < end2 && start2 < end1) {
          const isGlobal = s1.userEmail !== s2.userEmail;
          conflicts.push({
            id: `c-${s1.id}-${s2.id}`,
            type: isGlobal ? ConflictType.ROOM_CLASH : ConflictType.TIME_CLASH,
            subjects: [s1.id, s2.id],
            message: isGlobal 
              ? `Global Clash: ${s1.title} (${s1.userEmail}) overlaps with ${s2.title} (${s2.userEmail}) on ${s1.day}s.`
              : `${s1.title} overlaps with ${s2.title} on ${s1.day}s.`,
            timestamp: 'Just now'
          });
        }
      }
    }
  }
  
  return conflicts;
};

export const getDayFromDate = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};
