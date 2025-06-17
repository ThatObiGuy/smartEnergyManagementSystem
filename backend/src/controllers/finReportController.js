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

        res.status(200).json({grossSavings: Number(grossSavings.toFixed(2))});

    }
    catch (error) {
        console.log("Error getting the gross savings", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

// Function to get installation date by site ID
export async function getInstallDateBySiteID(req, res) {
    try {
        const {siteId} = req.params;

        const result = await sql`
            SELECT installation_date
            FROM sites
            WHERE site_id = ${siteId}
        `;

        // Check if site exists
        if (result.length === 0) {
            return res.status(404).json({ message: "Site not found" });
        }

        const installDate = result[0].installation_date;

        res.status(200).json({installDate: installDate});

    } catch (error) {
            console.log("Error getting the installation date ", error);
            res.status(500).json({ message: "Internal server error"});
    }
}

// Function to get installation cost by site ID
export async function getInstallCostBySiteID(req, res) {
    try {
        const {siteId} = req.params;

        const result = await sql`
            SELECT installation_cost
            FROM sites
            WHERE site_id = ${siteId}
        `;

        // Check if site exists
        if (result.length === 0) {
            return res.status(404).json({ message: "Site not found" });
        }

        const installCost = result[0].installation_cost;

        res.status(200).json({installCost: installCost});

    } catch (error) {
        console.log("Error getting the installation date ", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

// Function to get the average daily amount of energy sold back to the grid by site ID
export async function getDailySaleToGridBySiteID(req, res) {
    try {
        const {siteId} = req.params;

        const result = await sql`
            WITH daily_energy_sold AS (SELECT
                DATE (updated_time) AS day
               , SUM (grid_power_w)/1000 AS daily_sold_energy
            FROM solar_data
            WHERE grid_power_w > 0 AND site_id = ${siteId}
            GROUP BY DATE (updated_time)
                )

            SELECT PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY daily_sold_energy) AS lwr,
    PERCENTILE_CONT(0.50) WITHIN
            GROUP (ORDER BY daily_sold_energy) AS median,
                PERCENTILE_CONT(0.75) WITHIN
            GROUP (ORDER BY daily_sold_energy) AS upr
            FROM daily_energy_sold;
        `; // divide by 1000 to go from W to kW

        const dailySaleToGrid = {
            lwr: result[0].lwr,
            median: result[0].median,
            upr: result[0].upr
        };

        res.status(200).json({dailySaleToGrid});

    } catch (error) {
        console.log("Error getting the average daily amount of energy sold back to the grid ", error);
        res.status(500).json({message: "Internal server error"});
    }
}