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

        // Calculate if data is live or simulated
        const now = new Date();
        const oneAndHalfHoursAgo = new Date(now.getTime() - 90 * 60 * 1000);

        const dataType = latestDate > oneAndHalfHoursAgo ? 'Live' : 'Historical';


        // Combine all data and return
        const response = {
            ...site,
            energy_stats: {
                day: dayStats,
                week: weekStats,
                month: monthStats,
                year: yearStats,
                total: totalStats
            },
            dataType: dataType
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
                SUM(LEAST(production_power_w, consumption_power_w)) + SUM(-discharging_power_w) + SUM(-purchasing_power_w) as total_consumption
            FROM solar_data
            WHERE site_id = ${siteId}
            AND ${timeCondition}
        `;

        // Calculate production breakdown
        const productionBreakdownResult = await sql`
            SELECT
                SUM(LEAST(production_power_w, consumption_power_w)) as to_home,
                SUM(LEAST(GREATEST(production_power_w - consumption_power_w, 0), charging_power_w)) AS to_battery,
                SUM(
                        GREATEST(
                                production_power_w
                                    - LEAST(production_power_w, consumption_power_w)
                                    - LEAST(GREATEST(production_power_w - consumption_power_w, 0), charging_power_w),
                                0
                        )
                ) AS to_grid
            FROM solar_data
            WHERE site_id = ${siteId}
            AND ${timeCondition}
        `;

        // Calculate consumption breakdown
        const consumptionBreakdownResult = await sql`
            SELECT
                SUM(LEAST(production_power_w, consumption_power_w)) AS from_solar,
                SUM(-discharging_power_w) as from_battery,
                SUM(-purchasing_power_w) AS from_grid
            FROM solar_data
            WHERE site_id = ${siteId}
            AND ${timeCondition}
        `;

        // Return the statistics
        return {
            total_production: totalsResult[0]?.total_production || 0,
            production_breakdown: {
                to_home: productionBreakdownResult[0]?.to_home || 0,
                to_battery: productionBreakdownResult[0]?.to_battery || 0,
                to_grid: productionBreakdownResult[0]?.to_grid || 0
            },
            total_consumption: totalsResult[0]?.total_consumption || 0,
            consumption_breakdown: {
                from_solar: consumptionBreakdownResult[0]?.from_solar || 0,
                from_battery: consumptionBreakdownResult[0]?.from_battery || 0,
                from_grid: consumptionBreakdownResult[0]?.from_grid || 0
            }
        };
    } catch (error) {
        console.log("Error calculating stats", error);
        return {
            total_production: 0,
            production_breakdown: {
                to_home: 0,
                to_battery: 0,
                to_grid: 0
            },
            total_consumption: 0,
            consumption_breakdown: {
                from_solar: 0,
                from_battery: 0,
                from_grid: 0
            }
        };
    }
}

// Function to get relevant system status + SOC by site ID
export async function getStatusByID(req, res) {
    try {
        const siteId = req.params.siteId;
        const dataType = req.query.dataType;

        if (!siteId || !dataType) {
            return res.status(400).json({ error: 'Site ID and dataType are required' });
        }

        let result;

        if (dataType === 'Live') {
            // Get most recent solar_data entry
            result = await sql`
                SELECT soc_percent, solar_status 
                FROM solar_data 
                WHERE site_id = ${siteId}
                ORDER BY updated_time DESC 
                LIMIT 1
            `;
        } else if (dataType === 'Historical') {
            // Get time rounded down to nearest 5 minutes
            const now = new Date();
            const month = now.getMonth() + 1; // JavaScript months are 0-indexed
            const day = now.getDate();

            // Round current time down to nearest 5 minute multiple
            const hours = now.getHours();
            const minutes = Math.floor(now.getMinutes() / 5) * 5;
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

            // First try the exact time match
            result = await sql`
                SELECT soc_percent, solar_status 
                FROM toy_solar_data 
                WHERE site_id = ${siteId}
                AND month = ${month}
                AND day = ${day}
                AND time = ${timeString}
            `;

            // If no data found, try finding the closest time within the last hour
            if (result.length === 0) {
                result = await sql`
                    SELECT soc_percent, solar_status, ABS(EXTRACT(EPOCH FROM time::time - ${timeString}::time)) as time_diff
                    FROM toy_solar_data
                    WHERE site_id = ${siteId}
                    AND month = ${month}
                    AND day = ${day}
                    AND ABS(EXTRACT(EPOCH FROM time::time - ${timeString}::time)) <= 3600
                    ORDER BY time_diff ASC
                    LIMIT 1
                `;

                // If still no data, try the same time from the previous day
                if (result.length === 0) {
                    const previousDay = day > 1 ? day - 1 : day;
                    const previousMonth = day > 1 ? month : (month > 1 ? month - 1 : 12);

                    result = await sql`
                        SELECT soc_percent, solar_status
                        FROM toy_solar_data
                        WHERE site_id = ${siteId}
                        AND month = ${previousMonth}
                        AND day = ${previousDay}
                        AND time = ${timeString}
                    `;
                }
            }
        } else {
            return res.status(400).json({ error: 'Invalid dataType' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'No data found' });
        }

        res.json(result[0]);
    } catch (err) {
        console.error('Error fetching site status:', err);
        res.status(500).json({ error: 'Server error' });
    }
}