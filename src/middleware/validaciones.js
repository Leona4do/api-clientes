// src/middleware/validaciones.js
// Validaciones de entrada para los endpoints de clientes

const { body, validationResult } = require('express-validator');

// Reglas para crear un cliente (todos los campos obligatorios)
const reglasCrear = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no puede superar 100 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .isLength({ max: 150 }).withMessage('El email no puede superar 150 caracteres'),

  body('telefono')
    .trim()
    .notEmpty().withMessage('El teléfono es obligatorio')
    .isLength({ max: 20 }).withMessage('El teléfono no puede superar 20 caracteres'),
];

// Reglas para actualizar (campos opcionales pero válidos si se envían)
const reglasActualizar = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 }).withMessage('El nombre no puede superar 100 caracteres'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Debe ser un email válido')
    .isLength({ max: 150 }).withMessage('El email no puede superar 150 caracteres'),

  body('telefono')
    .optional()
    .trim()
    .notEmpty().withMessage('El teléfono no puede estar vacío')
    .isLength({ max: 20 }).withMessage('El teléfono no puede superar 20 caracteres'),
];

// Middleware que verifica si hay errores de validación
const verificarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Datos inválidos',
      errores: errores.array().map(e => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
};

module.exports = { reglasCrear, reglasActualizar, verificarErrores };
