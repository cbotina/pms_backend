import { WeekDay } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';

/**
 * Each entry maps a teacher to a subject in a group, with weekly hours
 * and a schedule (day + time-slot index pairs).
 *
 * Indices reference the arrays created by the seeder:
 *   teacherIndex  -> teachersData[]
 *   subjectIndex  -> subjectsData[]
 *   groupIndex    -> groupsData[]
 *   timeSlotIndex -> timeSlotsData[] (academic slots only, 0-based)
 */
export const subjectGroupsData = [
  // Group 12-01
  { teacherIndex: 0, subjectIndex: 0, groupIndex: 0, hours: 4, schedule: [{ day: WeekDay.MONDAY, timeSlotIndex: 0 }, { day: WeekDay.WEDNESDAY, timeSlotIndex: 0 }] },
  { teacherIndex: 1, subjectIndex: 1, groupIndex: 0, hours: 3, schedule: [{ day: WeekDay.TUESDAY, timeSlotIndex: 1 }, { day: WeekDay.THURSDAY, timeSlotIndex: 1 }] },
  { teacherIndex: 2, subjectIndex: 2, groupIndex: 0, hours: 3, schedule: [{ day: WeekDay.MONDAY, timeSlotIndex: 2 }, { day: WeekDay.FRIDAY, timeSlotIndex: 2 }] },
  { teacherIndex: 3, subjectIndex: 3, groupIndex: 0, hours: 4, schedule: [{ day: WeekDay.WEDNESDAY, timeSlotIndex: 4 }, { day: WeekDay.FRIDAY, timeSlotIndex: 4 }] },

  // Group 12-02
  { teacherIndex: 0, subjectIndex: 4, groupIndex: 1, hours: 3, schedule: [{ day: WeekDay.TUESDAY, timeSlotIndex: 0 }, { day: WeekDay.THURSDAY, timeSlotIndex: 0 }] },
  { teacherIndex: 1, subjectIndex: 5, groupIndex: 1, hours: 2, schedule: [{ day: WeekDay.MONDAY, timeSlotIndex: 1 }] },
  { teacherIndex: 2, subjectIndex: 6, groupIndex: 1, hours: 2, schedule: [{ day: WeekDay.WEDNESDAY, timeSlotIndex: 2 }] },
  { teacherIndex: 3, subjectIndex: 7, groupIndex: 1, hours: 3, schedule: [{ day: WeekDay.FRIDAY, timeSlotIndex: 5 }, { day: WeekDay.TUESDAY, timeSlotIndex: 5 }] },

  // Group 13-01
  { teacherIndex: 0, subjectIndex: 0, groupIndex: 2, hours: 4, schedule: [{ day: WeekDay.MONDAY, timeSlotIndex: 4 }, { day: WeekDay.WEDNESDAY, timeSlotIndex: 5 }] },
  { teacherIndex: 2, subjectIndex: 3, groupIndex: 2, hours: 3, schedule: [{ day: WeekDay.TUESDAY, timeSlotIndex: 2 }, { day: WeekDay.THURSDAY, timeSlotIndex: 2 }] },
  { teacherIndex: 3, subjectIndex: 7, groupIndex: 2, hours: 3, schedule: [{ day: WeekDay.FRIDAY, timeSlotIndex: 0 }, { day: WeekDay.THURSDAY, timeSlotIndex: 4 }] },
];
