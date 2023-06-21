const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.aprr1fa.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const newNote = new Note({
  id: new Date().toString(),
  title: "Programming",
  content: "Learn React",
  important: false,
});

function saveNote(note) {
  note.save().then((result) => {
    console.log("note saved!");
    mongoose.connection.close();
  });
}

function fetchNotes(Model) {
  Model.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note);
    });
    mongoose.connection.close();
  });
}

// saveNote(newNote)
fetchNotes(Note);
