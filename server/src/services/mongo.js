require("dotenv").config();
const mongoose = require("mongoose");
const MONGOURL = process.env.MONGODB_KEY;
mongoose.connection.once("open", () => {
  console.log("Database Connected");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnection() {
  await mongoose.connect(
    "mongodb+srv://gillamrit29:Palamr07@amrit07.bpbhucj.mongodb.net/nasaproject"
  );
}
async function mongoDisconnect() {
  await mongoose.disconnect();
}
module.exports = { mongoConnection, mongoDisconnect };
