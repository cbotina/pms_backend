import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateSubjectGroupDto } from './dto/create-subject-group.dto';

export const CreateSubjectGroupDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Add subject to group',
      description:
        'Create a new subject group by adding a subject to a specific group with a teacher and hours.',
    }),
    ApiParam({
      name: 'groupId',
      description: 'ID of the group to add the subject to',
      example: 1,
    }),
    ApiBody({
      type: CreateSubjectGroupDto,
      description: 'Subject group information to create',
    }),
    ApiResponse({
      status: 201,
      description: 'Subject group created successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          hours: { type: 'number', example: 4 },
          teacher: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' },
              email: { type: 'string', example: 'john.doe@school.edu' },
            },
          },
          subject: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Mathematics' },
            },
          },
          group: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Grade 10A' },
            },
          },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid subject group data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'teacherId should not be empty',
              'subjectId must be a positive integer',
            ],
          },
          error: { type: 'string', example: 'Bad Request' },
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
        'Forbidden - Insufficient permissions (secretary role required)',
    }),
    ApiResponse({
      status: 404,
      description: 'Group, teacher, or subject not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Teacher not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const FindAllSubjectGroupsDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all subject groups for a group',
      description:
        'Retrieve paginated list of all subject groups associated with a specific group.',
    }),
    ApiParam({
      name: 'groupId',
      description: 'ID of the group',
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
      description: 'Subject groups retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                hours: { type: 'number', example: 4 },
                teacher: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    email: { type: 'string', example: 'john.doe@school.edu' },
                  },
                },
                subject: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Mathematics' },
                  },
                },
                createdAt: {
                  type: 'string',
                  example: '2024-01-15T10:30:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  example: '2024-01-15T10:30:00.000Z',
                },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              totalItems: { type: 'number', example: 8 },
              itemCount: { type: 'number', example: 10 },
              itemsPerPage: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 1 },
              currentPage: { type: 'number', example: 1 },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid group ID or query parameters',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['groupId must be a positive integer'],
          },
          error: { type: 'string', example: 'Bad Request' },
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
      description: 'Group not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Group not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const FindOneSubjectGroupDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get a specific subject group',
      description: 'Retrieve a subject group by its ID.',
    }),
    ApiParam({
      name: 'subjectGroupId',
      description: 'ID of the subject group',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Subject group retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          hours: { type: 'number', example: 4 },
          teacher: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' },
              email: { type: 'string', example: 'john.doe@school.edu' },
            },
          },
          subject: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Mathematics' },
            },
          },
          group: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Grade 10A' },
            },
          },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid subject group ID',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['subjectGroupId must be a positive integer'],
          },
          error: { type: 'string', example: 'Bad Request' },
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

export const UpdateSubjectGroupDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update a subject group',
      description: 'Update an existing subject group with new information.',
    }),
    ApiParam({
      name: 'subjectGroupId',
      description: 'ID of the subject group to update',
      example: 1,
    }),
    ApiBody({
      description:
        'Subject group information to update (all fields are optional)',
      schema: {
        type: 'object',
        properties: {
          teacherId: {
            type: 'number',
            description: 'ID of the teacher assigned to this subject group',
            example: 2,
          },
          subjectId: {
            type: 'number',
            description: 'ID of the subject for this group',
            example: 1,
          },
          hours: {
            type: 'number',
            description: 'Number of hours allocated for this subject group',
            example: 6,
          },
        },
        example: {
          teacherId: 2,
          hours: 6,
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Subject group updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          hours: { type: 'number', example: 6 },
          teacher: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              firstName: { type: 'string', example: 'Jane' },
              lastName: { type: 'string', example: 'Smith' },
              email: { type: 'string', example: 'jane.smith@school.edu' },
            },
          },
          subject: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Mathematics' },
            },
          },
          group: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Grade 10A' },
            },
          },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T11:45:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid subject group data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'teacherId must be a positive integer',
              'hours must be a positive number',
            ],
          },
          error: { type: 'string', example: 'Bad Request' },
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

export const RemoveSubjectGroupDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a subject group',
      description: 'Remove a subject group from the system.',
    }),
    ApiParam({
      name: 'subjectGroupId',
      description: 'ID of the subject group to delete',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Subject group deleted successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          hours: { type: 'number', example: 4 },
          teacher: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' },
              email: { type: 'string', example: 'john.doe@school.edu' },
            },
          },
          subject: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Mathematics' },
            },
          },
          group: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Grade 10A' },
            },
          },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid subject group ID',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['subjectGroupId must be a positive integer'],
          },
          error: { type: 'string', example: 'Bad Request' },
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
    ApiResponse({
      status: 409,
      description: 'Conflict - Subject group has enrollments or time slots',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example:
              'Cannot delete subject group as it has enrollments or time slots',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};

export const GetTeacherSubjectGroupsDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get teacher subject groups',
      description:
        'Retrieve paginated list of all subject groups assigned to a specific teacher in a period.',
    }),
    ApiParam({
      name: 'periodId',
      description: 'ID of the period',
      example: 1,
    }),
    ApiParam({
      name: 'teacherId',
      description: 'ID of the teacher',
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
      description: 'Number of items per page (default: 20)',
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: 'Teacher subject groups retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                hours: { type: 'number', example: 4 },
                subject: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Mathematics' },
                  },
                },
                group: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Grade 10A' },
                  },
                },
                createdAt: {
                  type: 'string',
                  example: '2024-01-15T10:30:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  example: '2024-01-15T10:30:00.000Z',
                },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              totalItems: { type: 'number', example: 5 },
              itemCount: { type: 'number', example: 5 },
              itemsPerPage: { type: 'number', example: 20 },
              totalPages: { type: 'number', example: 1 },
              currentPage: { type: 'number', example: 1 },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid parameters',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['periodId must be a positive integer'],
          },
          error: { type: 'string', example: 'Bad Request' },
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
        'Forbidden - Insufficient permissions (teacher role required)',
    }),
    ApiResponse({
      status: 404,
      description: 'Period or teacher not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Teacher not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const GetSubjectGroupStudentsDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get subject group students',
      description:
        'Retrieve all students enrolled in a specific subject group.',
    }),
    ApiParam({
      name: 'subjectGroupId',
      description: 'ID of the subject group',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Subject group students retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            cc: { type: 'string', example: '1234567890' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', example: 'john.doe@student.edu' },
            groupId: { type: 'number', example: 1 },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid subject group ID',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['subjectGroupId must be a positive integer'],
          },
          error: { type: 'string', example: 'Bad Request' },
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
        'Forbidden - Insufficient permissions (teacher role required)',
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
