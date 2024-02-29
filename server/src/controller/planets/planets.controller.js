const { getAllPlanet } = require("../../models/planets/planets.model");
async function getAllPlanets(req, res) {
  res.status(200).json(await getAllPlanet());
}

module.exports = { getAllPlanets };
