const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const router = require("./routers/auth.router");

const app = express();
const PORT = config.get("serverPort");

app.use(express.json())
app.use("/api/auth", router);

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
