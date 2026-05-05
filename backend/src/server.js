const app = require("./app");
const connectDatabase = require("./config/db");
const { serverPort } = require("./secret");

const startServer = async () => {
  await connectDatabase();

  app.listen(serverPort, () => {
    console.log(`Server is running at http://localhost:${serverPort}`);
  });
};

startServer(); 