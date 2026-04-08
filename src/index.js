import app from "./app.js";
import connectDatabase from "./db/index.js";

connectDatabase()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`SERVER IS RUNNING ON PORT:  ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log("ERROR CONNECTING TO DATABASE: ", err);
  });
