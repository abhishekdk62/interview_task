const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Api is running",
    succuss: true,
    timestamp: new Date().toISOString(),
  });
});

module.exports=app
