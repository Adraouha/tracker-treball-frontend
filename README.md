# Tracker Treball

Sistema de control horario, gestion de pausas y administracion de personal conforme a la normativa laboral de registro diario de jornada.

## Descripcion

Tracker Treball es una aplicacion web full-stack que permite a empleados y responsables registrar y supervisar la actividad laboral. La aplicacion implementa control de acceso basado en roles (RBAC) con tres niveles de permisos: Empleado, Manager y Administrador.

## Modulos Principales

1. Control de Jornada: Inicio, pausa y fin de jornada laboral con computo de horas efectivas.
2. Control de Pausas: Monitorizacion de tiempos de descanso (cafe, almuerzo, consulta medica) con computo de minutos adicionales y agrupacion semanal.
3. Directorio de Empleados: Ficha laboral, centro de trabajo asignado, departamento y estado de actividad.
4. Vacaciones y Ausencias: Solicitud, aprobacion o denegacion de periodos vacacionales.
5. Bajas Medicas: Registro de incapacidad temporal y tramitacion de altas.
6. Administracion de Base de Datos: Consulta y mantenimiento de registros directos para roles con permiso.

## Estructura del Repositorio

- frontend/: Interfaz de usuario construida con HTML5, CSS y JavaScript nativo.
- backend/: Microservicio API REST desarrollado con Spring Boot y Java 17.
- database/: Scripts SQL de definicion de tablas, migraciones y datos de prueba en MySQL.

## Requisitos de Ejecucion

- Java 17 o superior.
- Maven 3.8 o superior.
- MySQL 8.0 o conexion a base de datos remota.
- Navegador web moderno.

## Puesta en Marcha en Local

### 1. Base de Datos
Ejecutar los scripts de la carpeta database en MySQL en orden numerico:
1. 01_schema_tracker_treball.sql
2. 02_data_seed_tracker_treball.sql

### 2. Backend (Spring Boot)
Situarse en la carpeta backend y ejecutar:
```bash
mvn spring-boot:run
```
El servicio estara disponible en http://localhost:8080.

### 3. Frontend
Abrir el archivo frontend/index.html en el navegador o iniciar un servidor web local:
```bash
npx serve frontend
```
La aplicacion estara disponible en http://localhost:3000 o http://localhost:5500.

## Credenciales de Acceso de Prueba

- Administrador (Director General):
  - Usuario: hassan.test@trackertreball.com
  - Contrasena: Tracker2026!
- Manager (Sede Barcelona):
  - Usuario: albert.guiteras.test@trackertreball.com
  - Contrasena: Tracker2026!
- Empleado:
  - Usuario: elena.test@trackertreball.com
  - Contrasena: Tracker2026!

## Entornos Desplegados

- Frontend: Vercel (https://tracker-treball-frontend.vercel.app)
- Backend: Railway Cloud (https://tracker-treball-backend-production-e9cd.up.railway.app)
- Base de Datos: MySQL en Railway Cloud
