import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateEnrollmentDto } from 'src/enrollments/dto/create-enrollment.dto';

export const AddEnrollmentToStudentDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Add enrollment to a student',
      description:
        'Create a new enrollment for a specific student in a subject group.',
    }),
    ApiParam({
      name: 'studentId',
      description: 'ID of the student',
      example: 1,
    }),
    ApiBody({
      type: CreateEnrollmentDto,
      description: 'Enrollment information to create',
    }),
    ApiResponse({
      status: 201,
      description: 'Enrollment added to student successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          studentId: { type: 'number', example: 1 },
          subjectGroupId: { type: 'number', example: 1 },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid enrollment data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'subjectGroupId should not be empty',
              'subjectGroupId must be a positive integer',
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
      description: 'Student or subject group not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Student not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description:
        'Conflict - Enrollment already exists for this student and subject group',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example:
              'Enrollment already exists for this student and subject group',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};

export const GetStudentEnrollmentsDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get student enrollments',
      description:
        'Retrieve paginated list of all enrollments for a specific student.',
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
      description: 'Student enrollments retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                studentId: { type: 'number', example: 1 },
                subjectGroupId: { type: 'number', example: 1 },
                subjectGroup: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Mathematics 101' },
                    subject: {
                      type: 'object',
                      properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'Mathematics' },
                      },
                    },
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
      description: 'Bad request - Invalid student ID or query parameters',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['studentId must be a positive integer'],
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
      description: 'Student not found',
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
