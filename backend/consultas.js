const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  allowExitOnIdle: true,
});

const getUserInfo = async (email) => {
  const consulta = "SELECT * FROM usuarios where email = $1";
  const result = await pool.query(consulta, [email]);
  return result.rows;
};

const createNewUser = async (user) => {
  const { email, password, rol, lenguage } = user;
  const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)";
  const values = [email, password, rol, lenguage];
  const result = await pool.query(consulta, values);
  return result;
};

module.exports = { getUserInfo, createNewUser };
