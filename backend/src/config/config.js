const dotenv = require("dotenv");

dotenv.config();

const config = {
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,
  clientURL:
    process.env.NODE_ENV == "dev"
      ? process.env.CLIENT_URL_DEV
      : process.env.CLIENT_URL_PROD,
  nodeEnv: process.env.NODE_ENV || "dev",
};

module.exports={config}