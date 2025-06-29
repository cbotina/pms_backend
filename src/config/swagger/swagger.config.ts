import { DocumentBuilder } from '@nestjs/swagger';

export enum Tags {
  HEALTH = 'Health',
  AUTHENTICATION = 'Authentication 🔐',
  PERIODS = 'Periods 🗓️',
  PERIOD_GROUPS = 'Period Groups 🅿️👥',
  GROUPS = 'Groups 👥',
  PERIOD_TIMESLOTS = 'Period timeslots 🗓️⌚',
  TIME_SLOTS = 'Time Slots ⌚',
  STUDENTS = 'Students 👦',
  TEACHERS = 'Teachers 👩‍🏫',
  GROUP_STUDENTS = 'Group Students 👥🎒',
  ENROLLMENTS = 'Enrollments 🧑📚',
  STUDENT_ENROLLMENTS = 'Student enrollments 👦📚',
  SUBJECTS = 'Subjects 📚',
  SUBJECT_GROUPS = 'Subject Groups 📚👥',
  SUBJECT_GROUP_TIME_SLOTS = 'SubjectGroupTimeSlots ⌚📚',
  ABSENCES = 'Absences 🚨',
  PERMISSIONS = 'Permissions 🅿️',
  PERMISSION_REQUESTS = 'Permission Requests 🅿️🙋‍♂️',
  DAILY_REPORTS = 'Daily Reports 📃',
  SCHEDULES = 'Schedules 📜',
  USERS = 'Users 👤',
  STATS = 'Stats 📊',
}

export const createSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Permission Management System - Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
};

// Custom tag ordering function - defined outside to avoid serialization issues
const customTagsSorter = (a: any, b: any) => {
  const priorityTags = [
    'Health',
    'Authentication 🔐',
    'Periods 🗓️',
    'Period Groups 🅿️👥',
    'Groups 👥',
    'Period timeslots 🗓️⌚',
    'Time Slots ⌚',
    'Students 👦',
    'Teachers 👩‍🏫',
    'Group Students 👥🎒',
    'Enrollments 🧑📚',
    'Student enrollments 👦📚',
    'Subjects 📚',
    'Subject Groups 📚👥',
    'SubjectGroupTimeSlots ⌚📚',
    'Absences 🚨',
    'Permissions 🅿️',
    'Permission Requests 🅿️🙋‍♂️',
    'Daily Reports 📃',
    'Schedules 📜',
    'Users 👤',
    'Stats 📊',
  ];

  const aIndex = priorityTags.findIndex((tag) => tag === a);
  const bIndex = priorityTags.findIndex((tag) => tag === b);

  // If both tags are in priority list, sort by priority
  if (aIndex !== -1 && bIndex !== -1) {
    return aIndex - bIndex;
  }

  // If only one is in priority list, prioritize it
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;

  // Otherwise, sort alphabetically
  return a.localeCompare(b);
};

export const createSwaggerOptions = () => {
  return {
    swaggerOptions: {
      tagsSorter: customTagsSorter,
      operationsSorter: 'alpha',
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: 0,
      docExpansion: 'none',
    },
    customSiteTitle: 'PMS API Documentation',
  };
};
