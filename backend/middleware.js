const { jwtUtils, checkRoutes } = require("./utils");

const middleware = {
  checkAuth: async (req, res, next) => {
    const now = new Date();
    console.log(
      `[${now.toLocaleString("es-CL")}]: Se ha consultado la ruta de ${
        req.path
      }`
    );
    const authRoutes = ["/usuarios+GET"];
    const auth = req.headers.authorization;

    if (auth && checkRoutes(`${req.path}+${req.method}`, authRoutes)) {
      const decoded = jwtUtils.decodeUser(auth?.replace("Bearer ", ""));
      if (decoded) {
        req.headers.email = decoded;
        next();
      } else return res.status(401).json({ message: "Debes iniciar sesión" });
    } else if (!auth && checkRoutes(`${req.path}+${req.method}`, authRoutes)) {
      return res.status(401).json({ message: "Debes iniciar sesión" });
    } else {
      next();
    }
  },
};

module.exports = middleware;
