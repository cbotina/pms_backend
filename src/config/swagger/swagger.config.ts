import { DocumentBuilder } from '@nestjs/swagger';
import { Tags } from './swagger.constants';

export const createSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Permission Management System - Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
};

export const createSwaggerOptions = () => {
  // Custom tag ordering - Authentication first, then others alphabetically
  const customTagsSorter = (a: any, b: any) => {
    const priorityTags = [
      Tags.HEALTH,
      Tags.AUTHENTICATION,
      Tags.PERIODS,
      Tags.PERIOD_GROUPS,
      Tags.GROUPS,
      Tags.PERIOD_TIMESLOTS,
      Tags.TIME_SLOTS,
      Tags.STUDENTS,
      Tags.TEACHERS,
      Tags.GROUP_STUDENTS,
      Tags.ENROLLMENTS,
      Tags.STUDENT_ENROLLMENTS,
      Tags.SUBJECTS,
      Tags.SUBJECT_GROUPS,
      Tags.SUBJECT_GROUP_TIME_SLOTS,
      Tags.ABSENCES,
      Tags.PERMISSIONS,
      Tags.PERMISSION_REQUESTS,
      Tags.DAILY_REPORTS,
      Tags.SCHEDULES,
      Tags.USERS,
      Tags.STATS,
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
