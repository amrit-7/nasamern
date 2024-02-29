const express = require("express");
const launchesController = require("../../controller/launches/launches.controller");
const launchesRouter = express.Router();

launchesRouter.get("/", launchesController.httpGetAllLaunches);
launchesRouter.post("/", launchesController.httpPostLaunches);
launchesRouter.delete("/:id", launchesController.httpDeleteLaunch);

module.exports = launchesRouter;
