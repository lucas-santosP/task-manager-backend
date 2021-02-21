import App from "./config/app";
import dotenv from "dotenv";
dotenv.config();

const app = new App().express;
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}!`);
});
