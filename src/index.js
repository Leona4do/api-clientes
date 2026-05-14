// src/index.js
// Punto de entrada de la API REST - Taller de Plataformas Web

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
require('dotenv').config();

const clientesRouter = require('./routes/clientes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares de seguridad ───────────────────────────────────────────────
app.use(helmet());          // Cabeceras HTTP seguras
app.use(cors());            // Permitir peticiones cross-origin
app.use(express.json());    // Parsear body JSON

// ─── Ruta de salud (health check) ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'API REST de Clientes - Taller de Plataformas Web',
    version: '1.0.0',
    endpoints: {
      clientes: '/api/clientes',
    },
  });
});

// ─── Rutas de la API ────────────────────────────────────────────────────────
app.use('/api/clientes', clientesRouter);

// ─── Ruta no encontrada (404) ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: `Ruta '${req.originalUrl}' no encontrada` });
});

// ─── Manejador global de errores ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
});

// ─── Iniciar servidor ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET    http://localhost:${PORT}/api/clientes`);
  console.log(`   GET    http://localhost:${PORT}/api/clientes/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/clientes`);
  console.log(`   PUT    http://localhost:${PORT}/api/clientes/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/clientes/:id`);
});

module.exports = app;
