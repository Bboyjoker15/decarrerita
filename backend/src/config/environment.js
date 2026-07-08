const dotenv = require("dotenv");

dotenv.config();

const requiredVars = ["DATABASE_URL", "JWT_SECRET"];

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Error: Variable de entorno ${varName} no definida`);
    process.exit(1);
  }
});

const ENV = {
  PORT: process.env.PORT || 4000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  NODE_ENV: process.env.NODE_ENV || "development",
};

module.exports = ENV;
