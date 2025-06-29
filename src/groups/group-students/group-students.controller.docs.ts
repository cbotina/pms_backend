import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PromoteStudentsDto } from 'src/groups/dto/promote-students.dto';

export const GetAllGroupStudentsDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all students in a group',
      description:
        'Retrieve paginated list of all students enrolled in a specific group.',
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
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search term to filter students by name or email',
      example: 'john',
    }),
    ApiResponse({
      status: 200,
      description: 'Group students retrieved successfully',
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
                email: { type: 'string', example: 'john.doe@student.edu' },
                groupId: { type: 'number', example: 1 },
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

export const PromoteStudentsDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Promote students to a new group',
      description:
        'Move all students from the current group to a new group. This is typically used when students advance to the next grade level.',
    }),
    ApiParam({
      name: 'groupId',
      description: 'ID of the current group (source group)',
      example: 1,
    }),
    ApiBody({
      type: PromoteStudentsDto,
      description: 'Information about the promotion including the target group',
    }),
    ApiResponse({
      status: 200,
      description: 'Students promoted successfully',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Students promoted successfully',
          },
          promotedCount: { type: 'number', example: 25 },
          fromGroupId: { type: 'number', example: 1 },
          toGroupId: { type: 'number', example: 2 },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid promotion data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'newGroupId should not be empty',
              'newGroupId must be a positive integer',
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
      description: 'Source or target group not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Target group not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description:
        'Conflict - Cannot promote to the same group or other constraint violation',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'Cannot promote students to the same group',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};
