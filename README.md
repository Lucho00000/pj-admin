# Poder Judicial Admin

Sistema web de administración del Poder Judicial, Programador/a de Aplicaciones Informáticas Junior MF8 .  
Permite gestionar edificios, dependencias, empleados y traslados, con frontend en React y backend en Spring Boot.

## Tecnologías utilizadas:

### Frontend
- Vite
- React 19
- TypeScript
- Ant Design (AntD)

### Backend
- Spring Boot 3
- Java 21 (JDK)
- SQLite (embebido, sin instalación adicional)
- Spring Data JPA

## Requisitos previos:

Antes de ejecutar el proyecto, asegurarse de tener instalado:

- **Java 21 (JDK)**
- **Node.js 18 o superior** 
- **Git**
- **Maven**
- **Docker**

## Estructura del proyecto

pj-admin/
├─ README.md
├─ .gitignore
├─ docker-compose.yml
├─ frontend/ # Vite + React + TS
│ ├─ package.json
│ ├─ vite.config.ts
│ ├─ src/
│ └─ .env.example
└─ backend/ # Spring Boot + SQLite
├─ pom.xml
├─ mvnw / mvnw.cmd
├─ src/main/java/
├─ src/main/resources/application.properties
└─ Dockerfile

---

## Ejecución en entorno local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/pj-admin.git
cd pj-admin
```


### 2. Ejecutar el backend
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

El backend quedará disponible en:
http://localhost:8080
Health check:
http://localhost:8080/api/health

### 3. Ejecutar el frontend, en una nueva terminal:
```bash
cd frontend
npm install
npm run dev
```

El frontend quedará disponible en:
http://localhost:5173
