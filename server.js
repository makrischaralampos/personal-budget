// Import the Express library
const express = require("express");

// Create an instance of an Express app
const app = express();

// Define the port number
const PORT = 3000;

// Create a simple GET endpoint at the root URL ('/')
app.get("/", (req, res) => {
  res.send("Hello, World");
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
