const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { getUserInfo, createNewUser } = require("./consultas");
const { jwtUtils, cryptUtils } = require("./utils");
const { checkAuth } = require("./middleware");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`¡Servidor encendido en puerto ${PORT}!`);
});

app.use(checkAuth);

//Info de un usuario.
app.get("/usuarios", async (req, res) => {
  try {
    const { email } = req.headers;
    const data = await getUserInfo(email);
    if (data.length === 0)
      return res
        .status(404)
        .json({ error: `No se encontró el usuario con email: ${email}` });
    delete data[0].password;
    delete data[0].id;
    return res.status(200).json({ ...data[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const { email, lenguage, password, rol } = req.body;
    const encryptedPassword = await cryptUtils.encryptPassword(password);
    const checkUserEmail = await getUserInfo(email);
    if (checkUserEmail.length > 0)
      return res
        .status(400)
        .json({ message: "El usuario ya está registrado." });
    const result = await createNewUser({
      email,
      lenguage,
      password: encryptedPassword,
      rol,
    });
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await getUserInfo(email);
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Debes ingresar correo y contraseña" });
    if (result.length > 0) {
      if (await cryptUtils.checkPassword(result[0].password, password)) {
        const token = jwtUtils.signUser(email);
        return res.status(200).json({ token });
      } else
        return res
          .status(401)
          .json({ message: "Correo o contraseña incorrectos" });
    } else return res.status(404).json({ message: "Usuario no encontrado" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});
