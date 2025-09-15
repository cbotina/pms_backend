<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Permission Management System (PMS) Backend - A NestJS application for managing student permissions and absences in educational institutions.

## Prerequisites

- Docker and Docker Compose

## Quick Start

Run the application using Docker:

### 1. Environment Setup

Copy the environment template and configure your settings:

```bash
cp .env.example .env.development.local
```

Edit `.env.development.local` with your configuration:

```bash
# Database Configuration
DB_DATABASE=pms_backend
DB_USER=pms_user
DB_PASSWORD=your_secure_password
DB_LOCAL_PORT=3306
DB_DOCKER_PORT=3306

# Application Configuration
APP_LOCAL_PORT=3000
APP_DOCKER_PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_DURATION=24h

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 2. Build and Start

```bash
# Build the application
./bin/build

# Start all services (MySQL, NestJS app, Nginx)
./bin/start

# Stop all services
./bin/stop
```

### 3. Access the Application

- **Application**: http://localhost
- **API Documentation**: http://localhost/api
- **Health Check**: http://localhost/health

## Docker Services

The application runs with the following services:

- **pms_backend**: NestJS application (Node.js 20)
- **mysql**: MySQL 5.7 database
- **nginx**: Reverse proxy and load balancer

### Service Details

| Service | Port | Description |
|---------|------|-------------|
| nginx | 80 | Reverse proxy, serves the application |
| pms_backend | 3000 | NestJS API server |
| mysql | 3306 | MySQL database |

### Development Features

- **Hot Reload**: Source code changes are automatically synced to the container
- **Database Persistence**: Data is persisted in Docker volumes
- **Health Checks**: Built-in health monitoring for all services
- **Environment Variables**: Easy configuration through `.env.development.local`

## Development

The application runs in development mode with hot reload enabled. Any changes to the source code will automatically be reflected in the running container.

### Development Commands

```bash
# View application logs
docker compose -f docker-compose-dev.yml logs -f pms_backend

# Access the application container shell
docker compose -f docker-compose-dev.yml exec pms_backend sh

# Restart only the application (keeps database running)
docker compose -f docker-compose-dev.yml restart pms_backend

# Rebuild and restart the application
./bin/build && ./bin/start
```

## Testing

Run tests inside the Docker container:

```bash
# Run unit tests
docker compose -f docker-compose-dev.yml exec pms_backend npm run test

# Run e2e tests
docker compose -f docker-compose-dev.yml exec pms_backend npm run test:e2e

# Run test coverage
docker compose -f docker-compose-dev.yml exec pms_backend npm run test:cov
```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Check what's using the port
lsof -i :80
lsof -i :3000
lsof -i :3306

# Stop conflicting services or change ports in .env.development.local
```

**Database connection issues:**
```bash
# Check if MySQL container is running
docker compose -f docker-compose-dev.yml ps

# View MySQL logs
docker compose -f docker-compose-dev.yml logs mysql

# Restart MySQL service
docker compose -f docker-compose-dev.yml restart mysql
```

**Application not starting:**
```bash
# View application logs
docker compose -f docker-compose-dev.yml logs pms_backend

# Rebuild the application
./bin/build
```

**Permission denied on scripts:**
```bash
# Make scripts executable
chmod +x bin/*
```

### Useful Commands

```bash
# View all container logs
docker compose -f docker-compose-dev.yml logs -f

# View specific service logs
docker compose -f docker-compose-dev.yml logs -f pms_backend

# Execute commands in running container
docker compose -f docker-compose-dev.yml exec pms_backend sh

# Clean up everything (removes containers, networks, volumes)
docker compose -f docker-compose-dev.yml down -v
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
