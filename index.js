require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Note = require("./models/note");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.send("Hello World from Heroku");
});

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (body.content == undefined || body.title == undefined) {
    return res.status(400).json({ error: "Title or content are required" });
  }

  const newNote = new Note({
    _id: Date.now().toString(),
    title: body.title,
    content: body.content,
    important: body.important || false,
  });

  newNote.save(newNote).then((result) => {
    res.json(result);
  });
});

app.patch("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  const importantValue = req.body.important;

  Note.findByIdAndUpdate(noteId, { important: !importantValue }, { new: true })
    .then((updatedNote) => {
      if (!updatedNote) {
        return res.status(404).json({ error: "Note not found" });
      }

      res.json(updatedNote);
    })
    .catch((error) => {
      res.status(500).json({
        error: `An error occurred while updating the note, error: ${error.message}`,
      });
    });
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  Note.findByIdAndDelete(noteId)
    .then((deletedNote) => {
      if (!deletedNote) {
        return res.status(404).json({ error: "Note not found" });
      }

      res.sendStatus(204);
    })
    .catch((error) => {
      res.status(500).json({
        error: `An error occurred while deleting the note, error: ${error.message}`,
      });
    });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
