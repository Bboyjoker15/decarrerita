const { validationResult } = require("express-validator");

function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const mensajes = errors.array().map((err) => err.msg);
    return res.status(400).json({
      ok: false,
      error: mensajes,
    });
  }

  next();
}

module.exports = validate;
