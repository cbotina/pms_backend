import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateSubjectGroupTimeSlotDto } from './dto/create-subject-group-time-slot.dto';
import { WeekDay } from './entities/subject-group-time-slot.entity';

export const CreateSubjectGroupTimeSlotDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Add a time slot to a subject group',
      description:
        'Associates a specific time slot with a subject group for a particular day of the week. This creates the schedule for when the subject group meets.',
    }),
    ApiParam({
      name: 'subjectGroupId',
      description: 'ID of the subject group to add the time slot to',
      example: 1,
    }),
    ApiBody({
      type: CreateSubjectGroupTimeSlotDto,
      description: 'Time slot information to associate with the subject group',
    }),
    ApiResponse({
      status: 201,
      description: 'Time slot successfully added to subject group',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          day: {
            type: 'string',
            enum: Object.values(WeekDay),
            example: 'MON',
          },
          timeSlot: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              startTime: { type: 'string', example: '08:00:00' },
              endTime: { type: 'string', example: '09:00:00' },
            },
          },
          subjectGroup: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Math 101 - Group A' },
            },
          },
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
              'timeSlotId should not be empty',
              'day must be a valid enum value',
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
        'Forbidden - Insufficient permissions (Secretary role required)',
    }),
    ApiResponse({
      status: 404,
      description: 'Subject group or time slot not found',
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

export const GetSubjectGroupTimeSlotsDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all time slots for a subject group',
      description:
        'Retrieves a paginated list of all time slots associated with a specific subject group, showing when the group meets throughout the week.',
    }),
    ApiParam({
      name: 'subjectGroupId',
      description: 'ID of the subject group to get time slots for',
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
                day: {
                  type: 'string',
                  enum: Object.values(WeekDay),
                  example: 'MON',
                },
                timeSlot: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    startTime: { type: 'string', example: '08:00:00' },
                    endTime: { type: 'string', example: '09:00:00' },
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

export const GetSubjectGroupTimeSlotDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get a specific subject group time slot',
      description:
        'Retrieves detailed information about a specific time slot association for a subject group.',
    }),
    ApiParam({
      name: 'subjetcGroupTimeSlotId',
      description: 'ID of the subject group time slot to retrieve',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Subject group time slot retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          day: {
            type: 'string',
            enum: Object.values(WeekDay),
            example: 'MON',
          },
          timeSlot: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              startTime: { type: 'string', example: '08:00:00' },
              endTime: { type: 'string', example: '09:00:00' },
            },
          },
          subjectGroup: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Math 101 - Group A' },
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
      description: 'Subject group time slot not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: {
            type: 'string',
            example: 'Subject group time slot not found',
          },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const UpdateSubjectGroupTimeSlotDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update a subject group time slot',
      description:
        'Updates the time slot or day association for a specific subject group time slot. All fields are optional.',
    }),
    ApiParam({
      name: 'subjetcGroupTimeSlotId',
      description: 'ID of the subject group time slot to update',
      example: 1,
    }),
    ApiBody({
      description: 'Time slot information to update (all fields are optional)',
      schema: {
        type: 'object',
        properties: {
          timeSlotId: {
            type: 'number',
            description: 'ID of the time slot to associate',
            example: 2,
          },
          day: {
            type: 'string',
            description: 'Day of the week for this time slot',
            enum: Object.values(WeekDay),
            example: 'TUE',
          },
        },
        example: {
          timeSlotId: 2,
          day: 'TUE',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Subject group time slot updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          day: {
            type: 'string',
            enum: Object.values(WeekDay),
            example: 'TUE',
          },
          timeSlot: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              startTime: { type: 'string', example: '09:00:00' },
              endTime: { type: 'string', example: '10:00:00' },
            },
          },
          subjectGroup: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Math 101 - Group A' },
            },
          },
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
            example: ['day must be a valid enum value'],
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
        'Forbidden - Insufficient permissions (Secretary role required)',
    }),
    ApiResponse({
      status: 404,
      description: 'Subject group time slot not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: {
            type: 'string',
            example: 'Subject group time slot not found',
          },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const DeleteSubjectGroupTimeSlotDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a subject group time slot',
      description:
        "Removes a time slot association from a subject group, effectively removing that time from the group's schedule.",
    }),
    ApiParam({
      name: 'subjetcGroupTimeSlotId',
      description: 'ID of the subject group time slot to delete',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Subject group time slot deleted successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          day: {
            type: 'string',
            enum: Object.values(WeekDay),
            example: 'MON',
          },
          timeSlot: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              startTime: { type: 'string', example: '08:00:00' },
              endTime: { type: 'string', example: '09:00:00' },
            },
          },
          subjectGroup: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Math 101 - Group A' },
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
      description: 'Subject group time slot not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: {
            type: 'string',
            example: 'Subject group time slot not found',
          },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};
