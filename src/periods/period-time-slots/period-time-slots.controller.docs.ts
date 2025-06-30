import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateTimeSlotDto } from 'src/time-slots/dto/create-time-slot.dto';
import { CopyTimeSlotsDto } from 'src/time-slots/dto/copy-time-slots.dto';

export const GetPeriodTimeSlotsDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get time slots for a specific period',
      description:
        'Retrieve paginated time slots associated with a specific period.',
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
      description:
        'Search term to filter time slots. Could be either label or startTime',
      example: 'morning',
    }),
    ApiResponse({
      status: 200,
      description: 'Time slots retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                startTime: { type: 'string', example: '08:00:00' },
                endTime: { type: 'string', example: '09:00:00' },
                dayOfWeek: { type: 'number', example: 1 },
                periodId: { type: 'number', example: 1 },
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
      description: 'Bad request - Invalid period ID or query parameters',
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
      description: 'Forbidden - Insufficient permissions',
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

export const AddTimeSlotToPeriodDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Add a time slot to a period',
      description:
        'Create a new time slot and associate it with a specific period.',
    }),
    ApiParam({
      name: 'periodId',
      description: 'ID of the period to add the time slot to',
      example: 1,
    }),
    ApiBody({
      type: CreateTimeSlotDto,
      description: 'Time slot information to create',
    }),
    ApiResponse({
      status: 201,
      description: 'Time slot added to period successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          startTime: { type: 'string', example: '08:00:00' },
          endTime: { type: 'string', example: '09:00:00' },
          dayOfWeek: { type: 'number', example: 1 },
          periodId: { type: 'number', example: 1 },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
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
              'startTime should not be empty',
              'endTime should not be empty',
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
    ApiResponse({
      status: 409,
      description:
        'Conflict - Time slot already exists for this period and time',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'Time slot already exists for this period and time',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};

export const ImportTimeSlotsFromPeriodDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Import time slots from another period',
      description:
        'Copy time slots from a source period to the current period.',
    }),
    ApiParam({
      name: 'periodId',
      description: 'ID of the target period to import time slots to',
      example: 1,
    }),
    ApiBody({
      type: CopyTimeSlotsDto,
      description: 'Source period information for copying time slots',
    }),
    ApiResponse({
      status: 201,
      description: 'Time slots imported successfully',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Time slots imported successfully',
          },
          importedCount: { type: 'number', example: 5 },
          periodId: { type: 'number', example: 1 },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid source period data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['sourcePeriodId should not be empty'],
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
      description: 'Source or target period not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Source period not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Time slots already exist in target period',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'Some time slots already exist in the target period',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};
