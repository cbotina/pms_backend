# Swagger Documentation Guidelines

## Overview

This guide outlines the standardized approach for creating Swagger documentation in this NestJS project. We follow a pattern of separating documentation decorators from controllers to maintain clean, readable code while providing comprehensive API documentation.

## File Structure

Every controller should have a corresponding documentation file:

```
src/
├── module-name/
│   ├── module-name.controller.ts          # Controller with endpoints
│   ├── module-name.controller.docs.ts     # Documentation decorators
│   ├── module-name.service.ts
│   └── dto/
│       ├── create-module-name.dto.ts
│       └── update-module-name.dto.ts
```

## Documentation File Pattern

### File Naming Convention
- **Controller**: `module-name.controller.ts`
- **Documentation**: `module-name.controller.docs.ts`
- Both files should be in the same directory

### Documentation Decorator Pattern

Each endpoint should have a corresponding documentation decorator function. Here's the standard structure:

```typescript
// module-name.controller.docs.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateModuleNameDto } from './dto/create-module-name.dto';
import { UpdateModuleNameDto } from './dto/update-module-name.dto';

export const CreateModuleNameDocs = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a new resource',
      description: 'Detailed description of what this endpoint does',
    }),
    ApiBody({
      type: CreateModuleNameDto,
      description: 'Resource information to create',
    }),
    ApiResponse({
      status: 201,
      description: 'Resource created successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Example Name' },
          // ... other properties
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
            example: ['name should not be empty'],
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
```

## How to Use Documentation Decorators

### Step 1: Import the Documentation Decorators

```typescript
import {
  CreateModuleNameDocs,
  GetModuleNameDocs,
  UpdateModuleNameDocs,
  DeleteModuleNameDocs,
  GetPaginatedModuleNamesDocs,
} from './module-name.controller.docs';
```

### Step 2: Apply the Decorator to Your Endpoint

```typescript
@Post()
@CreateModuleNameDocs()
create(@Body() createModuleNameDto: CreateModuleNameDto) {
  return this.moduleNameService.create(createModuleNameDto);
}

@Get(':id')
@GetModuleNameDocs()
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.moduleNameService.findOne(id);
}
```

## Documentation Elements

### Authentication
```typescript
ApiBearerAuth()
```

### Operation Details
```typescript
ApiOperation({
  summary: 'Brief description',
  description: 'Detailed description of what the endpoint does',
})
```

### Request Body (for POST/PATCH/PUT)
```typescript
ApiBody({
  type: CreateModuleNameDto,
  description: 'Resource information to create',
})
```

### Path Parameters
```typescript
ApiParam({
  name: 'id',
  description: 'ID of the resource',
  example: 1,
})
```

### Query Parameters (for GET endpoints)
```typescript
ApiQuery({
  name: 'page',
  required: false,
  type: Number,
  description: 'Page number (default: 1)',
  example: 1,
})
```

### Response Schemas
```typescript
ApiResponse({
  status: 200,
  description: 'Success description',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Example' },
    },
  },
})
```

## Standard Response Status Codes

Include these standard responses for most endpoints:

- **200/201**: Success responses
- **400**: Bad request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found
- **409**: Conflict (duplicate data, constraint violations)

## Best Practices

### 1. **Comprehensive Error Documentation**
Always document all possible error responses with realistic examples.

### 2. **Realistic Examples**
Use realistic data in your examples that matches your actual data structure.

### 3. **Clear Descriptions**
Write clear, concise descriptions that explain the business logic.

### 4. **Consistent Naming**
Follow the established naming conventions for decorators and files.

### 5. **Complete Schemas**
Provide complete response schemas that match your actual API responses.

### 6. **Role-Based Access**
Document which roles can access each endpoint in the description.

### 7. **Pagination Support**
For list endpoints, include pagination parameters and metadata in the response schema.
