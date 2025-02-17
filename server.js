import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const { PORT } = process.env ?? 3000;

const server = app.listen(PORT, () => {
  console.log(`WSV start with port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log(`exits server express`));
});
