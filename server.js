const app = require("./src/app");

const PORT = 3000;

const server = app.listen(PORT, () => {
  // clear terminal
  console.clear();
  console.log("Server is running on port 3000");
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
  });
});
