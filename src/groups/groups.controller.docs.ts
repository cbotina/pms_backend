import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateGroupDto } from './dto/update-group.dto';

export const GetGroupDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get group by ID',
      description:
        'Retrieve a specific group by its ID with related information',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the group to retrieve',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Group retrieved successfully',
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
              name: { type: 'string', example: '2024-A' },
              active: { type: 'boolean', example: true },
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
          students: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                firstName: { type: 'string', example: 'Alice' },
                lastName: { type: 'string', example: 'Johnson' },
              },
            },
          },
          subjectGroups: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                subject: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Mathematics' },
                  },
                },
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

export const UpdateGroupDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update group',
      description: 'Update an existing group with new information',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the group to update',
      example: 1,
    }),
    ApiBody({
      description: 'Group information to update (all fields are optional)',
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the group',
            example: 'Grade 10A',
            maxLength: 25,
          },
          semester: {
            type: 'string',
            description: 'Semester of the group',
            example: '2024-1',
            maxLength: 25,
          },
          modality: {
            type: 'string',
            description: 'Modality of the group',
            enum: ['ACADEMIC', 'PEDAGOGIC'],
            example: 'ACADEMIC',
          },
          teacherId: {
            type: 'number',
            description: 'ID of the teacher assigned as tutor (optional)',
            example: 1,
            nullable: true,
          },
        },
        example: {
          name: 'Grade 10A Updated',
          semester: '2024-2',
          modality: 'ACADEMIC',
          teacherId: 2,
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Group updated successfully',
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
              name: { type: 'string', example: '2024-A' },
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
      description: 'Group or teacher not found',
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

export const DeleteGroupDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete group',
      description:
        'Delete a group from the system. Cannot delete if it has associated students or subject groups.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the group to delete',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Group deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Group deleted successfully' },
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
    ApiResponse({
      status: 409,
      description: 'Cannot delete group with associated data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example:
              'Cannot delete group with associated students or subject groups',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};

export const GenerateEnrollmentsDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Generate enrollments for group',
      description:
        'Automatically create `enrollment` records for all students in the `group` across all `subject_groups`. Each student will be enrolled in every `subject_group` associated with this `group`. This is typically used at the beginning of a semester to set up all student enrollments at once. Individual special scenarios (e.g. students repeating a subject) must be handled individually after this operation.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the group to generate enrollments for',
      example: 1,
    }),
    ApiResponse({
      status: 201,
      description: 'Enrollments generated successfully',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Enrollments generated successfully',
          },
          count: { type: 'number', example: 25 },
          enrollments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                student: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    firstName: { type: 'string', example: 'Alice' },
                    lastName: { type: 'string', example: 'Johnson' },
                  },
                },
                group: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Grade 10A' },
                  },
                },
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
    ApiResponse({
      status: 409,
      description: 'Enrollments already exist for this group',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'Enrollments already exist for this group',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};

export const GenerateUsersDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Generate user accounts for group students',
      description:
        'Automatically create user accounts for all students in the specified group who do not already have accounts',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the group to generate user accounts for',
      example: 1,
    }),
    ApiResponse({
      status: 201,
      description: 'User accounts generated successfully',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'User accounts generated successfully',
          },
          createdCount: { type: 'number', example: 15 },
          existingCount: { type: 'number', example: 10 },
          users: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                email: { type: 'string', example: 'student1@example.com' },
                role: { type: 'string', example: 'STUDENT' },
                entityId: { type: 'number', example: 1 },
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
    ApiResponse({
      status: 409,
      description: 'Some user accounts already exist',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'Some students already have user accounts',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};
