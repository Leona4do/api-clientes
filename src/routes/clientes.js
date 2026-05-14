// src/routes/clientes.js
// Definición de rutas para la entidad "cliente"

const express = require('express');
const router  = express.Router();

const {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
} = require('../controllers/clientesController');

const {
  reglasCrear,
  reglasActualizar,
  verificarErrores,
} = require('../middleware/validaciones');

// GET    /api/clientes          → listar todos
router.get('/', obtenerTodos);

// GET    /api/clientes/:id      → obtener uno por ID
router.get('/:id', obtenerPorId);

// POST   /api/clientes          → crear nuevo cliente
router.post('/', reglasCrear, verificarErrores, crear);

// PUT    /api/clientes/:id      → actualizar cliente existente
router.put('/:id', reglasActualizar, verificarErrores, actualizar);

// DELETE /api/clientes/:id      → eliminar cliente
router.delete('/:id', eliminar);

module.exports = router;
