require("dotenv").config();
const http = require("http");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets/planets.model");
const { loadLaunchesData } = require("./models/launches/launches.model");
const { mongoConnection } = require("./services/mongo");
const PORT = 5000;
const server = http.createServer(app);
const startServer = async () => {
  await mongoConnection();
  await loadPlanetsData();
  await loadLaunchesData();
  server.listen(PORT, () => {
    console.log(`Server flying at port ${PORT} 🚀`);
  });
};
startServer();
