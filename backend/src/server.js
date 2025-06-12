import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

// import indexRouter from "./routes/indexRoutes.js";
// import finReportRouter from "./routes/finReportRoutes.js";
// import modelCompRouter from "./routes/modelCompRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )`
        console.log('Database initialized');

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


app.get('/', (req, res) => {
  res.send('Hello World!');
});

// app.use("/", indexRouter);
// app.use("/finReport", finReportRouter);
// app.use("/modelComp", modelCompRouter);

app.listen(PORT, () => {
  console.log('Server is up and running on port: ', PORT, '');
});