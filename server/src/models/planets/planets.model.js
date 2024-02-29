const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          savePlanets(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const planetsCount = (await getAllPlanet()).length;
        console.log(`${planetsCount} habitable planets found!`);
        resolve();
      });
  });
}
async function getAllPlanet() {
  return await planets.find({}, { _id: 0, __v: 0 });
}
async function savePlanets(planet) {
  return await planets.updateOne(
    {
      keplerName: planet.kepler_name,
    },
    {
      keplerName: planet.kepler_name,
    },
    { upsert: true }
  );
}
module.exports = {
  loadPlanetsData,
  getAllPlanet,
};