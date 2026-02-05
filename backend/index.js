const dotenv = require("dotenv");
dotenv.config();
const connectToMongoDB = require("./src/config/db");
const app = require("./src/app");
app.get("/", (req, res) => {
  res.send("nexus");
});
connectToMongoDB();
app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server Started at the Port http://localhost:${process.env.PORT}`,
  );
});
