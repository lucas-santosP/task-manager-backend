import mongoose from "mongoose";

const DEFAULT_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

function connectDB() {
  const { DB_URL, DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;
  if (DB_URL) {
    mongoose.connect(DB_URL, DEFAULT_OPTIONS);
  } else if (DB_USER || DB_PASS || DB_HOST || DB_PORT || DB_NAME) {
    mongoose.connect(
      `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
      DEFAULT_OPTIONS,
    );
  } else {
    mongoose.connect("mongodb://localhost:27017/task-manager", DEFAULT_OPTIONS);
  }

  mongoose.connection.on("error", (error) => console.error("DB connection error", error));
  mongoose.connection.once("open", () => console.log("DB connected"));
  mongoose.connection.on("disconnected", () => console.error("DB disconnected"));
}

export default connectDB;
