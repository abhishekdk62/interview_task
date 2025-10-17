const dotenv = require("dotenv");
const connectDB = require("./src/config/database");
const app = require("./src/app");
const { config } = require("./src/config/config");
dotenv.config();
connectDB();
const server = app.listen(config.port, () => {
  console.log("Server is running on port", config.port);
});

//for developement level gracefull closing
process.on("SIGTERM", () => {
  console.log("closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

//for production level gracefull closing
process.on("SIGINT", () => {
  console.log("closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});
