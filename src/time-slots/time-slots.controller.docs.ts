import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';

export const FindAllTimeSlotsDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all time slots',
      description: 'Retrieve all time slots in the system.',
    }),
    ApiResponse({
      status: 200,
      description: 'Time slots retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            startTime: { type: 'string', example: '08:00:00' },
            endTime: { type: 'string', example: '09:00:00' },
            dayOfWeek: { type: 'number', example: 1 },
            label: { type: 'string', example: 'Morning Session' },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
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
  );
};

export const FindOneTimeSlotDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get a specific time slot',
      description: 'Retrieve a time slot by its ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the time slot',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Time slot retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          startTime: { type: 'string', example: '08:00:00' },
          endTime: { type: 'string', example: '09:00:00' },
          dayOfWeek: { type: 'number', example: 1 },
          label: { type: 'string', example: 'Morning Session' },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid time slot ID',
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
      description: 'Time slot not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Time slot not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const UpdateTimeSlotDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update a time slot',
      description: 'Update an existing time slot with new information.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the time slot to update',
      example: 1,
    }),
    ApiBody({
      description: 'Time slot information to update (all fields are optional)',
      schema: {
        type: 'object',
        properties: {
          startTime: {
            type: 'string',
            description: 'Start time of the time slot',
            example: '08:30:00',
            format: 'time',
          },
          endTime: {
            type: 'string',
            description: 'End time of the time slot',
            example: '09:30:00',
            format: 'time',
          },
          dayOfWeek: {
            type: 'number',
            description: 'Day of the week (1-7, where 1 is Monday)',
            example: 1,
            minimum: 1,
            maximum: 7,
          },
          label: {
            type: 'string',
            description: 'Label for the time slot',
            example: 'Updated Morning Session',
            maxLength: 50,
          },
        },
        example: {
          startTime: '08:30:00',
          endTime: '09:30:00',
          label: 'Updated Morning Session',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Time slot updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          startTime: { type: 'string', example: '08:30:00' },
          endTime: { type: 'string', example: '09:30:00' },
          dayOfWeek: { type: 'number', example: 1 },
          label: { type: 'string', example: 'Updated Morning Session' },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T11:45:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid time slot data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'startTime must be a valid time format',
              'endTime must be after startTime',
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
      description: 'Time slot not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Time slot not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Time slot conflicts with existing schedule',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'Time slot conflicts with existing schedule',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};

export const RemoveTimeSlotDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a time slot',
      description: 'Remove a time slot from the system.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the time slot to delete',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Time slot deleted successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          startTime: { type: 'string', example: '08:00:00' },
          endTime: { type: 'string', example: '09:00:00' },
          dayOfWeek: { type: 'number', example: 1 },
          label: { type: 'string', example: 'Morning Session' },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid time slot ID',
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
      description: 'Time slot not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Time slot not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Time slot is being used by other entities',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example:
              'Cannot delete time slot as it is being used by subject groups',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};
