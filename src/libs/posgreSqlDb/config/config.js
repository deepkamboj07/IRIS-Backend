require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "your_pg_username",
    password: process.env.DB_PASSWORD || "your_pg_password",
    database: process.env.DB_NAME || "your_pg_database",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: parseInt(process.env.DB_PORT) || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // for self-signed certificates
      },
    },
  },
  production: {
    username: process.env.DB_USERNAME || "your_pg_username",
    password: process.env.DB_PASSWORD || "your_pg_password",
    database: process.env.DB_NAME || "your_pg_database",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: parseInt(process.env.DB_PORT) || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
