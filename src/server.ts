import app from "./config/app";

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is listening on port ${process.env.PORT || 3000}!`);
});
