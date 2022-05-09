const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const authRouter = require("./routers/auth.router");
const fileRouter = require("./routers/file.router");
const cors = require("./middleware/cors.middleware");

const app = express();
const PORT = config.get("serverPort");

app.use(cors);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

const start = async () => {
  try {
    await mongoose.connect(config.get("dbUrl"));

    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
