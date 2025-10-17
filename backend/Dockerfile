
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -DskipTests clean package

FROM eclipse-temurin:21-jre
WORKDIR /app

RUN mkdir -p /data

COPY --from=build /app/target/*.jar /app/app.jar

ENV SERVER_PORT=8080

HEALTHCHECK --interval=20s --timeout=3s --retries=5 \
  CMD curl -fsS http://localhost:${SERVER_PORT}/api/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
