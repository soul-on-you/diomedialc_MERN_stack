const { Schema, model, ObjectId } = require("mongoose");

const File = new Schema({
  name: { type: String, required: true },
  size: { type: Number, default: 0 },
  type: { type: String, required: true },
  path: { type: String, default: "" },
  date:{type:Date, default: Date.now()},
  user: { type: ObjectId, required: true, ref: "User" },
  parent: { type: ObjectId, ref: "File" },
  childs:[{type: ObjectId, ref: "File"}],
  accessLink: { type: String },
});

module.exports = model("File", File);
