import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const HealthCheckDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Health check endpoint',
      description: 'Check if the service is running and healthy',
    }),
    ApiResponse({
      status: 200,
      description: 'Service is healthy',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'OK' },
          timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    }),
  );
};
