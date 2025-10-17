# ---------- Etapa de build ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos pom y resolvemos dependencias en caché
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline

# Copiamos el código fuente y construimos
COPY src ./src
RUN mvn -q -DskipTests clean package

# ---------- Etapa de runtime ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Creamos carpeta de datos para SQLite
RUN mkdir -p /data

# Copiamos el JAR construido
COPY --from=build /app/target/*.jar /app/app.jar

# Variable de puerto (por si querés sobreescribir)
ENV SERVER_PORT=8080

# Healthcheck básico contra /api/health
HEALTHCHECK --interval=20s --timeout=3s --retries=5 \
  CMD curl -fsS http://localhost:${SERVER_PORT}/api/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
