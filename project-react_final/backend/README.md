# AAMS Backend

This is the Spring Boot backend for AAMS.

## Setup

1. Ensure Java 17+ and Maven are installed.
2. Navigate to the backend directory.
3. Run `mvn clean install` to build the project.
4. Run `mvn spring-boot:run` to start the server.

## API Endpoints

- GET /api/hello - Test endpoint

The server will run on http://localhost:8080

## Database

Uses H2 in-memory database for development. Access console at http://localhost:8080/h2-console
