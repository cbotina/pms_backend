import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateTeacherDto } from './dto/create-teacher.dto';

export const CreateTeacherDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a new teacher',
      description: 'Create a new teacher account in the system.',
    }),
    ApiBody({
      type: CreateTeacherDto,
      description: 'Teacher information to create',
    }),
    ApiResponse({
      status: 201,
      description: 'Teacher created successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          cc: { type: 'string', example: '1234567890' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          email: { type: 'string', example: 'john.doe@school.edu' },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid teacher data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['cc should not be empty', 'email must be a valid email'],
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
      status: 409,
      description: 'Conflict - Teacher with this email already exists',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'Teacher with this email already exists',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};

export const FindAllTeachersDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all teachers',
      description: 'Retrieve paginated list of all teachers in the system.',
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
      description: 'Search term to filter teachers by name or email',
      example: 'john',
    }),
    ApiResponse({
      status: 200,
      description: 'Teachers retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                cc: { type: 'string', example: '1234567890' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                email: { type: 'string', example: 'john.doe@school.edu' },
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
              totalItems: { type: 'number', example: 25 },
              itemCount: { type: 'number', example: 10 },
              itemsPerPage: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 3 },
              currentPage: { type: 'number', example: 1 },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid query parameters',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['page must be a positive integer'],
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
  );
};

export const FindOneTeacherDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get a specific teacher',
      description: 'Retrieve a teacher by their ID. ',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the teacher',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Teacher retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          cc: { type: 'string', example: '1234567890' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          email: { type: 'string', example: 'john.doe@school.edu' },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid teacher ID',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['id must be a positive integer'],
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
      description: 'Teacher not found',
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

export const UpdateTeacherDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update a teacher',
      description: 'Update an existing teacher with new information.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the teacher to update',
      example: 1,
    }),
    ApiBody({
      description: 'Teacher information to update (all fields are optional)',
      schema: {
        type: 'object',
        properties: {
          cc: {
            type: 'string',
            description: 'Citizen card number of the teacher',
            example: '1234567890',
            maxLength: 15,
          },
          firstName: {
            type: 'string',
            description: 'First name of the teacher',
            example: 'John',
            maxLength: 250,
          },
          lastName: {
            type: 'string',
            description: 'Last name of the teacher',
            example: 'Smith',
            maxLength: 250,
          },
          email: {
            type: 'string',
            description: 'Email address of the teacher',
            example: 'john.smith@school.edu',
            format: 'email',
          },
        },
        example: {
          cc: '1234567890',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@school.edu',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Teacher updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          cc: { type: 'string', example: '1234567890' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Smith' },
          email: { type: 'string', example: 'john.smith@school.edu' },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T11:45:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid teacher data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'email must be a valid email',
              'firstName should not be empty',
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
      description: 'Teacher not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Teacher not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Email already exists',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'Teacher with this email already exists',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};

export const RemoveTeacherDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a teacher',
      description: 'Remove a teacher from the system.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the teacher to delete',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Teacher deleted successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          cc: { type: 'string', example: '1234567890' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          email: { type: 'string', example: 'john.doe@school.edu' },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid teacher ID',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['id must be a positive integer'],
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
      description: 'Teacher not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Teacher not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Teacher is associated with subject groups',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example:
              'Cannot delete teacher as they are associated with subject groups',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};
