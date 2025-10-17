const express = require("express");
const corsMiddleware = require("./middlewares/cors.middleware");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware)
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Api is running",
    succuss: true,
    timestamp: new Date().toISOString(),
  });
});

module.exports=app
