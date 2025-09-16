# Permission Management System (PMS) - Backend Architecture

## Overview

The Permission Management System (PMS) is a NestJS-based backend application that follows a modular, layered architecture pattern. The system is designed with clear separation of concerns, where each component has a specific responsibility and communicates through well-defined interfaces.

## Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: Class-validator & Class-transformer
- **Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer with Handlebars templates
- **Security**: Helmet, Throttling, CORS
- **Testing**: Jest

## Architecture Overview

### Layered Architecture Pattern

The application follows a three-tier architecture:

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│         (Controllers + DTOs)        │
├─────────────────────────────────────┤
│            Business Layer           │
│           (Services + Logic)        │
├─────────────────────────────────────┤
│            Data Access Layer        │
│         (Entities + Repositories)   │
└─────────────────────────────────────┘
```

### Component Communication Flow

```
Client Request → Controller → Service → Repository → Database
                ↓
            Response ← DTO ← Entity ← Query Result
```

## Core Components

### 1. Controllers
**Purpose**: Handle HTTP requests and responses
**Responsibilities**:
- Route incoming requests to appropriate services
- Validate input using DTOs
- Transform responses
- Handle HTTP-specific concerns

**Communication**:
- Receives requests from clients
- Delegates business logic to services
- Returns responses to clients

### 2. Services
**Purpose**: Implement business logic and orchestrate operations
**Responsibilities**:
- Process business rules
- Coordinate between multiple repositories
- Handle complex operations
- Manage transactions

**Communication**:
- Called by controllers
- Interacts with repositories for data access
- May call other services for cross-cutting concerns

### 3. Repositories (TypeORM)
**Purpose**: Abstract data access operations
**Responsibilities**:
- Perform CRUD operations
- Execute complex queries
- Manage entity relationships
- Handle database transactions

**Communication**:
- Called by services
- Interacts directly with database
- Returns entities or raw data

### 4. Entities
**Purpose**: Represent database tables and business objects
**Responsibilities**:
- Define data structure
- Establish relationships
- Enforce constraints
- Provide type safety

**Communication**:
- Used by repositories for data mapping
- Referenced by services for business logic
- Transformed by DTOs for API responses

### 5. DTOs (Data Transfer Objects)
**Purpose**: Define data contracts for API communication
**Responsibilities**:
- Validate input data
- Transform data between layers
- Document API contracts
- Ensure type safety

**Communication**:
- Used by controllers for request/response validation
- Transform entities for API responses
- Define service method parameters

## Cross-Cutting Concerns

### Authentication & Authorization
- **Global Guards**: Applied to all routes by default
- **Role-based Access**: Decorators for endpoint protection
- **JWT Strategy**: Handles token validation
- **Communication**: Intercepts requests before reaching controllers

### Validation & Transformation
- **Global Pipes**: Applied to all incoming data
- **Class Validators**: DTO-based validation
- **Class Transformers**: Data transformation
- **Communication**: Processes data between client and controller

### Error Handling
- **Global Exception Filters**: Catch and transform errors
- **Custom Exceptions**: Business-specific error types
- **Communication**: Intercepts errors from any layer

### Logging & Monitoring
- **Global Interceptors**: Log requests and responses
- **Health Checks**: Monitor system status
- **Communication**: Observes all component interactions

## Module Architecture

### Feature Modules
Each feature follows a consistent structure:

```
feature-name/
├── feature-name.module.ts      # Module definition
├── feature-name.controller.ts  # HTTP endpoints
├── feature-name.service.ts     # Business logic
├── entities/                   # Database entities
├── dto/                       # Data transfer objects
└── *.spec.ts                  # Unit tests
```

### Shared Modules
Common functionality organized in shared modules:

```
common/
├── decorators/     # Custom decorators
├── guards/         # Authentication/authorization guards
├── interfaces/     # Type definitions
└── pipes/          # Custom validation pipes
```

## Database Architecture

### Entity Relationships
- **One-to-Many**: Parent entities reference multiple children
- **Many-to-One**: Child entities reference single parent
- **Many-to-Many**: Junction tables for complex relationships
- **Self-referencing**: Hierarchical data structures

### Communication Patterns
- **Lazy Loading**: Load related data on demand
- **Eager Loading**: Load related data immediately
- **Cascade Operations**: Propagate changes to related entities
- **Soft Deletes**: Mark entities as deleted without removing data

## API Design Patterns

### RESTful Conventions
- **Resource-based URLs**: Nouns representing entities
- **HTTP Methods**: GET, POST, PUT, PATCH, DELETE
- **Status Codes**: Standard HTTP response codes
- **Content Negotiation**: JSON as primary format

### Nested Resources
- **Hierarchical URLs**: Parent/child relationships
- **Consistent Patterns**: Predictable endpoint structure
- **Query Parameters**: Filtering, pagination, sorting

### Response Patterns
- **Consistent Structure**: Standardized response format
- **Pagination**: Cursor or page-based pagination
- **Error Responses**: Uniform error format
- **Metadata**: Include relevant metadata in responses

## Security Architecture

### Authentication Flow
```
Client → Login Endpoint → Auth Service → JWT Generation → Token Response
```

### Authorization Flow
```
Request → JWT Guard → Role Guard → Controller → Service
```

### Security Layers
- **Transport Security**: HTTPS enforcement
- **Input Validation**: DTO-based validation
- **Authentication**: JWT token verification
- **Authorization**: Role-based access control
- **Rate Limiting**: Request throttling
- **Security Headers**: Helmet middleware

## Configuration Management

### Environment-based Configuration
- **Development**: Local development settings
- **Staging**: Pre-production environment
- **Production**: Live environment settings

### Configuration Hierarchy
```
Environment Variables → Configuration Files → Application Settings
```

### Configuration Patterns
- **Validation**: Schema-based configuration validation
- **Type Safety**: Strongly typed configuration objects
- **Defaults**: Sensible default values
- **Secrets**: Secure secret management

## Development Guidelines

### Creating a New Module

1. **Generate Module Structure**:
   ```bash
   nest g module feature-name
   nest g controller feature-name
   nest g service feature-name
   ```

2. **Define Entity**:
   - Create entity class with TypeORM decorators
   - Define relationships with other entities
   - Add validation constraints

3. **Create DTOs**:
   - Request DTOs for input validation
   - Response DTOs for output formatting
   - Update DTOs for partial updates

4. **Implement Service**:
   - Inject required repositories
   - Implement business logic
   - Handle error cases
   - Add logging

5. **Create Controller**:
   - Define endpoints with proper decorators
   - Add authentication/authorization guards
   - Implement request/response handling
   - Add API documentation

6. **Add Tests**:
   - Unit tests for service methods
   - Integration tests for endpoints
   - Mock external dependencies

### Service Development Pattern

```typescript
@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Entity)
    private entityRepository: Repository<Entity>,
    private otherService: OtherService,
  ) {}

  async create(createDto: CreateDto): Promise<Entity> {
    // Validation
    // Business logic
    // Database operation
    // Return result
  }
}
```

### Controller Development Pattern

```typescript
@Controller('feature')
export class FeatureController {
  constructor(private featureService: FeatureService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createDto: CreateDto): Promise<ResponseDto> {
    return this.featureService.create(createDto);
  }
}
```

### Entity Development Pattern

```typescript
@Entity()
export class Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @ManyToOne(() => RelatedEntity)
  related: RelatedEntity;
}
```

## Testing Strategy

### Unit Testing
- **Service Methods**: Test business logic in isolation
- **Utility Functions**: Test helper functions
- **Mock Dependencies**: Use mocks for external services

### Integration Testing
- **API Endpoints**: Test complete request/response cycle
- **Database Operations**: Test with real database
- **Authentication**: Test security mechanisms

### Test Organization
```
feature-name/
├── feature-name.service.spec.ts
├── feature-name.controller.spec.ts
└── dto/
    └── create-feature.dto.spec.ts
```

## Monitoring & Observability

### Health Checks
- **Database Connectivity**: Verify database access
- **External Services**: Check third-party integrations
- **System Resources**: Monitor memory, CPU usage

### Logging Strategy
- **Request Logging**: Log all incoming requests
- **Error Logging**: Capture and log errors
- **Performance Logging**: Track response times
- **Business Logging**: Log important business events

### Metrics Collection
- **Response Times**: Track API performance
- **Error Rates**: Monitor system health
- **Usage Patterns**: Understand system usage
- **Resource Utilization**: Monitor system resources

This architecture provides a scalable, maintainable foundation that promotes code reusability, testability, and clear separation of concerns while maintaining flexibility for future enhancements.
