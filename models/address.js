const mongoose = require("mongoose");

const addrSchema = new mongoose.Schema({
  _id: String,
  date: String,
  address: String,
});

addrSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Address", addrSchema);
