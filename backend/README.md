# Poder Judicial Admin – Backend (Spring Boot + SQLite)

## Requisitos
- Java 21 (JDK)
- (Opcional) Maven; si no, usar Maven Wrapper (`mvnw.cmd`)
- SQLite JDBC viene embebido (no requiere instalar SQLite)

## Correr en desarrollo
```bash
cd backend
.\mvnw.cmd spring-boot:run
# Health check:
# http://localhost:8080/api/health
