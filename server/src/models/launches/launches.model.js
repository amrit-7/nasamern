const axios = require("axios");
const LaunchesModel = require("./launches.mongo");
const planetsModal = require("../planets/planets.mongo");
const launchesMongo = require("./launches.mongo");
let latestFlightNumber = 100;
const SPACEX_URL = "https://api.spacexdata.com/v5/launches/query";
async function populateLaunches() {
  const response = await axios.post(SPACEX_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: "1",
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  if (response.status !== 200) {
    console.log("Error while downloading data");
    throw new Error("Launch data download failed");
  }
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    await saveLaunch(launch);
  }
}
async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    misson: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded");
  } else {
    await populateLaunches();
  }
}
async function getLatestFlightNumber() {
  const latestLaunch = await LaunchesModel.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return latestFlightNumber;
  }
  return latestLaunch.flightNumber;
}
async function saveLaunch(launch) {
  await LaunchesModel.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}
async function findLaunch(filter) {
  return await launchesMongo.findOne(filter);
}
async function existsLaunch(id) {
  const checkId = parseInt(id);
  return await LaunchesModel.findLaunch({ flightNumber: checkId });
}
async function getAllLaunches(skip, limit) {
  console.log(`skip ${skip} || limit ${limit}`);
  return await LaunchesModel.find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}
async function scheduleNewLaunch(launch) {
  const planet = await planetsModal.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet found");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ISRO", "NASA"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}
async function deleteLaunch(id) {
  const aborted = await LaunchesModel.updateOne(
    {
      flightNumber: id,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
}
module.exports = {
  loadLaunchesData,
  getAllLaunches,
  scheduleNewLaunch,
  deleteLaunch,
  existsLaunch,
};
