import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

export const GetStudentPermissionAbsencesDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "Get absences for a student's permission",
      description:
        'Retrieves a paginated list of absences associated with a specific permission for a student. Accessible by students, teachers, and secretaries.',
    }),
    ApiParam({
      name: 'studentId',
      description: 'ID of the student',
      example: 1,
    }),
    ApiParam({
      name: 'permissionId',
      description: 'ID of the permission',
      example: 1,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items per page (default: 10)',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: 'Absences retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                teacherNote: {
                  type: 'string',
                  example: 'Student was absent due to illness',
                },
                absenceDate: {
                  type: 'string',
                  format: 'date',
                  example: '2024-01-15',
                },
                startTime: { type: 'string', example: '08:00:00' },
                endTime: { type: 'string', example: '09:00:00' },
                subjectName: { type: 'string', example: 'Mathematics' },
                student: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                  },
                },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              totalItems: { type: 'number', example: 5 },
              itemCount: { type: 'number', example: 5 },
              itemsPerPage: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 1 },
              currentPage: { type: 'number', example: 1 },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiResponse({
      status: 404,
      description: 'Student or permission not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Student not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const GetPermissionAbsencesDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all absences for a permission',
      description:
        'Retrieves a paginated list of all absences associated with a specific permission.',
    }),
    ApiParam({
      name: 'permissionId',
      description: 'ID of the permission',
      example: 1,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items per page (default: 10)',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: 'Absences retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                teacherNote: {
                  type: 'string',
                  example: 'Student was absent due to illness',
                },
                absenceDate: {
                  type: 'string',
                  format: 'date',
                  example: '2024-01-15',
                },
                startTime: { type: 'string', example: '08:00:00' },
                endTime: { type: 'string', example: '09:00:00' },
                subjectName: { type: 'string', example: 'Mathematics' },
                student: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    cc: { type: 'string', example: '1234567890' },
                  },
                },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              totalItems: { type: 'number', example: 5 },
              itemCount: { type: 'number', example: 5 },
              itemsPerPage: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 1 },
              currentPage: { type: 'number', example: 1 },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 403,
      description:
        'Forbidden - Insufficient permissions (Secretary role required)',
    }),
    ApiResponse({
      status: 404,
      description: 'Permission not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Permission not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const GetStudentUnjustifiedAbsencesDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get unjustified absences for a student in a period',
      description:
        'Retrieves a paginated list of unjustified absences for a specific student within a given period.',
    }),
    ApiParam({
      name: 'periodId',
      description: 'ID of the period',
      example: 1,
    }),
    ApiParam({
      name: 'studentId',
      description: 'ID of the student',
      example: 1,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items per page (default: 10)',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: 'Unjustified absences retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                absenceId: { type: 'number', example: 1 },
                student: { type: 'string', example: 'John Doe' },
                studentCC: { type: 'string', example: '1234567890' },
                absenceDate: {
                  type: 'string',
                  format: 'date',
                  example: '2024-01-15',
                },
                startTime: { type: 'string', example: '08:00:00' },
                endTime: { type: 'string', example: '09:00:00' },
                subjectName: { type: 'string', example: 'Mathematics' },
                teacherNote: {
                  type: 'string',
                  example: 'Student was absent without justification',
                },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              totalItems: { type: 'number', example: 3 },
              itemCount: { type: 'number', example: 3 },
              itemsPerPage: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 1 },
              currentPage: { type: 'number', example: 1 },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiResponse({
      status: 404,
      description: 'Period or student not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Period not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const GetJustificableAbsencesDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get justificable absences for a student in a period',
      description:
        'Retrieves a list of absences that can be justified for a specific student within a given period.',
    }),
    ApiParam({
      name: 'periodId',
      description: 'ID of the period',
      example: 1,
    }),
    ApiParam({
      name: 'studentId',
      description: 'ID of the student',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Justificable absences retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            absenceId: { type: 'number', example: 1 },
            student: { type: 'string', example: 'John Doe' },
            studentCC: { type: 'string', example: '1234567890' },
            absenceDate: {
              type: 'string',
              format: 'date',
              example: '2024-01-15',
            },
            startTime: { type: 'string', example: '08:00:00' },
            endTime: { type: 'string', example: '09:00:00' },
            subjectName: { type: 'string', example: 'Mathematics' },
            teacherNote: { type: 'string', example: 'Student was absent' },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiResponse({
      status: 404,
      description: 'Period or student not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Period not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const GetSubjectGroupAbsenceReportDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get absence report for a subject group',
      description:
        'Retrieves a list of absence counts by student for a specific subject group, showing how many absences each student has.',
    }),
    ApiParam({
      name: 'subjectGroupId',
      description: 'ID of the subject group',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Absence report retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            absences: { type: 'number', example: 3 },
            subjectGroupId: { type: 'number', example: 1 },
            studentId: { type: 'number', example: 1 },
            student: { type: 'string', example: 'John Doe' },
            studentGender: {
              type: 'string',
              enum: ['MALE', 'FEMALE'],
              example: 'MALE',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 403,
      description:
        'Forbidden - Insufficient permissions (Teacher role required)',
    }),
    ApiResponse({
      status: 404,
      description: 'Subject group not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Subject group not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const GetSubjectGroupStudentAbsencesDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get absences for a student in a subject group',
      description:
        'Retrieves a list of absences for a specific student within a subject group.',
    }),
    ApiParam({
      name: 'subjectGroupId',
      description: 'ID of the subject group',
      example: 1,
    }),
    ApiParam({
      name: 'studentId',
      description: 'ID of the student',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Student absences retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            absenceDate: {
              type: 'string',
              format: 'date',
              example: '2024-01-15',
            },
            startTime: { type: 'string', example: '08:00:00' },
            endTime: { type: 'string', example: '09:00:00' },
            teacherNote: {
              type: 'string',
              example: 'Student was absent due to illness',
            },
            permission: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                status: { type: 'string', example: 'APPROVED' },
                reason: { type: 'string', example: 'Medical appointment' },
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 403,
      description:
        'Forbidden - Insufficient permissions (Teacher role required)',
    }),
    ApiResponse({
      status: 404,
      description: 'Subject group or student not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Subject group not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const GetStudentAbsencesCountBySubjectDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get absence count by subject for a student',
      description:
        'Retrieves a count of absences by subject for a specific student within a given period.',
    }),
    ApiParam({
      name: 'periodId',
      description: 'ID of the period',
      example: 1,
    }),
    ApiParam({
      name: 'studentId',
      description: 'ID of the student',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Absence count by subject retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            absences: { type: 'number', example: 3 },
            subjectName: { type: 'string', example: 'Mathematics' },
            subjectGroupId: { type: 'number', example: 1 },
            periodId: { type: 'number', example: 1 },
            studentId: { type: 'number', example: 1 },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Period or student not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Period not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const GetPeriodAbsencesDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all absences for a period',
      description:
        'Retrieves a paginated list of all absences within a given period, with optional search functionality.',
    }),
    ApiParam({
      name: 'periodId',
      description: 'ID of the period',
      example: 1,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items per page (default: 10)',
      example: 10,
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search term to filter absences by student name or subject',
      example: 'John',
    }),
    ApiResponse({
      status: 200,
      description: 'Period absences retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                absenceId: { type: 'number', example: 1 },
                student: { type: 'string', example: 'John Doe' },
                studentCC: { type: 'string', example: '1234567890' },
                absenceDate: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-15T00:00:00.000Z',
                },
                startTime: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-15T08:00:00.000Z',
                },
                endTime: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-15T09:00:00.000Z',
                },
                subjectName: { type: 'string', example: 'Mathematics' },
                teacherNote: { type: 'string', example: 'Student was absent' },
                permissionStatus: { type: 'string', example: 'PENDING' },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              totalItems: { type: 'number', example: 50 },
              itemCount: { type: 'number', example: 10 },
              itemsPerPage: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 5 },
              currentPage: { type: 'number', example: 1 },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Period not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Period not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const DeleteAbsenceDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete an absence',
      description: 'Permanently removes an absence record from the system.',
    }),
    ApiParam({
      name: 'absenceId',
      description: 'ID of the absence to delete',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Absence deleted successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          teacherNote: {
            type: 'string',
            example: 'Student was absent due to illness',
          },
          absenceDate: {
            type: 'string',
            format: 'date',
            example: '2024-01-15',
          },
          student: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Absence not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Absence not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};
