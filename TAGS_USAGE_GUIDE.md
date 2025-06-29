# Tags Enum Usage Guide

## Overview
The `Tags` enum in `src/config/swagger/swagger.constants.ts` centralizes all API tags used in the application. This ensures consistency and makes it easy to update tag names across the entire application.

## Available Tags

```typescript
export enum Tags {
  HEALTH = 'Health',
  AUTHENTICATION = 'Authentication 🔐',
  PERIODS = 'Periods 🗓️',
  PERIOD_GROUPS = 'Period Groups 🅿️👥',
  GROUPS = 'Groups 👥',
  /// ... more tags
}
```

## How to Use

### In Controllers
```typescript
import { ApiTags } from '@nestjs/swagger';
import { Tags } from '../config/swagger/swagger.constants';

@ApiTags(Tags.USERS)
@Controller('users')
export class UsersController {
  // ... controller methods
}
```

## Benefits

1. **Single Source of Truth**: All tag names are defined in one place
2. **Type Safety**: TypeScript will catch typos and ensure consistency
3. **Easy Updates**: Change a tag name once and it updates everywhere
4. **IDE Support**: Autocomplete and refactoring support
5. **Consistency**: Ensures all controllers use the same tag format

## Migration Guide

To migrate existing controllers:

1. Import the Tags enum:
   ```typescript
   import { Tags } from '../config/swagger/swagger.constants';
   ```

2. Replace hardcoded strings with enum values:
   ```typescript
   // Before
   @ApiTags('Users 👤')
   
   // After
   @ApiTags(Tags.USERS)
   ```

## Tag Priority Order

The tags are automatically sorted in the Swagger UI according to the priority order defined in `swagger.config.ts`. 
