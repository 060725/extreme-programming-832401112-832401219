# Build stage: Spring Boot 2.3.x is validated on JDK 8 / 11, so use JDK 11 here.
FROM maven:3.8.8-eclipse-temurin-11 AS build

WORKDIR /app

# Cache dependencies first.
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -q -DskipTests package

# Runtime stage
FROM eclipse-temurin:11-jre

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]
