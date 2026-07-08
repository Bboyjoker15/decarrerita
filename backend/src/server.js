const app = require("./app");
const { PORT } = require("./config/environment");

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
