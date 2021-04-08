import dotenv from "dotenv";
dotenv.config();

import App from "./config/app";
const app = new App().express;
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}!`);
});
