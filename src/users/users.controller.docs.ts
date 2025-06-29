import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

export const CreateUserDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new user',
      description:
        'Create a new user account. For STUDENT and TEACHER roles, the user must already exist in their respective tables. For ADMIN and SECRETARY roles, a password is required.',
    }),
    ApiBody({
      type: CreateUserDto,
      description: 'User information to create',
    }),
    ApiResponse({
      status: 201,
      description: 'User created successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          email: { type: 'string', example: 'user@example.com' },
          role: {
            type: 'string',
            example: 'STUDENT',
            enum: ['STUDENT', 'TEACHER', 'ADMIN', 'SECRETARY'],
          },
          entityId: { type: 'number', example: 123, nullable: true },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description:
        'Bad request - Invalid data or missing password for ADMIN/SECRETARY',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'string',
            example: 'ADMIN user must have a password',
          },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Student or teacher not found',
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
      description: 'User already exists',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'User with this email already exists',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
  );
};

export const GetAllUsersDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all users',
      description: 'Retrieve a paginated list of all users in the system',
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
      description: 'Search term to filter users by email or role',
      example: 'student',
    }),
    ApiResponse({
      status: 200,
      description: 'Users retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                email: { type: 'string', example: 'user@example.com' },
                role: { type: 'string', example: 'STUDENT' },
                entityId: { type: 'number', example: 123, nullable: true },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              totalItems: { type: 'number', example: 50 },
              itemCount: { type: 'number', example: 10 },
              itemsPerPage: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 5 },
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

export const DeleteUserDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete user',
      description: 'Delete a user from the system',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the user to delete',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'User deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User deleted successfully' },
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
      description: 'User not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'User not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const ChangePasswordDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Change user password',
      description:
        'Change the password for the authenticated user. Users can only change their own password.',
    }),
    ApiParam({
      name: 'userId',
      description: 'ID of the user whose password will be changed',
      example: 1,
    }),
    ApiBody({
      type: ChangePasswordDto,
      description: 'Current and new password information',
    }),
    ApiResponse({
      status: 200,
      description: 'Password changed successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Password changed successfully' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid password format',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'newPassword is not strong enough',
              'oldPassword should not be empty',
            ],
          },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid current password or missing token',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Wrong Password' },
          error: { type: 'string', example: 'Unauthorized' },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - User can only change their own password',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Forbidden resource' },
          error: { type: 'string', example: 'Forbidden' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'User not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

export const RestorePasswordDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Restore user password',
      description:
        "Restore a user's password to their CC (identity document number). This operation is only available for STUDENT and TEACHER roles. For students and teachers, their password will be reset to their CC number.",
    }),
    ApiParam({
      name: 'userId',
      description: 'ID of the user whose password will be restored',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Password restored successfully',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Password restored successfully',
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
        'Forbidden - Password restoration is only available for students and teachers',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: {
            type: 'string',
            example:
              'Password restoration is only available for students and teachers',
          },
          error: { type: 'string', example: 'Forbidden' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'User not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};
