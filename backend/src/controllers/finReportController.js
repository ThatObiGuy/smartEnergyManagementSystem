import { sql } from "../config/db.js";

// Function to get gross savings by site ID - not currently confident in the maths but it's a start
export async function getGrossSavingsBySiteID(req, res) {
    try {
        const { siteId } = req.params;
        const providerId = req.query.providerId || 1; // Default to first provider if not specified

        // Get provider tariff information
        const providerTariff = await sql`
            SELECT * FROM provider_tariffs WHERE tariff_id = ${providerId}
        `;

        if (providerTariff.length === 0) {
            return res.status(404).json({ message: "Provider tariff not found" });
        }

        const tariff = providerTariff[0];

        // SQL query to get hourly consumption and grid data in KWH
        const hourlyData = await sql`
            SELECT 
                EXTRACT(HOUR FROM updated_time) as hour,
                SUM(consumption_power_w * (1.0/12)) / 1000 as total_consumption_kwh,
                SUM(CASE WHEN grid_power_w < 0 THEN ABS(grid_power_w) * (1.0/12) ELSE 0 END) / 1000 as grid_purchases_kwh,
                SUM(CASE WHEN grid_power_w > 0 THEN grid_power_w * (1.0/12) ELSE 0 END) / 1000 as feed_in_kwh
            FROM solar_data
            WHERE site_id = ${siteId}
            GROUP BY EXTRACT(HOUR FROM updated_time)
            ORDER BY hour
        `; // We need to divide by 1000 to convert from Wh to kWh and multiply by 1/12 as we are getting 5 minute windows within the data

        let costWithoutPV = 0;
        let actualSpending = 0;

        // Calculate cost without PV/Battery System and actual spending
        for (const entry of hourlyData) {
            const hour = entry.hour;
            const time = new Date();
            time.setHours(hour, 0, 0, 0);

            // Determine which rate to use based on time of day
            let rate;
            if (isPeakTime(time, tariff.peak_start, tariff.peak_end)) {
                rate = tariff.peak_rate;
            } else if (isNightTime(time, tariff.night_start, tariff.night_end)) {
                rate = tariff.night_rate;
            } else {
                rate = tariff.day_rate;
            }

            // Total Consumption × Grid Tariff Rates = Cost without PV/Battery System
            costWithoutPV += entry.total_consumption_kwh * rate;

            // (Grid Purchases × Purchase Rates) - (Feed-in × Feed-in Rates) = What the consumer is actually spending on energy
            actualSpending += (entry.grid_purchases_kwh * rate) - (entry.feed_in_kwh * (tariff.buyback_rate || 0));
        }

        // Gross savings = Cost without PV/Battery System - What the consumer is actually spending on energy
        const grossSavings = costWithoutPV - actualSpending;

        res.status(200).json({
            grossSavings: Number(grossSavings.toFixed(2)),
            costWithoutPV: Number(costWithoutPV.toFixed(2)),
            actualSpending: Number(actualSpending.toFixed(2)),
            providerName: tariff.provider_name
        });
    }
    catch (error) {
        console.log("Error getting the gross savings", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

// Function to get gross savings for all providers by site ID
export async function getGrossSavingsAllProviders(req, res) {
    try {
        const { siteId } = req.params;

        // Get all provider tariffs
        const providerTariffs = await sql`
            SELECT * FROM provider_tariffs
        `;

        if (providerTariffs.length === 0) {
            return res.status(404).json({ message: "No provider tariffs found" });
        }

        // SQL query to get hourly consumption and grid data in KWH
        const hourlyData = await sql`
            SELECT 
                EXTRACT(HOUR FROM updated_time) as hour,
                SUM(consumption_power_w * (1.0/12)) / 1000 as total_consumption_kwh,
                SUM(CASE WHEN grid_power_w < 0 THEN ABS(grid_power_w) * (1.0/12) ELSE 0 END) / 1000 as grid_purchases_kwh,
                SUM(CASE WHEN grid_power_w > 0 THEN grid_power_w * (1.0/12) ELSE 0 END) / 1000 as feed_in_kwh
            FROM solar_data
            WHERE site_id = ${siteId}
            GROUP BY EXTRACT(HOUR FROM updated_time)
            ORDER BY hour
        `;

        const results = [];

        // Calculate gross savings for each provider
        for (const tariff of providerTariffs) {
            let costWithoutPV = 0;
            let actualSpending = 0;

            // Calculate cost without PV/Battery System and actual spending
            for (const entry of hourlyData) {
                const hour = entry.hour;
                const time = new Date();
                time.setHours(hour, 0, 0, 0);

                // Determine which rate to use based on time of day
                let rate;
                if (isPeakTime(time, tariff.peak_start, tariff.peak_end)) {
                    rate = tariff.peak_rate;
                } else if (isNightTime(time, tariff.night_start, tariff.night_end)) {
                    rate = tariff.night_rate;
                } else {
                    rate = tariff.day_rate;
                }

                // Total Consumption × Grid Tariff Rates = Cost without PV/Battery System
                costWithoutPV += entry.total_consumption_kwh * rate;

                // (Grid Purchases × Purchase Rates) - (Feed-in × Feed-in Rates) = What the consumer is actually spending on energy
                actualSpending += (entry.grid_purchases_kwh * rate) - (entry.feed_in_kwh * (tariff.buyback_rate || 0));
            }

            // Gross savings = Cost without PV/Battery System - What the consumer is actually spending on energy
            const grossSavings = costWithoutPV - actualSpending;

            results.push({
                tariffId: tariff.tariff_id,
                providerName: tariff.provider_name,
                grossSavings: Number(grossSavings.toFixed(2)),
                costWithoutPV: Number(costWithoutPV.toFixed(2)),
                actualSpending: Number(actualSpending.toFixed(2))
            });
        }

        res.status(200).json({ providers: results });
    }
    catch (error) {
        console.log("Error getting the gross savings for all providers", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

// Helper function to check if a time is within peak hours
function isPeakTime(time, peakStart, peakEnd) {
    if (!peakStart || !peakEnd) return false;

    const peakStartTime = new Date(time);
    const [peakStartHours, peakStartMinutes] = peakStart.split(':').map(Number);
    peakStartTime.setHours(peakStartHours, peakStartMinutes, 0, 0);

    const peakEndTime = new Date(time);
    const [peakEndHours, peakEndMinutes] = peakEnd.split(':').map(Number);
    peakEndTime.setHours(peakEndHours, peakEndMinutes, 0, 0);

    return time >= peakStartTime && time < peakEndTime;
}

// Helper function to check if a time is within night hours
function isNightTime(time, nightStart, nightEnd) {
    if (!nightStart || !nightEnd) return false;

    const nightStartTime = new Date(time);
    const [nightStartHours, nightStartMinutes] = nightStart.split(':').map(Number);
    nightStartTime.setHours(nightStartHours, nightStartMinutes, 0, 0);

    const nightEndTime = new Date(time);
    const [nightEndHours, nightEndMinutes] = nightEnd.split(':').map(Number);
    nightEndTime.setHours(nightEndHours, nightEndMinutes, 0, 0);

    // Handle case where night spans midnight
    if (nightStartTime > nightEndTime) {
        return time >= nightStartTime || time < nightEndTime;
    }

    return time >= nightStartTime && time < nightEndTime;
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
