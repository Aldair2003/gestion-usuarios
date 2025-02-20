-- Crear la base de datos si no existe
CREATE DATABASE gestion_usuarios;

-- Conectar a la base de datos
\c gestion_usuarios;

-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS "Roles" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    "roleId" INTEGER REFERENCES "Roles"(id),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles por defecto
INSERT INTO "Roles" (name) 
VALUES ('admin'), ('user')
ON CONFLICT (name) DO NOTHING;

-- Insertar usuario admin por defecto
INSERT INTO "Users" (username, email, password, "roleId")
VALUES (
    'admin',
    'admin@example.com',
    '$2a$10$XZJ1XxNZWxEr1z.yY14.8OdCtUYhHh5OmNqH9zKj0RF3d5ZT6TGX.',  -- password: 123456
    1
) ON CONFLICT (email) DO NOTHING; 