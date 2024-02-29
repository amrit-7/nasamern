const mongoose = require("mongoose");

const PlanetsSchema = new mongoose.Schema({
  keplerName: String,
});

module.exports = mongoose.model("Planet", PlanetsSchema);
