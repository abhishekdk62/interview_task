const cors = require("cors");
const { config } = require("../config/config");
const corsOptions = {
  origin: config.clientURL,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports=cors(corsOptions)