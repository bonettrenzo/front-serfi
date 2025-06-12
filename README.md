# Prueba Técnica - Serfinanza

Este proyecto es una prueba técnica desarrollada para **Serfinanza**, que consiste en una aplicación web full stack. El backend está desarrollado en **ASP.NET Core API**, el frontend en **React + Vite**, y la base de datos en **PostgreSQL**. El despliegue se realizó utilizando **Docker** y **Render**.

---

## 🧩 Tecnologías utilizadas

- **Frontend:** React + Vite
- **Backend:** ASP.NET Core Web API
- **Base de datos:** PostgreSQL
- **Contenedores:** Docker
- **Despliegue:** Render

---

## 🚀 URLs de Despliegue

- 🔗 **Frontend:** [https://front-serfi.onrender.com](https://front-serfi.onrender.com)
- 🔗 **Backend:** [https://back-serfi.onrender.com](https://back-serfi.onrender.com)

---

## 🛠️ Cómo levantar el proyecto localmente

### Prerrequisitos

- [.NET 7 SDK o superior](https://dotnet.microsoft.com/en-us/download)
- [Node.js 18+](https://nodejs.org/)
- [Docker y Docker Compose](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/) (si decides no usar Docker para la BD)

### Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/serfinanza-prueba.git
cd serfinanza-prueba
```

# ✅ Funcionalidades Implementadas

A continuación se describen las funcionalidades solicitadas en la prueba técnica de Serfinanza:

---

## 🔐 Autenticación y Autorización

- 🟢 Implementación de **login** para autenticar usuarios en la API.
- 🛡️ Validación de **permisos** para autorizar el acceso a endpoints según el tipo de usuario.

---

## ⚡ Manejo de Caché

- 📦 Aplicación de **caché en las respuestas del API**, especialmente en consultas externas como países.
- 🔄 Respuesta del API `https://restcountries.com/v3.1/all?fields=name` es **consumida desde el backend** y su resultado es cacheado y retornado al formulario de usuario en el frontend.

---

## 📝 Manejo de Logs

- 📋 Integración de **sistema de logging** para registrar eventos del backend, incluyendo autenticaciones, errores y operaciones CRUD.

---

## 🌍 Consumo de API externa

- 🌐 Consumo de la API pública de países `https://restcountries.com/v3.1/all?fields=name`.
- 🔁 Respuesta retornada al frontend a través del backend.
- 🧠 Se aplica **caché** para evitar múltiples peticiones innecesarias a la API externa.

---

## 🛡️ Manejo de Roles y Permisos

El sistema implementa un control de acceso basado en **roles y permisos**, utilizando relaciones entre las tablas `Users`, `Roles`, `Permiso` y `RolPermiso`. A continuación se explica cómo está estructurado y cómo funciona la lógica de autorización.

---

### 🧱 Esquema de Tablas Relacionadas

- **`Users`**: Contiene la información básica del usuario y una referencia al rol (`RolesId`).
- **`Roles`**: Define los distintos tipos de rol disponibles (por ejemplo: Administrador, Operador, Cliente).
- **`Permiso`**: Lista las acciones específicas que un sistema puede controlar (crear usuario, ver permisos, etc.).
- **`RolPermiso`**: Tabla puente que vincula roles con sus permisos, permitiendo que un rol tenga múltiples permisos y un permiso pueda ser compartido por varios roles.

---

### 🔄 Flujo de Autorización

1. **Un usuario se autentica** (por ejemplo, mediante su `Email` y `Password`).
2. Al autenticarse, el backend recupera el `RolesId` del usuario desde la tabla `Users`.
3. Se buscan los **permisos asignados al rol** a través de la tabla `RolPermiso`.
4. Cada endpoint en la API está protegido con un middleware o atributo que valida si el usuario **posee el permiso necesario** para acceder.
5. Si el permiso existe, se permite la acción; de lo contrario, se retorna una respuesta de "No autorizado" (`403 Forbidden`).

---

### 🔐 Ejemplo de uso práctico

Supongamos que tenemos los siguientes registros:

#### Roles
| Id | Nombre       |
|----|--------------|
| 1  | Administrador|
| 2  | Operador     |
| 3  | Cliente      |

#### Permisos
| Id | NombrePermiso        |
|----|----------------------|
| 1  | CrearUsuario         |
| 2  | EditarUsuario        |
| 3  | VerUsuarios          |
| 4  | EliminarUsuario      |
| 5  | VerPropiaInformacion |

#### Relación Rol-Permiso (`RolPermiso`)
| RolId | PermisoId |
|--------|-----------|
| 1      | 1         |
| 1      | 2         |
| 1      | 3         |
| 1      | 4         |
| 2      | 2         |
| 2      | 3         |
| 3      | 5         |

#### Usuario de ejemplo
| Id | Nombre          | Email              | RolesId |
|----|------------------|---------------------|---------|
| 1  | Admin Default    | admin@serfi.com     | 1       |
| 2  | Operador Juan    | operador@serfi.com  | 2       |
| 3  | Cliente Pedro    | cliente@serfi.com   | 3       |

---

### 📌 Comportamiento esperado por rol

| Rol         | Acciones permitidas                            |
|-------------|------------------------------------------------|
| Administrador | Crear, editar, ver, y eliminar usuarios y permisos |
| Operador      | Editar y ver usuarios tipo Cliente                |
| Cliente       | Ver solamente su propia información              |

---

### 🧩 Beneficios del diseño

- 🔄 **Escalable**: Puedes agregar nuevos permisos sin tener que tocar código, solo modificando las tablas.
- 🔐 **Seguro**: El acceso está completamente controlado desde el backend.
- ⚙️ **Flexible**: Puedes asignar múltiples permisos a cualquier rol según las necesidades del negocio.

---
