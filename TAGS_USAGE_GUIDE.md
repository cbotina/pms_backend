# Tags Enum Usage Guide

## Overview
The `Tags` enum in `src/config/swagger/swagger.config.ts` centralizes all API tags used in the application. This ensures consistency and makes it easy to update tag names across the entire application.

## Available Tags

```typescript
export enum Tags {
  HEALTH = 'Health',
  AUTHENTICATION = 'Authentication 🔐',
  PERIODS = 'Periods 🗓️',
  PERIOD_GROUPS = 'Period Groups 🅿️👥',
  GROUPS = 'Groups 👥',
  PERIOD_TIMESLOTS = 'Period timeslots 🗓️⌚',
  /// ... other tags
}
```

## How to Use

### In Controllers
```typescript
import { ApiTags } from '@nestjs/swagger';
import { Tags } from '../config/swagger/swagger.config';

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
6. **No Serialization Issues**: Swagger UI works without JavaScript errors

## Migration Guide

To migrate existing controllers:

1. Import the Tags enum:
   ```typescript
   import { Tags } from '../config/swagger/swagger.config';
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

## Best Practices

1. **Always use the enum**: Never hardcode tag strings in controllers
2. **Update both enum and priority list**: When adding new tags, update both the enum and the priority list in `swagger.config.ts`
3. **Consistent naming**: Use descriptive names with emojis for better UX
4. **Logical ordering**: Keep related tags together in the priority list
5. **Documentation**: Update this guide when adding new tags

## Troubleshooting

### Swagger UI JavaScript Errors
If you encounter JavaScript errors in Swagger UI:
- Ensure you're using hardcoded strings in the priority list (not enum references)
- Check that all tag names match exactly between the enum and priority list

### Import Errors
If you get import errors:
- Verify the import path: `import { Tags } from '../config/swagger/swagger.config';`
- Make sure the Tags enum is exported from `swagger.config.ts`
