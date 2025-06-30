import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';

export const SetActivePeriodDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Set period as active',
      description:
        'Activate a specific period and deactivate all others. The active period is the one that the users see in the mobile/desktop app.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the period to activate',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Period activated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: '2024-A' },
          active: { type: 'boolean', example: true },
          startDate: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          endDate: { type: 'string', example: '2024-06-01T00:00:00.000Z' },
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

export const GetActivePeriodDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get active period',
      description: 'Retrieve the currently active period',
    }),
    ApiResponse({
      status: 200,
      description: 'Active period retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: '2024-A' },
          active: { type: 'boolean', example: true },
          startDate: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          endDate: { type: 'string', example: '2024-06-01T00:00:00.000Z' },
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
      description: 'No active period found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'No active period found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const CreatePeriodDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a new period',
      description: 'Create a new academic period with start and end dates',
    }),
    ApiBody({
      type: CreatePeriodDto,
      description: 'Period information to create',
    }),
    ApiResponse({
      status: 201,
      description: 'Period created successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: '2024-A' },
          active: { type: 'boolean', example: false },
          startDate: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          endDate: { type: 'string', example: '2024-06-01T00:00:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid data provided',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'name should not be empty',
              'startDate must be a valid date string',
              'endDate must be a valid date string',
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
      status: 409,
      description: 'Period with this name already exists',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'Period with this name already exists',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};

export const GetPeriodDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get period by ID',
      description: 'Retrieve a specific period by its ID',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the period to retrieve',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Period retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: '2024-A' },
          active: { type: 'boolean', example: false },
          startDate: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          endDate: { type: 'string', example: '2024-06-01T00:00:00.000Z' },
          timeSlots: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                startTime: { type: 'string', example: '08:00' },
                endTime: { type: 'string', example: '09:00' },
              },
            },
          },
          groups: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Grade 10A' },
                semester: { type: 'string', example: '2024-1' },
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

export const UpdatePeriodDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update period',
      description: 'Update an existing period with new information',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the period to update',
      example: 1,
    }),
    ApiBody({
      type: UpdatePeriodDto,
      description: 'Period information to update',
    }),
    ApiResponse({
      status: 200,
      description: 'Period updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: '2024-A' },
          active: { type: 'boolean', example: false },
          startDate: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          endDate: { type: 'string', example: '2024-06-01T00:00:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid data provided',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'name should not be empty',
              'startDate must be a valid date string',
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
      description: 'Period with this name already exists',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'Period with this name already exists',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};

export const DeletePeriodDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete period',
      description:
        'Delete a period from the system. Cannot delete if it has associated groups or time slots.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the period to delete',
      example: 1,
    }),
    ApiResponse({
      status: 204,
      description: 'Period deleted successfully',
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
    ApiResponse({
      status: 409,
      description: 'Cannot delete period with associated data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example:
              'Cannot delete period with associated groups or time slots',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};

export const GetPaginatedPeriodsDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all periods',
      description: 'Retrieve a paginated list of all periods in the system',
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
      description: 'Search term to filter periods by name',
      example: '2024',
    }),
    ApiResponse({
      status: 200,
      description: 'Periods retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: '2024-A' },
                active: { type: 'boolean', example: false },
                startDate: {
                  type: 'string',
                  example: '2024-01-01T00:00:00.000Z',
                },
                endDate: {
                  type: 'string',
                  example: '2024-06-01T00:00:00.000Z',
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
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
  );
};
