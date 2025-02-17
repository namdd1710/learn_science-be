import mongoose, { connect, set } from "mongoose";

//connect mongoose
connect(process.env.MONGO_URI)
  .then((_) => console.log("Connected mongoose success!..."))
  .catch((err) => console.error(`Error: connect:::`, err));

// all executed methods log output to console
set("debug", true);

// disable colors in debug mode
set("debug", { color: false });

// get mongodb-shell friendly output (ISODate)
set("debug", { shell: true });

export default mongoose;
