import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';

export const GetPeriodGroupsDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all groups for a period',
      description:
        'Retrieve a paginated list of all groups associated with the specified period',
    }),
    ApiParam({
      name: 'periodId',
      description: 'ID of the period to get groups for',
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
      description: 'Search term to filter groups by name',
      example: 'Grade 10',
    }),
    ApiResponse({
      status: 200,
      description: 'Groups retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Grade 10A' },
                semester: { type: 'string', example: '2024-1' },
                modality: {
                  type: 'string',
                  example: 'ACADEMIC',
                  enum: ['ACADEMIC', 'PEDAGOGIC'],
                },
                period: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: '2024 Academic Year' },
                  },
                },
                tutor: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    id: { type: 'number', example: 1 },
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Smith' },
                  },
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

export const AddGroupToPeriodDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Add a new group to a period',
      description:
        'Create a new group and associate it with the specified period',
    }),
    ApiParam({
      name: 'periodId',
      description: 'ID of the period to add the group to',
      example: 1,
    }),
    ApiBody({
      type: CreateGroupDto,
      description: 'Group information to create',
    }),
    ApiResponse({
      status: 201,
      description: 'Group created and added to period successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Grade 10A' },
          semester: { type: 'string', example: '2024-1' },
          modality: {
            type: 'string',
            example: 'ACADEMIC',
            enum: ['ACADEMIC', 'PEDAGOGIC'],
          },
          period: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: '2024 Academic Year' },
            },
          },
          tutor: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'number', example: 1 },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Smith' },
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
              'name should not be empty',
              'modality must be a valid enum value',
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
      description: 'Period or teacher not found',
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
