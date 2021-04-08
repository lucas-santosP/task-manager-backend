import mongoose from "mongoose";

function connectDB() {
  const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

  mongoose.connect(
    `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  );

  mongoose.connection.on("error", (error) => console.error("DB connection error", error));
  mongoose.connection.once("open", () => console.log(`DB ${DB_NAME} connected`));
  mongoose.connection.on("disconnected", () => console.error("DB disconnected"));
}

export default connectDB;
