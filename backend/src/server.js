import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import indexRouter from "./routes/indexRoutes.js";
import finReportRouter from "./routes/finReportRoutes.js";
// import modelCompRouter from "./routes/modelCompRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start();

const PORT = process.env.PORT;

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok'})
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(cors()); // for development TODO: Not forget

app.use("/api/", indexRouter);
app.use("/api/finReport", finReportRouter);
// app.use("/modelComp", modelCompRouter);
app.use('/api/weather', weatherRoutes);

app.listen(PORT, () => {
  console.log('Server is up and running on port: ', PORT, '');
});