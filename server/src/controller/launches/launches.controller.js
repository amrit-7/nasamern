const {
  getAllLaunches,
  existsLaunch,
  deleteLaunch,
  scheduleNewLaunch,
} = require("../../models/launches/launches.model.js");
const { getPagination } = require("../../services/query.js");
async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  res.status(200).json(launches);
}
async function httpPostLaunches(req, res) {
  const launch = req.body;
  if (!launch.mission) {
    console.log("No misson name");
    return res.status(400).json({ error: "misson name empty" });
  } else if (!launch.launchDate) {
    console.log("No date entered");
    return res.status(400).json({ error: "misson date empty" });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "invalid date format" });
  }
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}
async function httpDeleteLaunch(req, res) {
  const launchId = req.params.id;
  const exist = await existsLaunch(launchId);
  if (!exist) {
    console.log("Not exists");
    return res.status(400).json({ message: "Misson not found" });
  } else {
    const aborted = await deleteLaunch(launchId);
    if (!aborted) {
      res.status(400).json({ error: "Launch not aborted" });
    } else {
      return res.status(200).json({
        ok: true,
      });
    }
  }
}
module.exports = { httpGetAllLaunches, httpPostLaunches, httpDeleteLaunch };
