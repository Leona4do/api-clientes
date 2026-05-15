# API REST de Clientes 🚀

> **Taller de Plataformas Web – Semana 9**  
> Implementación de una API REST segura con Node.js, Express y MySQL.

---

## 📋 Descripción

API RESTful para la gestión de clientes con operaciones CRUD completas, validación de datos, manejo de errores HTTP y consultas parametrizadas para prevenir inyección SQL.

---

## 🗂 Estructura del proyecto

```
api-clientes/
├── src/
│   ├── config/
│   │   └── db.js                  # Configuración del pool de conexiones MySQL
│   ├── controllers/
│   │   └── clientesController.js  # Lógica CRUD de clientes
│   ├── middleware/
│   │   └── validaciones.js        # Validación de entradas con express-validator
│   ├── routes/
│   │   └── clientes.js            # Definición de rutas
│   └── index.js                   # Punto de entrada del servidor
├── postman/
│   └── api-clientes.postman_collection.json  # Colección Postman
├── database.sql                   # Script de creación de base de datos
├── .env.example                   # Variables de entorno de ejemplo
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Requisitos previos

- Node.js v18 o superior
- MySQL 8.x o superior
- Postman (para pruebas)

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/api-clientes.git
cd api-clientes
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de MySQL:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=taller_web
```

### 4. Crear la base de datos

Ejecuta el script SQL en tu cliente MySQL (Workbench, DBeaver, terminal):

```bash
mysql -u root -p < database.sql
```

### 5. Iniciar el servidor

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

---

## 📡 Endpoints disponibles

| Método | Ruta                    | Descripción                    |
|--------|-------------------------|--------------------------------|
| GET    | `/api/clientes`         | Listar todos los clientes      |
| GET    | `/api/clientes/:id`     | Obtener un cliente por ID      |
| POST   | `/api/clientes`         | Crear un nuevo cliente         |
| PUT    | `/api/clientes/:id`     | Actualizar un cliente          |
| DELETE | `/api/clientes/:id`     | Eliminar un cliente            |

---

## 📝 Ejemplos de uso

### Crear cliente

```http
POST /api/clientes
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan.perez@email.com",
  "telefono": "+56912345678"
}
```

**Respuesta exitosa (201):**
```json
{
  "ok": true,
  "mensaje": "Cliente creado exitosamente",
  "datos": {
    "id_cliente": 1,
    "nombre": "Juan Pérez",
    "email": "juan.perez@email.com",
    "telefono": "+56912345678"
  }
}
```

**Email duplicado (409):**
```json
{
  "ok": false,
  "mensaje": "El email 'juan.perez@email.com' ya está registrado en el sistema"
}
```

---

## 🔒 Seguridad implementada

- **Consultas parametrizadas** (`?`) en todas las queries → previene inyección SQL
- **Helmet.js** → cabeceras HTTP seguras
- **express-validator** → validación y sanitización de entradas
- **CORS** configurado
- **Manejo de errores** con códigos HTTP correctos (400, 404, 409, 500)

---

## 🧪 Pruebas con Postman

Importa la colección desde `postman/api-clientes.postman_collection.json`:

1. Abre Postman → **Import**
2. Selecciona el archivo JSON
3. Ejecuta cada request en orden

---

## 🛠 Problema técnico detectado y solución

**Problema:** Al intentar crear un cliente con un email ya existente, MySQL lanzaba un error genérico (`ER_DUP_ENTRY`) sin respuesta HTTP adecuada.

**Solución:** Se captura el código de error de MySQL en el controlador y se responde con `409 Conflict` y un mensaje descriptivo al usuario.

```js
if (error.code === 'ER_DUP_ENTRY') {
  return res.status(409).json({
    ok: false,
    mensaje: `El email '${email}' ya está registrado en el sistema`,
  });
}
```
