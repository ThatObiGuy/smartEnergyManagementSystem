import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// import indexRouter from "./routes/indexRoutes.js";
import finReportRouter from "./routes/finReportRoutes.js";
// import modelCompRouter from "./routes/modelCompRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(cors()); // for development TODO: Not forget

// app.use("/", indexRouter);
app.use("/api/finReport", finReportRouter);
// app.use("/modelComp", modelCompRouter);
app.use('/api/weather', weatherRoutes);

app.listen(PORT, () => {
  console.log('Server is up and running on port: ', PORT, '');
});