const MENSAJES = {
  AUTH: {
    CREDENCIALES_INVALIDAS: "Correo o contraseña inválidos",
    TOKEN_REQUERIDO: "Token de autenticación requerido",
    TOKEN_INVALIDO: "Token inválido o expirado",
    EMAIL_DUPLICADO: "El correo ya está registrado",
    CEDULA_DUPLICADA: "La cédula ya está registrada",
    REGISTRO_EXITOSO: "Usuario registrado exitosamente",
    LOGIN_EXITOSO: "Inicio de sesión exitoso",
  },
  USUARIO: {
    NO_ENCONTRADO: "Usuario no encontrado",
    LISTA_OBTENIDA: "Usuarios obtenidos exitosamente",
    ACTUALIZADO: "Usuario actualizado exitosamente",
    ELIMINADO: "Usuario eliminado exitosamente",
  },
  CLIENTE: {
    NO_ENCONTRADO: "Cliente no encontrado",
    SALDO_INSUFICIENTE: "Saldo insuficiente para realizar el traslado",
    SALDO_CONSULTADO: "Saldo consultado exitosamente",
    LISTA_OBTENIDA: "Clientes obtenidos exitosamente",
    ACTUALIZADO: "Cliente actualizado exitosamente",
    ELIMINADO: "Cliente eliminado exitosamente",
  },
  CHOFER: {
    NO_ENCONTRADO: "Chofer no encontrado",
    NO_DISPONIBLE: "No hay choferes disponibles en este momento",
    LISTA_OBTENIDA: "Choferes obtenidos exitosamente",
    CREADO: "Chofer registrado exitosamente",
    ACTUALIZADO: "Chofer actualizado exitosamente",
    ELIMINADO: "Chofer eliminado exitosamente",
    CONTACTO_AGREGADO: "Contacto de emergencia agregado",
    CONTACTO_ELIMINADO: "Contacto de emergencia eliminado",
  },
  TRASLADO: {
    NO_ENCONTRADO: "Traslado no encontrado",
    CREADO: "Traslado creado exitosamente",
    LISTA_OBTENIDA: "Traslados obtenidos exitosamente",
    ESTADO_ACTUALIZADO: "Estado del traslado actualizado",
  },
  RECARGA: {
    MONTO_INVALIDO: "El monto debe ser mayor a cero",
    CREADA: "Recarga registrada exitosamente",
    LISTA_OBTENIDA: "Recargas obtenidas exitosamente",
  },
  PAGO: {
    MONTO_EXCEDE: "El monto del pago excede el saldo disponible del chofer",
    CREADO: "Pago registrado exitosamente",
    LISTA_OBTENIDA: "Pagos obtenidos exitosamente",
  },
  PRUEBA: {
    PSICOLOGICA_NO_APROBADA: "La calificación mínima para aprobar la prueba psicológica es 73",
    REVISION_NO_APROBADA: "La calificación mínima para aprobar la revisión del vehículo es 65",
    CREADA: "Prueba registrada exitosamente",
    LISTA_OBTENIDA: "Pruebas obtenidas exitosamente",
    ACTUALIZADA: "Prueba actualizada exitosamente",
  },
  BANCO: {
    NO_ENCONTRADO: "Banco no encontrado",
    CREADO: "Banco registrado exitosamente",
    LISTA_OBTENIDA: "Bancos obtenidos exitosamente",
    ACTUALIZADO: "Banco actualizado exitosamente",
    ELIMINADO: "Banco eliminado exitosamente",
  },
  VEHICULO: {
    NO_ENCONTRADO: "Vehículo no encontrado",
    CREADO: "Vehículo registrado exitosamente",
    LISTA_OBTENIDA: "Vehículos obtenidos exitosamente",
    ACTUALIZADO: "Vehículo actualizado exitosamente",
    ELIMINADO: "Vehículo eliminado exitosamente",
  },
  GENERAL: {
    ERROR_INTERNO: "Error interno del servidor",
    NO_AUTORIZADO: "No autorizado para realizar esta acción",
    RUTA_NO_ENCONTRADA: "Ruta no encontrada",
  },
};

module.exports = MENSAJES;
