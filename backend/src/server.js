const dotenv = require("dotenv");
const connectDB = require("./config/database");
const app = require("./app");
const { config } = require("./config/config");
dotenv.config();
const connectDB = connectDB;
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
