// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality

const express = require("express");
const fs = require("fs");
const path = require("path");

// EXPRESS CONFIGURATION

var app = express();

// Sets an initial port.
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// ROUTER
// The below points our server to a series of "route" files.
app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

// Post Route
app.post("/api/notes", function (req, res) {
  let savedNotes = [];

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    const noteData = JSON.parse(data);

    for (let i = 0; i < noteData.length; i++) {
      const note = {
        title: noteData[i].title,
        text: noteData[i].text,
        id: i,
      };

      savedNotes.push(note);
    }

    const newNote = {
      title: req.body.title,
      text: req.body.text,
      id: savedNotes.length,
    };

    savedNotes.push(newNote);

    savedNotes = JSON.stringify(savedNotes);

    fs.writeFile("./db/db.json", savedNotes, (err) => {
      if (err) throw err;
      console.log("File saved successfully.");
    });

    res.send("Note added successfully.");
  });
});

// Delete Route
app.delete("/api/notes/:id", function (req, res) {
  const noteID = req.params.id;

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    const noteData = JSON.parse(data);
    for (let i = 0; i < noteData.length; i++) {
      if (noteData[i].id === parseInt(noteID)) {
        noteData.splice(i, 1);
        break;
      }
    }

    updatedData = JSON.stringify(noteData);

    // Write data back to stored db.json
    fs.writeFile("./db/db.json", updatedData, (err) => {
      if (err) throw err;
    });

    res.send("Note deleted successfully.");
  });
});

// Routes for HTML

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});