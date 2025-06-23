import { sql } from "../config/db.js";

// Function to get site + summary by site ID
export async function getSiteByID(req, res) {
    try {
        const { siteId } = req.params;

        // Get basic site information
        const siteResult = await sql`
            SELECT *
            FROM sites
            WHERE site_id = ${siteId}
        `;

        if (siteResult.length === 0) {
            return res.status(404).json({ message: "Site not found" });
        }

        const site = siteResult[0];

        // Get the most recent date in the dataset for this site
        const latestDateResult = await sql`
            SELECT MAX(updated_time) as latest_date
            FROM solar_data
            WHERE site_id = ${siteId}
        `;

        const latestDate = latestDateResult[0]?.latest_date;

        if (!latestDate) {
            // If no data exists, return just the site info
            return res.json(site);
        }

        // Calculate statistics for DAY (last 24 hours from latest date)
        const dayStats = await calculateStats(siteId, sql`
            updated_time >= ${new Date(latestDate.getTime() - 24 * 60 * 60 * 1000)}
            AND updated_time <= ${latestDate}
        `);

        // Calculate statistics for WEEK (last 7 days from latest date)
        const weekStats = await calculateStats(siteId, sql`
            updated_time >= ${new Date(latestDate.getTime() - 7 * 24 * 60 * 60 * 1000)}
            AND updated_time <= ${latestDate}
        `);

        // Calculate statistics for MONTH (last 30 days from latest date)
        const monthStats = await calculateStats(siteId, sql`
            updated_time >= ${new Date(latestDate.getTime() - 30 * 24 * 60 * 60 * 1000)}
            AND updated_time <= ${latestDate}
        `);

        // Calculate statistics for YEAR (last 365 days from latest date)
        const yearStats = await calculateStats(siteId, sql`
            updated_time >= ${new Date(latestDate.getTime() - 365 * 24 * 60 * 60 * 1000)}
            AND updated_time <= ${latestDate}
        `);

        // Calculate statistics for TOTAL (all data)
        const totalStats = await calculateStats(siteId, sql`1=1`);

        // Combine all data and return
        const response = {
            ...site,
            energy_stats: {
                day: dayStats,
                week: weekStats,
                month: monthStats,
                year: yearStats,
                total: totalStats
            }
        };

        res.json(response);
    }
    catch (error) {
        console.log("Error getting the site", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

// Helper function to calculate energy statistics for a given time period
async function calculateStats(siteId, timeCondition) {
    try {
        // Calculate total production and consumption
        const totalsResult = await sql`
            SELECT 
                SUM(production_power_w) as total_production,
                SUM(consumption_power_w) as total_consumption
            FROM solar_data
            WHERE site_id = ${siteId}
            AND ${timeCondition}
        `;

        // Calculate production breakdown
        const productionBreakdownResult = await sql`
            SELECT 
                SUM(CASE WHEN production_power_w > 0 THEN production_power_w - COALESCE(discharging_power_w, 0) - COALESCE(purchasing_power_w, 0) ELSE 0 END) as solar_production,
                SUM(COALESCE(discharging_power_w, 0)) as battery_discharge,
                SUM(COALESCE(feed_in_power_w, 0)) as grid_purchase
            FROM solar_data
            WHERE site_id = ${siteId}
            AND ${timeCondition}
        `;

        // Calculate consumption breakdown
        const consumptionBreakdownResult = await sql`
            SELECT 
                SUM(COALESCE(charging_power_w, 0)) as battery_charging,
                SUM(COALESCE(feed_in_power_w, 0)) as grid_selling,
                SUM(CASE WHEN consumption_power_w > 0 THEN consumption_power_w - COALESCE(charging_power_w, 0) - COALESCE(feed_in_power_w, 0) ELSE 0 END) as home_power
            FROM solar_data
            WHERE site_id = ${siteId}
            AND ${timeCondition}
        `;

        // Return the statistics
        return {
            total_production: totalsResult[0]?.total_production || 0,
            production_breakdown: {
                solar_panels: productionBreakdownResult[0]?.solar_production || 0,
                battery_discharge: productionBreakdownResult[0]?.battery_discharge || 0,
                grid_purchase: productionBreakdownResult[0]?.grid_purchase || 0
            },
            total_consumption: totalsResult[0]?.total_consumption || 0,
            consumption_breakdown: {
                battery_charging: consumptionBreakdownResult[0]?.battery_charging || 0,
                grid_selling: consumptionBreakdownResult[0]?.grid_selling || 0,
                home_power: consumptionBreakdownResult[0]?.home_power || 0
            }
        };
    } catch (error) {
        console.log("Error calculating stats", error);
        return {
            total_production: 0,
            production_breakdown: {
                solar_panels: 0,
                battery_discharge: 0,
                grid_purchase: 0
            },
            total_consumption: 0,
            consumption_breakdown: {
                battery_charging: 0,
                grid_selling: 0,
                home_power: 0
            }
        };
    }
}
