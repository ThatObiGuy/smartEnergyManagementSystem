import { sql } from "../config/db.js";

// Function to get gross savings by site ID - not currently confident in the maths but it's a start
export async function getGrossSavingsBySiteID(req, res) {
    try {
        const { siteId } = req.params;

        // SQL query to get hourly production data in KWH - trying to do most of the heavy lifting in SQL
        const hourlyData = await sql`
            SELECT 
                EXTRACT(HOUR FROM updated_time) as hour,
                SUM(production_power_w * (1.0/12)) / 1000 as total_kwh
            FROM solar_data
            WHERE site_id = ${siteId} AND production_power_w > 0
            GROUP BY EXTRACT(HOUR FROM updated_time)
            ORDER BY hour
        `; // We need to divide by 1000 to convert from Wh to kWh and multiply by 1/12 as we are getting 5 minute windows within the data

        // console.log(hourlyData); //Debugging
        let grossSavings = 0;

        // Not the most sophisticated way to do this - could be the source of my lack of confidence in the maths
        for (const entry of hourlyData) {
            if(17 >= entry.hour && entry.hour < 20) { // 17, 18, 19
                grossSavings += entry.total_kwh * 47.89;
            } else if(entry.hour >= 23 || entry.hour < 9) { // 11 to 8
                grossSavings += entry.total_kwh * 28.63;
            } else {
                grossSavings += entry.total_kwh * 39.77;
            }
        }

        res.status(200).send(Number(grossSavings.toFixed(2)));

    }
    catch (error) {
        console.log("Error getting the gross savings", error);
        res.status(500).json({ message: "Internal server error"});
    }
}