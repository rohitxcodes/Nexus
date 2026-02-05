const mongoose = require("mongoose");
async function connectToMongoDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(console.log("MongoDB connected seccusfully"));
}
module.exports = connectToMongoDB;
