const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :body"
  )
);

const currentDateandTime = new Date();

app.get("/", (req, res) => {
  res.send(
    '<h1>Welcome to Phonebook 9000, please navigate to <a href="http://localhost:3001/api/persons">http://localhost:3001/api/persons</a> to start'
  );
});

app.get("/info", (req, res) => {
  res.send(`<p>The phonebook has <b>${persons.length}</b> entries</p>
    <p>${currentDateandTime}</p>`);
});

// All data
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// Single entry
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// Deleting resource
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

// New entry
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

// middleware

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  const name = String(person.name);
  if (persons.find((person) => person.name === name)) {
    return res.status(400).json({
      error: "content already exists",
    });
  }

  persons = persons.concat(person);

  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
