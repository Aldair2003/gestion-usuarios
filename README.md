# Sistema de Gestión de Usuarios 🚀

Sistema web completo de gestión de usuarios con autenticación, roles y despliegue en Kubernetes.

## 📋 Características

- ✅ Autenticación de usuarios (Login/Registro)
- 👥 Gestión completa de usuarios (CRUD)
- 🎯 Dashboard administrativo
- 🔐 Sistema de roles (Admin/Usuario)
- 🐳 Contenedores Docker
- ⚙️ Despliegue en Kubernetes
- 🎨 Interfaz moderna y responsive

## 🛠️ Tecnologías

- **Frontend**: 
  - React.js
  - React Router
  - Axios
  - CSS Modules

- **Backend**:
  - Node.js
  - Express
  - Sequelize ORM
  - JWT Authentication

- **Base de datos**:
  - MySQL

- **DevOps**:
  - Docker
  - Kubernetes
  - Docker Compose

## 🗂️ Estructura del Proyecto
gestion-usuarios/
├── frontend/ # Aplicación React
│ ├── src/
│ ├── Dockerfile
│ └── package.json
├── backend/ # API Node.js/Express
│ ├── src/
│ ├── Dockerfile
│ └── package.json
├── k8s/ # Configuraciones Kubernetes
│ ├── namespace.yaml
│ ├── secrets.yaml
│ ├── database-deployment.yaml
│ ├── backend-deployment.yaml
│ └── frontend-deployment.yaml
└── docker-compose.yml



## 🚀 Instalación y Despliegue

### Prerequisitos

- Docker y Docker Compose
- Kubernetes (minikube o cluster)
- Node.js y npm
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
bash
git clone https://github.com/Aldair2003/gestion-usuarios.git
cd gestion-usuarios


2. **Despliegue con Docker Compose (Desarrollo)**
bash
docker-compose up -d


3. **Despliegue en Kubernetes (Producción)**
bash
Crear namespace
kubectl apply -f k8s/namespace.yaml
Aplicar configuraciones
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/database-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

## 🔐 Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:
env
Backend
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=gestion_usuarios
JWT_SECRET=your_jwt_secret


Frontend
REACT_APP_API_URL=http://localhost:5000/api



## 🌟 Características Principales

### Gestión de Usuarios
- Crear nuevos usuarios
- Editar información de usuarios
- Eliminar usuarios
- Listar todos los usuarios
- Filtrar y buscar usuarios

### Sistema de Autenticación
- Login seguro
- Registro de usuarios
- Gestión de sesiones
- Protección de rutas

### Roles y Permisos
- Rol de Administrador
- Rol de Usuario
- Permisos específicos por rol

## 📱 Capturas de Pantalla

![image](https://github.com/user-attachments/assets/2365b28b-2574-4149-8d05-7994de8961b0)


![image](https://github.com/user-attachments/assets/428513ef-381e-4ed6-9b21-bb480a8a8922)


![image](https://github.com/user-attachments/assets/3f84c90c-7dd5-4690-8779-f10e4aac7d76)]


![image](https://github.com/user-attachments/assets/04b65a5f-fca3-498d-bad9-0a84a825eac3)


![image](https://github.com/user-attachments/assets/5eba55e9-403e-4783-aa68-df1066a8544a)



## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, lee el archivo CONTRIBUTING.md para más detalles.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✨ Autor

- **Aldair Toala** - [GitHub](https://github.com/Aldair2003)

## 🙏 Agradecimientos

- Agradecimientos especiales a todos los que contribuyeron al proyecto
- Inspirado en las mejores prácticas de desarrollo web moderno
