// src/controllers/clientesController.js
// Lógica de negocio para la entidad "cliente"
// Usa consultas parametrizadas para prevenir inyección SQL

const pool = require('../config/db');

// ─────────────────────────────────────────────
// GET /api/clientes  →  Listar todos los clientes
// ─────────────────────────────────────────────
const obtenerTodos = async (req, res) => {
  try {
    // Consulta parametrizada (sin entrada de usuario, pero buena práctica)
    const [filas] = await pool.query('SELECT * FROM cliente ORDER BY created_at DESC');

    return res.status(200).json({
      ok: true,
      total: filas.length,
      datos: filas,
    });
  } catch (error) {
    console.error('Error en obtenerTodos:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
};

// ─────────────────────────────────────────────
// GET /api/clientes/:id  →  Obtener un cliente
// ─────────────────────────────────────────────
const obtenerPorId = async (req, res) => {
  const { id } = req.params;

  // Validar que el ID sea numérico
  if (isNaN(id) || Number(id) <= 0) {
    return res.status(400).json({ ok: false, mensaje: 'El ID debe ser un número positivo' });
  }

  try {
    // Consulta parametrizada → previene inyección SQL
    const [filas] = await pool.query(
      'SELECT * FROM cliente WHERE id_cliente = ?',
      [id]
    );

    if (filas.length === 0) {
      return res.status(404).json({ ok: false, mensaje: `Cliente con ID ${id} no encontrado` });
    }

    return res.status(200).json({ ok: true, datos: filas[0] });
  } catch (error) {
    console.error('Error en obtenerPorId:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
};

// ─────────────────────────────────────────────
// POST /api/clientes  →  Crear un cliente
// ─────────────────────────────────────────────
const crear = async (req, res) => {
  const { nombre, email, telefono } = req.body;

  try {
    // Consulta parametrizada con valores escapados automáticamente
    const [resultado] = await pool.query(
      'INSERT INTO cliente (nombre, email, telefono) VALUES (?, ?, ?)',
      [nombre.trim(), email.trim().toLowerCase(), telefono.trim()]
    );

    return res.status(201).json({
      ok: true,
      mensaje: 'Cliente creado exitosamente',
      datos: {
        id_cliente: resultado.insertId,
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono.trim(),
      },
    });
  } catch (error) {
    // Error 1062 = Duplicate entry (email duplicado)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        ok: false,
        mensaje: `El email '${email}' ya está registrado en el sistema`,
      });
    }
    console.error('Error en crear:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
};

// ─────────────────────────────────────────────
// PUT /api/clientes/:id  →  Actualizar un cliente
// ─────────────────────────────────────────────
const actualizar = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id) || Number(id) <= 0) {
    return res.status(400).json({ ok: false, mensaje: 'El ID debe ser un número positivo' });
  }

  const { nombre, email, telefono } = req.body;

  // Construir sólo los campos que se enviaron (actualización parcial)
  const campos = [];
  const valores = [];

  if (nombre !== undefined)   { campos.push('nombre = ?');   valores.push(nombre.trim()); }
  if (email !== undefined)    { campos.push('email = ?');    valores.push(email.trim().toLowerCase()); }
  if (telefono !== undefined) { campos.push('telefono = ?'); valores.push(telefono.trim()); }

  if (campos.length === 0) {
    return res.status(400).json({ ok: false, mensaje: 'Debe enviar al menos un campo para actualizar' });
  }

  valores.push(id); // Para el WHERE

  try {
    const [resultado] = await pool.query(
      `UPDATE cliente SET ${campos.join(', ')} WHERE id_cliente = ?`,
      valores
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: `Cliente con ID ${id} no encontrado` });
    }

    // Retornar el cliente actualizado
    const [actualizado] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [id]);

    return res.status(200).json({
      ok: true,
      mensaje: 'Cliente actualizado exitosamente',
      datos: actualizado[0],
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        ok: false,
        mensaje: `El email '${email}' ya está registrado por otro cliente`,
      });
    }
    console.error('Error en actualizar:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/clientes/:id  →  Eliminar un cliente
// ─────────────────────────────────────────────
const eliminar = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id) || Number(id) <= 0) {
    return res.status(400).json({ ok: false, mensaje: 'El ID debe ser un número positivo' });
  }

  try {
    const [resultado] = await pool.query(
      'DELETE FROM cliente WHERE id_cliente = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: `Cliente con ID ${id} no encontrado` });
    }

    return res.status(200).json({
      ok: true,
      mensaje: `Cliente con ID ${id} eliminado exitosamente`,
    });
  } catch (error) {
    console.error('Error en eliminar:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
