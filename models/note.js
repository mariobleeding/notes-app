const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("error", err.message);
  });

const noteSchema = new mongoose.Schema({
  _id: String,
  title: String,
  content: String,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
