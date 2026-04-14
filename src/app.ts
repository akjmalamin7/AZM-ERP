import express from "express";
import router from "./routers/api";
const app = new express();
app.use(express.json());
app.use("/api/v1", router);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome AZM ERP" });
});
export default app;
