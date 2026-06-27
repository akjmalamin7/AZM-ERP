import express from "express";
import router from "./routers/api";
const app = express();
app.use(express.json());

app.get("/ping", (req, res) => {
  console.log("PING");
  res.send("OK");
});
app.use("/api/v1", router);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome AZM ERP" });
});
export default app;
