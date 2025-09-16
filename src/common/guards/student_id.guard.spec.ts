import { StudentIdGuard } from './student_id.guard';
import { ExecutionContext } from '@nestjs/common';
import { Roles } from '@users/entities/user.entity';

describe('StudentIdGuard', () => {
  let guard: StudentIdGuard;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    guard = new StudentIdGuard();
  });

  const createMockExecutionContext = (user: any, studentId: string) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          params: { studentId },
        }),
      }),
    } as ExecutionContext;
  };

  describe('canActivate', () => {
    it('should allow access for ADMIN role regardless of studentId', () => {
      // Arrange
      const user = { role: Roles.ADMIN, entityId: 1 };
      const studentId = '999';
      mockExecutionContext = createMockExecutionContext(user, studentId);

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should allow access when studentId matches user entityId', () => {
      // Arrange
      const user = { role: Roles.STUDENT, entityId: 123 };
      const studentId = '123';
      mockExecutionContext = createMockExecutionContext(user, studentId);

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should deny access when studentId does not match user entityId', () => {
      // Arrange
      const user = { role: Roles.STUDENT, entityId: 123 };
      const studentId = '456';
      mockExecutionContext = createMockExecutionContext(user, studentId);

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(false);
    });

    it('should deny access for non-ADMIN roles with mismatched studentId', () => {
      // Arrange
      const user = { role: Roles.TEACHER, entityId: 123 };
      const studentId = '456';
      mockExecutionContext = createMockExecutionContext(user, studentId);

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(false);
    });

    it('should handle string comparison correctly', () => {
      // Arrange
      const user = { role: Roles.STUDENT, entityId: 123 };
      const studentId = '123'; // String version
      mockExecutionContext = createMockExecutionContext(user, studentId);

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
    });
  });
});
