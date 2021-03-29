import dotenv from "dotenv";
dotenv.config();

import App from "./config/app";
const app = new App().express;
const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`App is listening on port ${port}!`);
});
